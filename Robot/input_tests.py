from machine import I2C, Pin, ADC, time_pulse_us
import time

class RCWL9610_I2C:
    """Driver for the RCWL-9610 ultrasonic module (TK50 board, J1 shorted / J2 open = I2C mode).

    Protocol per RCWL-9610-V3.0 datasheet:
      - I2C address: 0x57
      - Write 0x01 to start a ranging cycle
      - Wait >=120ms for the cycle to complete
      - Read 3 bytes: BYTE_H, BYTE_M, BYTE_L
      - distance_mm = (BYTE_H<<16 | BYTE_M<<8 | BYTE_L) / 1000
    """

    ADDR = 0x57
    START_CMD = 0x01
    RANGING_DELAY_MS = 150  # datasheet: 120ms max cycle time, margin added

    def __init__(self, i2c: I2C, address=ADDR):
        self.i2c = i2c
        self.address = address

    def distance_mm(self):
        """Returns distance in mm, or None if the module NACKs / read fails."""
        try:
            self.i2c.writeto(self.address, bytes([self.START_CMD]))
        except OSError:
            return None

        time.sleep_ms(self.RANGING_DELAY_MS)

        try:
            data = self.i2c.readfrom(self.address, 3)
        except OSError:
            return None

        raw = (data[0] << 16) | (data[1] << 8) | data[2]
        return raw / 1000.0

    def distance_cm(self):
        d = self.distance_mm()
        return None if d is None else d / 10.0


class TCA9548A:
    """Driver for the TCA9548APWR I2C mux/switch.

    Address pins A0/A1/A2 are all tied high on the Pico2W_Base_Board, giving
    target address 0x77 (see TCA9548A Table 7-1: A2 A1 A0 = H H H -> 119 / 0x77).
    """

    ADDR = 0x77

    def __init__(self, i2c: I2C, address=ADDR, reset_pin: Pin = None):
        self.i2c = i2c
        self.address = address
        self.reset_pin = reset_pin
        if self.reset_pin is not None:
            # !MUX_RST is active-low; drive high so the mux isn't held in reset.
            self.reset_pin.init(Pin.OUT, value=1)

    def select_channel(self, channel):
        """Enables exactly one downstream channel (0-7), disabling all others."""
        self.i2c.writeto(self.address, bytes([1 << channel]))


class HCSR04:
    """Driver for the HC-SR04 ultrasonic distance sensor (trigger/echo, no I2C)."""

    SOUND_CM_PER_US = 0.0343 / 2.0  # 343 m/s, halved for the round trip
    TIMEOUT_US = 30000              # ~5m round-trip max before giving up

    def __init__(self, trigger: Pin, echo: Pin):
        self.trigger = trigger
        self.echo = echo
        self.trigger.init(Pin.OUT, value=0)
        self.echo.init(Pin.IN)

    def distance_cm(self):
        """Returns distance in cm, or None if no echo returns within the timeout."""
        self.trigger.value(0)
        time.sleep_us(2)
        self.trigger.value(1)
        time.sleep_us(10)
        self.trigger.value(0)

        pulse_width = time_pulse_us(self.echo, 1, self.TIMEOUT_US)
        if pulse_width < 0:
            return None
        return pulse_width * self.SOUND_CM_PER_US


# --- Example usage: 4x RCWL-9610 (I2C mux ch 2-5) + 2x HC-SR04 + 3x analog ---
if __name__ == "__main__":
    # Raspberry Pi Pico 2 W (RP2350): I2C0 hardware block on GP4 (SDA) / GP5 (SCL),
    # wired to the TCA9548APWR mux's upstream SDA/SCL (U4-23 / U4-22).
    i2c = I2C(0, scl=Pin(5), sda=Pin(4), freq=100000)

    # !MUX_RST is on GP17 (U4-3).
    mux_rst = Pin(17)
    mux = TCA9548A(i2c, reset_pin=mux_rst)

    # Same sensor (fixed I2C address 0x57) sits behind each mux channel.
    i2c_sensor = RCWL9610_I2C(i2c)
    MUX_CHANNELS = [2, 3, 4, 5]

    # TRIG_0/ECHO_0 = GP2/GP3, TRIG_1/ECHO_1 = GP6/GP7
    hcsr04_sensors = [
        HCSR04(trigger=Pin(2, Pin.OUT), echo=Pin(3, Pin.IN)),
        HCSR04(trigger=Pin(6, Pin.OUT), echo=Pin(7, Pin.IN)),
    ]

    # ADC_0/ADC_1/ADC_2 = GP26/GP27/GP28
    adc_sensors = [ADC(Pin(26)), ADC(Pin(27)), ADC(Pin(28))]

    while True:
        for ch in MUX_CHANNELS:
            mux.select_channel(ch)
            d = i2c_sensor.distance_cm()
            if d is None:
                print("I2C Ch {}: No response from sensor (check address/wiring)".format(ch))
            else:
                print("I2C Ch {}: Distance: {:.1f} cm".format(ch, d))

        for idx, hc in enumerate(hcsr04_sensors):
            d = hc.distance_cm()
            if d is None:
                print("HC-SR04 {}: No echo received (check wiring/range)".format(idx))
            else:
                print("HC-SR04 {}: Distance: {:.1f} cm".format(idx, d))
            time.sleep_ms(60)  # settle time so back-to-back sensors don't cross-talk

        for idx, adc in enumerate(adc_sensors):
            raw = adc.read_u16()
            voltage = raw * 3.3 / 65535
            print("ADC_{}: {:.3f} V (raw {})".format(idx, voltage, raw))

        time.sleep_ms(50)
