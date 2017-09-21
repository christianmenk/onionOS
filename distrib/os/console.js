///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, cmdHistory, historyIndex) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.cmdHistory = new Array();
            this.historyIndex = historyIndex;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    this.cmdHistory.push(this.buffer);
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    this.historyIndex = this.cmdHistory.length;
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                    // Handling backspace
                } else if (chr === 8) {
                    // Check to make sure there is something to delete
                    if (this.buffer.length !== 0) {
                        var lastChar = this.buffer[this.buffer.length - 1];
                        this.bsHandler(lastChar);

                        // Remove last letter of buffer
                        this.buffer = this.buffer.slice(0, this.buffer.length - 1);
                    }
                    // Up arrow handling
                } else if (chr === 38){
                    this.historyIndex -= 1;
                    this.getCommand();

                    // Down arrow handling
                } else if (chr === 40){
                    this.historyIndex += 1;
                    this.getCommand();

                    // Handle tab completion
                } else if (chr === 9){
                    this.tabMatch();
                }

                // Normal letters
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;

            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;

            /*                                      SCROLLING
                Take snapshot of canvas using getImageData using the current font size as an offset
                if the Y position exceeds the canvas height. Then, use putImageData to place the offset'd
                (is that a word?) snapshot back onto the canvas, then reassign the Y position.
                                                                                                           */
            if (this.currentYPosition >= _Canvas.height) {
                var snapshot = _DrawingContext.getImageData(0, this.currentFontSize + 5, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(snapshot, 0, 0);
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }

        };


        /*                                           TAB COMPLETION
            Tab completion function works through iterations of the command list and pushing matches to the
            multipleMatches array, then analyzing the results of the array based on number of matches (the array
            length) and producing output based off of the results
                                                                                                                 */
        Console.prototype.tabMatch = function (){
                // Two variables, an array for possible matches and a string for storing
                var multipleMatches = new Array();
                var match;

                // Iterate through possible matches in the commandList
                for (var i = 0; i < _OsShell.commandList.length; i++) {
                    // Get next command in commandList
                    var cmd = _OsShell.commandList[i].command;
                    // If the 'cmd' matches the buffer, push it to the multipleMatches array
                    if (this.buffer === cmd.substr(0, this.buffer.length)) {
                        multipleMatches.push(cmd);
                        // Trim the matched command so letter(s) will not be duplicated
                         match = cmd.slice(this.buffer.length);
                    }
                }

                // If no matches, alert the user
                if(multipleMatches.length === 0) {
                    this.advanceLine();
                    this.putText("No available commands.");
                    this.advanceLine();
                    _OsShell.putPrompt();
                    // Reset the buffer
                    this.buffer = "";

                    // If one match, complete the command
                } else if (multipleMatches.length === 1) {
                    this.buffer = this.buffer + match;
                    this.putText(match);

                    // If multiple matches, list possible commands
                } else if (multipleMatches.length > 1) {
                    this.advanceLine();
                    this.putText("Available commands: ");
                    this.advanceLine();
                    for (var i = 0; i < multipleMatches.length; i++) {
                        this.putText(multipleMatches[i]);
                        this.advanceLine();
                    }
                    // Reset prompt and re-display user input
                    _OsShell.putPrompt();
                    this.putText(this.buffer);
                }
        };

        // Function used for handling the historyIndex and displaying the cmdHistory array elements
        // Honestly it could be improved it looks kinda gross
        Console.prototype.getCommand = function (type){
            this.removeLine();
            if(this.cmdHistory.length === 0){
                this.historyIndex = 0;
            }

            if (this.historyIndex < 0){
                this.historyIndex = 0;
            } else if (this.historyIndex >= this.cmdHistory.length){
                this.historyIndex = this.cmdHistory.length - 1;
            }

            this.buffer = this.cmdHistory[this.historyIndex];
            this.putText(this.buffer);
        };

        // Had to make this to use with the getCommand function, originally I thought it existed but to my demise it did not
        Console.prototype.removeLine = function() {
            if(this.buffer.length !== 0) {
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
                this.currentXPosition = this.currentXPosition - offset;
                _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, this.currentXPosition + offset, this.currentYPosition + _FontHeightMargin);
                this.buffer = "";
            }
        };

        // I have to admit, when I first wrote this function name I didn't realize how funny it would sound
        // I pretty much just reversed the putText function
        Console.prototype.bsHandler = function (lastChar) {
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);
            this.currentXPosition = this.currentXPosition - offset;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, this.currentXPosition + offset, this.currentYPosition + _FontHeightMargin);

        };



        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
