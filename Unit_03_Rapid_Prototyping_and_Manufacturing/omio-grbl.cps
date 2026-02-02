/**
  Copyright (C) 2012-2016 by Autodesk, Inc.
  All rights reserved.

  OmioCNC Grbl post processor configuration.

  This postprocessor has been modified to work with
  the OmioCNC Orange Box using the following grbl code
  as a base:

  $Revision: 41369 65a1f6cb57e3c7389dc895ea10958fc2f7947b0d $
  $Date: 2017-03-20 14:12:44 $
  
  FORKID {154F7C00-6549-4c77-ADE0-79375FE5F2AA}
  
  Modifications made by Mark Hedley Jones 2017.
*/

description = "OmioCNC Grbl";
vendor = "grbl";
vendorUrl = "https://github.com/grbl/grbl/wiki";
legal = "Copyright (C) 2012-2016 by Autodesk, Inc.";
certificationLevel = 2;
minimumRevision = 24000;

longDescription = "Milling post for OmioCNC Grbl.";

extension = "nc";
setCodePage("ascii");

capabilities = CAPABILITY_MILLING;
tolerance = spatial(0.002, MM);

minimumChordLength = spatial(0.01, MM);
minimumCircularRadius = spatial(0.01, MM);
maximumCircularRadius = spatial(1000, MM);
minimumCircularSweep = toRad(0.01);
maximumCircularSweep = toRad(180);
allowHelicalMoves = true;
allowedCircularPlanes = undefined; // allow any circular motion

// user-defined properties
properties = {
  writeMachine: false, // write machine
  writeTools: false, // writes the tools
  useG28: false, // disable to avoid G28 output for safe machine retracts - when disabled you must manually ensure safe retracts
  showSequenceNumbers: false, // show sequence numbers
  sequenceNumberStart: 10, // first sequence number
  sequenceNumberIncrement: 1, // increment for sequence numbers
  separateWordsWithSpace: true // specifies that the words should be separated with a white space
};

var numberOfToolSlots = 9999;

var mapCoolantTable = new Table(
  [9, 8],
  {initial:COOLANT_OFF, force:false},
  "Invalid coolant mode"
);

var gFormat = createFormat({prefix:"G", width:2, zeropad:true, decimals:3});
var mFormat = createFormat({prefix:"M", width:2, zeropad:true, decimals:3});

// Note: If you see a warning about duplicate property names for "decimals",
// you may adjust these definitions as needed.
var xyzFormat = createFormat({decimals:(unit == MM ? 3 : 4), width:2, zeropad:true, decimals:3});
var feedFormat = createFormat({decimals:(unit == MM ? 1 : 2)});
var toolFormat = createFormat({decimals:0});
var rpmFormat = createFormat({decimals:0});
var secFormat = createFormat({decimals:3, forceDecimal:true}); // seconds - range 0.001-1000
var taperFormat = createFormat({decimals:1, scale:DEG});

var xOutput = createVariable({prefix:"X"}, xyzFormat);
var yOutput = createVariable({prefix:"Y"}, xyzFormat);
var zOutput = createVariable({prefix:"Z"}, xyzFormat);
var feedOutput = createVariable({prefix:"F"}, feedFormat);
var sOutput = createVariable({prefix:"S", force:true}, rpmFormat);

// circular output
var iOutput = createReferenceVariable({prefix:"I", force:true}, xyzFormat);
var jOutput = createReferenceVariable({prefix:"J", force:true}, xyzFormat);
var kOutput = createReferenceVariable({prefix:"K", force:true}, xyzFormat);

var gMotionModal = createModal({}, gFormat); // modal group 1 (G0-G3, etc.)
var gPlaneModal = createModal({onchange:function () {gMotionModal.reset();}}, gFormat); // modal group 2 (G17-19)
var gAbsIncModal = createModal({}, gFormat); // modal group 3 (G90-91)
var gFeedModeModal = createModal({}, gFormat); // modal group 5 (G93-94)
var gUnitModal = createModal({}, gFormat); // modal group 6 (G20-21)

var WARNING_WORK_OFFSET = 0;

// Global variable to capture the "call program" message.
var callProgramMsg = "";

// collected state
var sequenceNumber;
var currentWorkOffset;

/**
  Writes the specified block.
*/
function writeBlock() {
  if (properties.showSequenceNumbers) {
    writeWords2("N" + sequenceNumber, arguments);
    sequenceNumber += properties.sequenceNumberIncrement;
  } else {
    writeWords(arguments);
  }
}

function formatComment(text) {
  return "(" + String(text).replace(/[\(\)]/g, "") + ")";
}

/**
  Output a comment.
*/
function writeComment(text) {
  writeln(formatComment(text));
}

/**
  Force output of X, Y, and Z.
*/
function forceXYZ() { 
  writeComment("forceXYZ");
  xOutput.reset();
  yOutput.reset();
  zOutput.reset();
}

/**
  Force output of X, Y, Z, and F on next output.
*/
function forceAny() {
  writeComment("ForceAny");
  forceXYZ();
  feedOutput.reset();
}

/**
  onComment() is called when the "call program" option is used.
  If the message is a valid number, we treat it as our custom pause/move command.
  Otherwise, we output it as a normal comment.
*/
function onComment(message) {
  var yValue = parseFloat(message);
  if (!isNaN(yValue)) {
    // Output the custom sequence:
    // 1. Rapid move to Z20.
    writeBlock(gFormat.format(0), "Z" + xyzFormat.format(20));
    // 2. Stop the spindle (M05).
    writeBlock(mFormat.format(5));
    // 3. Rapid move to Y using the value from the message.
    writeBlock(gFormat.format(0), "Y" + xyzFormat.format(yValue));
    // 4. Pause program execution (M00).
    writeBlock(mFormat.format(0));
  } else {
    // If not numeric, simply output the comment.
    writeln(formatComment(message));
  }
}

function onOpen() {
  if (!properties.separateWordsWithSpace) {
    setWordSeparator("");
  }

  sequenceNumber = properties.sequenceNumberStart;

  if ((getNumberOfSections() > 0) && (getSection(0).workOffset == 0)) {
    for (var i = 0; i < getNumberOfSections(); ++i) {
      if (getSection(i).workOffset > 0) {
        error(localize("Using multiple work offsets is not possible if the initial work offset is 0."));
        return;
      }
    }
  }
}

function onSection() {  
  var insertToolCall = isFirstSection() ||
    currentSection.getForceToolChange && currentSection.getForceToolChange() ||
    (tool.number != getPreviousSection().getTool().number);
  
  var retracted = false; // indicates that the tool has been retracted to the safe plane
  var newWorkOffset = isFirstSection() ||
    (getPreviousSection().workOffset != currentSection.workOffset);
  var newWorkPlane = isFirstSection() ||
    !isSameDirection(getPreviousSection().getGlobalFinalToolAxis(), currentSection.getGlobalInitialToolAxis());
  if (insertToolCall || newWorkOffset || newWorkPlane) {
    // Stop spindle before retract during tool change.
    if (insertToolCall && !isFirstSection()) {
      onCommand(COMMAND_STOP_SPINDLE);
    }
    if (properties.useG28) {
      // Retract to safe plane.
      retracted = true;
      writeBlock(gFormat.format(28), gAbsIncModal.format(91), "Z" + xyzFormat.format(0));
      writeBlock(gAbsIncModal.format(90));
      zOutput.reset();
    }
  }
 
  writeBlock(mFormat.format(tool.clockwise ? 3 : 4), sOutput.format(tool.spindleRPM));
}

function onDwell(seconds) {  
  if (seconds > 99999.999) {
    warning(localize("Dwelling time is out of range."));
  }
  seconds = clamp(0.001, seconds, 99999.999);
  writeBlock(gFormat.format(4), "P" + secFormat.format(seconds));
}

function onSpindleSpeed(spindleSpeed) {
  writeBlock(sOutput.format(spindleSpeed));
}

var pendingRadiusCompensation = -1;

function onRadiusCompensation() {
  pendingRadiusCompensation = radiusCompensation;
}

function onRapid(_x, _y, _z) {  
  var x = xOutput.format(_x);
  var y = yOutput.format(_y);
  var z = zOutput.format(_z);
  if (x || y || z) {
    if (pendingRadiusCompensation >= 0) {
      error(localize("Radius compensation mode cannot be changed at rapid traversal."));
      return;
    }
    writeBlock(gMotionModal.format(0), x, y, z);
    feedOutput.reset();
  }
}

function onLinear(_x, _y, _z, feed) {  
  if (pendingRadiusCompensation >= 0) {
    xOutput.reset();
    yOutput.reset();
  }
  var x = xOutput.format(_x);
  var y = yOutput.format(_y);
  var z = zOutput.format(_z);
  var f = feedOutput.format(feed);
  if (x || y || z) {
    writeBlock(gMotionModal.format(1), x, y, z, f);
  } else if (f) {
    writeBlock(gMotionModal.format(1), f);
  }
}

function onRapid5D(_x, _y, _z, _a, _b, _c) {
  error(localize("Multi-axis motion is not supported."));
}

function onLinear5D(_x, _y, _z, _a, _b, _c, feed) {
  error(localize("Multi-axis motion is not supported."));
}

function onCircular(clockwise, cx, cy, cz, x, y, z, feed) {
  if (pendingRadiusCompensation >= 0) {
    xOutput.reset();
    yOutput.reset();
  }
  var start = getCurrentPosition();
  if (isFullCircle()) {
    if (isHelical()) {
      linearize(tolerance);
      return;
    }
    switch (getCircularPlane()) {
    case PLANE_XY:
      writeBlock(gPlaneModal.format(17));
      writeBlock(gMotionModal.format(clockwise ? 2 : 3), xOutput.format(x), iOutput.format(cx - start.x, 0), jOutput.format(cy - start.y, 0), feedOutput.format(feed));
      break;
    case PLANE_ZX:
      writeBlock(gPlaneModal.format(18));
      writeBlock(gMotionModal.format(clockwise ? 2 : 3), zOutput.format(z), iOutput.format(cx - start.x, 0), kOutput.format(cz - start.z, 0), feedOutput.format(feed));
      break;
    case PLANE_YZ:
      writeBlock(gPlaneModal.format(19));
      writeBlock(gMotionModal.format(clockwise ? 2 : 3), yOutput.format(y), jOutput.format(cy - start.y, 0), kOutput.format(cz - start.z, 0), feedOutput.format(feed));
      break;
    default:
      linearize(tolerance);
    }
  } else {
    switch (getCircularPlane()) {
    case PLANE_XY:
      writeBlock(gPlaneModal.format(17));
      writeBlock(gMotionModal.format(clockwise ? 2 : 3), xOutput.format(x), yOutput.format(y), zOutput.format(z), iOutput.format(cx - start.x, 0), jOutput.format(cy - start.y, 0), feedOutput.format(feed));
      break;
    case PLANE_ZX:
      writeBlock(gPlaneModal.format(18));
      writeBlock(gMotionModal.format(clockwise ? 2 : 3), xOutput.format(x), yOutput.format(y), zOutput.format(z), iOutput.format(cx - start.x, 0), kOutput.format(cz - start.z, 0), feedOutput.format(feed));
      break;
    case PLANE_YZ:
      writeBlock(gPlaneModal.format(19));
      writeBlock(gMotionModal.format(clockwise ? 2 : 3), xOutput.format(x), yOutput.format(y), zOutput.format(z), jOutput.format(cy - start.y, 0), kOutput.format(cz - start.z, 0), feedOutput.format(feed));
      break;
    default:
      linearize(tolerance);
    }
  }
}

// Define custom command constant for pause/move with variable Y value.
var COMMAND_CUSTOM_PAUSE_MOVE = 10;

var mapCommand = {
  COMMAND_STOP:0,
  COMMAND_END:2,
  COMMAND_SPINDLE_CLOCKWISE:3,
  COMMAND_SPINDLE_COUNTERCLOCKWISE:4,
  COMMAND_STOP_SPINDLE:5,
  // New custom command (if you choose to trigger it via onCommand):
  COMMAND_CUSTOM_PAUSE_MOVE:10,
  COMMAND_COOLANT_ON:8,
  COMMAND_COOLANT_OFF:9
};

function onCommand(command) {
  switch (command) {
  case COMMAND_START_SPINDLE:
    onCommand(tool.clockwise ? COMMAND_SPINDLE_CLOCKWISE : COMMAND_SPINDLE_COUNTERCLOCKWISE);
    return;
  case COMMAND_LOCK_MULTI_AXIS:
    return;
  case COMMAND_UNLOCK_MULTI_AXIS:
    return;
  case COMMAND_BREAK_CONTROL:
    return;
  case COMMAND_TOOL_MEASURE:
    return;
  // Custom command for pause/move sequence with variable Y value.
  case COMMAND_CUSTOM_PAUSE_MOVE:
    // Default Y value is 550.
    var yValue = 550;
    if (typeof callProgramMsg !== 'undefined' && callProgramMsg.trim() !== "") {
      var parsedValue = parseFloat(callProgramMsg);
      if (!isNaN(parsedValue)) {
        yValue = parsedValue;
      }
    }
    writeBlock(gFormat.format(0), "Z" + xyzFormat.format(20));
    writeBlock(mFormat.format(5));
    writeBlock(gFormat.format(0), "Y" + xyzFormat.format(yValue));
    writeBlock(mFormat.format(0));
    return;
  }

  var stringId = getCommandStringId(command);
  var mcode = mapCommand[stringId];
  if (mcode != undefined) {
    writeBlock(mFormat.format(mcode));
  } else {
    onUnsupportedCommand(command);
  }
}

function onSectionEnd() {
  forceAny();
}

function onClose() {
  if (properties.useG28) {
    writeBlock(gFormat.format(28), gAbsIncModal.format(91), "Z" + xyzFormat.format(0));
    zOutput.reset();
  }
  writeBlock(mFormat.format(05));
  // Optionally, you could return home here if needed.
}
