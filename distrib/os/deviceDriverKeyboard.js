///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            // Numbers & symbols
            else if (((keyCode >= 48) && (keyCode <= 57)) ||
                (keyCode === 32) ||
                (keyCode === 13)) {

                //Use numCharHandler to determine if the user is entering a number or a symbol

                chr = numCharHandler(keyCode, isShifted);
                _KernelInputQueue.enqueue(chr);

            // Symbols
            } else if (((keyCode >= 186) &&(keyCode <= 192)) ||
                      ((keyCode >= 219) && (keyCode <= 222))){

                // Use charHandler to find out what is being used
                var char = charHandler(keyCode,isShifted);
                _KernelInputQueue.enqueue(char);

            // Handle special input
            } else if ((keyCode === 8) || (keyCode === 38) || (keyCode === 40) || (keyCode === 9)) {
                _KernelInputQueue.enqueue(keyCode);

            }
        };

        // charHandler is two switch cases because yours truly couldn't think of a better solution
        function charHandler(keyCode, shifted){
            if(!shifted){
                switch(keyCode){
                    case 186: return ';';
                    case 187: return '=';
                    case 188: return ',';
                    case 189: return '-';
                    case 190: return '.';
                    case 191: return '/';
                    case 192: return '`';
                    case 219: return '[';
                    case 220: return '\\';
                    case 221: return ']';
                    case 222: return '\'';
                    default:  break;
                }
            } else {
                switch(keyCode){
                    case 186: return ':';
                    case 187: return '+';
                    case 188: return '<';
                    case 189: return '_';
                    case 190: return '>';
                    case 191: return '?';
                    case 192: return '~';
                    case 219: return '{';
                    case 220: return '|';
                    case 221: return '}';
                    case 222: return '\"';
                    default: break;
                }
            }
        }

        // This function is for determining if the user is entering a number or symbol
        function numCharHandler(keyCode, shifted){
            if(!shifted){
                return String.fromCharCode(keyCode);
            } else {
                switch(keyCode) {
                    case 48: return ')';
                    case 49: return '!';
                    case 50: return '@';
                    case 51: return '#';
                    case 52: return '$';
                    case 53: return '%';
                    case 54: return '^';
                    case 55: return '&';
                    case 56: return '*';
                    case 57: return '(';
                    default: break;
                }
            }
        }


        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
