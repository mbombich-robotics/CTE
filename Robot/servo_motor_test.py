from machine import Pin, PWM
import time

# Pico2W_Base_Board Rev A pin mapping (Pico2W_Base_Board_IO_Mapping.xlsx):
#   SERVO_0 = GP9, SERVO_1 = GP11           (Pololu micro Gripper Kit #3551 servos)
#   MTR0_PWM = GP0, MTR0_INA = GP8, MTR0_INB = GP10   (Pololu VNH5019 driver 0)
#   MTR1_PWM = GP1, MTR1_INA = GP14, MTR1_INB = GP15  (Pololu VNH5019 driver 1)
#
# Note: board only has SERVO_0/SERVO_1 (no "SERVO_2"), so that's what's driven here.
#
# Hardware note: on the RP2350, GP0 and GP1 are channel A/B of the *same* PWM
# slice (slice = gpio // 2), so MTR0_PWM and MTR1_PWM are locked to one shared
# frequency -- only duty cycle is independent per channel. Per your call, both
# motors run at 15kHz (MTR0's originally-requested 20kHz isn't achievable at
# the same time as MTR1 on this pin pairing).

SERVO_FREQ_HZ = 50
SERVO_MIN_US = 1000   # 1ms high time
SERVO_MAX_US = 2000   # 2ms high time

MOTOR_FREQ_HZ = 15000
MOTOR_MIN_DUTY = 0.20
MOTOR_MAX_DUTY = 1.00

SWEEP_MS = 3000        # time for one direction of the ramp (min->max or max->min)
UPDATE_MS = 20          # update interval; matches the servos' own 20ms frame period

# --- Servos ---
servo0 = PWM(Pin(9))
servo0.freq(SERVO_FREQ_HZ)
servo1 = PWM(Pin(11))
servo1.freq(SERVO_FREQ_HZ)

# --- Motors ---
mtr0_pwm = PWM(Pin(0))
mtr0_pwm.freq(MOTOR_FREQ_HZ)
mtr1_pwm = PWM(Pin(1))
mtr1_pwm.freq(MOTOR_FREQ_HZ)

# Direction pins: both motors held forward (INA=1, INB=0) for the whole test.
# Duty only ranges 20%-100%, so both motors are continuously "active" throughout.
mtr0_ina = Pin(8, Pin.OUT, value=1)
mtr0_inb = Pin(10, Pin.OUT, value=0)
mtr1_ina = Pin(14, Pin.OUT, value=1)
mtr1_inb = Pin(15, Pin.OUT, value=0)


def triangle_fraction(elapsed_ms, ramp_ms):
    """0 -> 1 over ramp_ms, then 1 -> 0 over the next ramp_ms, repeating."""
    cycle_ms = 2 * ramp_ms
    t = elapsed_ms % cycle_ms
    if t <= ramp_ms:
        return t / ramp_ms
    return 1.0 - (t - ramp_ms) / ramp_ms


def stop_all():
    mtr0_pwm.duty_u16(0)
    mtr1_pwm.duty_u16(0)


if __name__ == "__main__":
    start_ms = time.ticks_ms()
    try:
        while True:
            elapsed = time.ticks_diff(time.ticks_ms(), start_ms)
            frac = triangle_fraction(elapsed, SWEEP_MS)  # 0..1..0, shared by servos & motors

            # SERVO_0: min -> max -> min. SERVO_1: mirrored (180 deg out of phase),
            # so it's at max when SERVO_0 is at min, and vice versa.
            servo0_us = SERVO_MIN_US + frac * (SERVO_MAX_US - SERVO_MIN_US)
            servo1_us = SERVO_MAX_US - frac * (SERVO_MAX_US - SERVO_MIN_US)
            servo0.duty_ns(int(servo0_us * 1000))
            servo1.duty_ns(int(servo1_us * 1000))

            # Both motors: 20% -> 100% -> 20% duty cycle, same ramp timing.
            duty_frac = MOTOR_MIN_DUTY + frac * (MOTOR_MAX_DUTY - MOTOR_MIN_DUTY)
            duty_u16 = int(duty_frac * 65535)
            mtr0_pwm.duty_u16(duty_u16)
            mtr1_pwm.duty_u16(duty_u16)

            time.sleep_ms(UPDATE_MS)
    except KeyboardInterrupt:
        # Stop clicked in Thonny -- don't leave the motors spinning.
        stop_all()
        raise
