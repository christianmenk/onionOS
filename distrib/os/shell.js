///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // Date command
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the date.");
            this.commandList[this.commandList.length] = sc;

            // Location command
            sc = new TSOS.ShellCommand(this.shellLoc, "whereami", "- Displays the location.");
            this.commandList[this.commandList.length] = sc;

            //Knower of Nothing
            sc = new TSOS.ShellCommand(this.shellOnion, "onionknight", "- Displays the Onion Knight.");
            this.commandList[this.commandList.length] = sc;

            // Status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status.");
            this.commandList[this.commandList.length] = sc;

            // Used for testing OS error shutdown
            sc = new TSOS.ShellCommand(this.shellError, "rip", "- Tests kernel shutdown due to OS error.");
            this.commandList[this.commandList.length] = sc;

            // Load, validates the hex code in the program input box
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<Priority> - Loads user input into memory with an optional priority (0-10).");
            this.commandList[this.commandList.length] = sc;

            // run <pid>, used to run a program with given pid
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<PID> - Runs program with specified PID.");
            this.commandList[this.commandList.length] = sc;

            // runall, used to start the cpu scheduling process for all programs in mem
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "Runs all programs in memory with given quantum.");
            this.commandList[this.commandList.length] = sc;

            // quantum, sets the round robin quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<integer> - Sets the round robin quantum.");
            this.commandList[this.commandList.length] = sc;

            //clearmem, clears all programs in memory and in the resident list
            sc = new TSOS.ShellCommand(this.shellClear, "clearmem", "Clears all programs in memory.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "Displays all running programs.");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<PID> Kills a specified running program.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.getSchedule, "getschedule", "Displays the current scheduling algorithms.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.setSchedule, "setschedule", "<String> Sets the scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.format, "format", "Formats the file system for use.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.create, "create", "<File Name> Creates a file in the file system.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.write, "write", "<File Name> <Data> Writes data to specified file in the file system.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.read, "read", "<File Name>  Returns data of a specified file in the file system.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.delete, "delete", "<File Name> Deletes a file from the file system.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.ls, "ls", "Lists all files currently stored in memory.");
            this.commandList[this.commandList.length] = sc;
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            if(_CPU.isExecuting === false)
                _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };

        // Originally made these globals to use with the other time function, but they wouldn't actively refresh
        // because they're only instantiated once
        Shell.prototype.shellDate = function (args) {
            var date = new Date();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var timeString =('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2) + ":" + ('0' + sec).slice(-2);
            var dateString = month + '/' + day + '/' + year;
            _StdOut.putText(timeString);
            _StdOut.advanceLine();
            _StdOut.putText(dateString);
        };

        // Onions!!
        Shell.prototype.shellLoc = function (args) {
            _StdOut.putText("The Stormlands, Home of the Onion Knight.");
        };

        // I hope you know who this even is
        Shell.prototype.shellOnion = function (args) {
            document.getElementById("davos").style.visibility = "visible";
        };

        // Sets the status label in the task bar
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {

                // Doesn't this look great? It replaces the commas with spaces to make it look nice
                _Status = args.toString().replace(/,/g,' ');
                var statusLabel = document.getElementById('status');

                // Make the user feel like they are a programmer
                statusLabel.innerText = '[' + _Status + ']';
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };

        // Tests the BSoD with a harmless error message
        Shell.prototype.shellError = function () {
            _Kernel.krnTrapError("Testing function called - no real errors present");
        };

        /*                           LOADING AND HEX VALIDATION
         Validates the user input using a simple regex function and a for loop. Loops the input
          through an array of what was entered and tests it with the regex function. If every
          element of the array passes the test, then call the memory manager and load the program
          into memory.
                                                                                              */
        Shell.prototype.shellLoad = function (args) {
            var userInput = document.getElementById("taProgramInput").value.trim();
            var inputArray = userInput.split(" ");
            // Count used for match counting purposes
            var count = 0;

            // RegEx breakdown:
            // ^ starts us at the beginning of the input
            // [0-9A-F] checks if each char is either between 0-9 or A-F
            // + matches the string as many times as possible
            // $ marks ending of input
            // i globally ignores the case of the input

            // Haha, regHex, get it?
            var regHex = /^[0-9A-F]+$/i;

            // Loop through the array and test all of that juicy input
            for (i = 0; i <= inputArray.length; i++) {
                if (regHex.test(inputArray[i])) {
                    count++;
                } else {
                    break;
                }
            }

            // See if every elements of inputArray passed, load it into memory if so
            if (count === inputArray.length) {
                _StdOut.putText("Loading program into memory...");
                _StdOut.advanceLine();

                if (args.length >= 1) {
                    var priority = parseInt(args[0]);
                    if (priority > 10 || priority < 0 || isNaN(priority)) {
                        _StdOut.putText("Invalid priority. Setting to default priority of 10.");
                        _StdOut.advanceLine();
                        _MemoryManager.load(userInput, 10);
                    } else {
                        _MemoryManager.load(userInput, priority);
                    }
                } else {
                    _MemoryManager.load(userInput, 10);
                }
             } else {
                _StdOut.putText("User Program Input is not valid hexadecimal.");
                _StdOut.advanceLine();
                _StdOut.putText("You disappoint me.")
            }
        };

        // Run command:
        // This command checks to see if the input is = the current PID, and changes the state of the CPU to executing
        // This triggers the kernel to start a CPU cycle and run the loaded program from memory
        Shell.prototype.shellRun = function (args) {
            for(var i = 0; i < _ResidentList.length; i++){
                 if(_ResidentList[i].PID == args[0]){
                     _ReadyQueue.enqueue(_ResidentList[i]);
                    _StdOut.putText("Executing program with PID: " + args[0] );
                    _Scheduling = true;
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(EXECUTE_PROGRAM));
                } else if(i === _ResidentList.length) {
                    _StdOut.putText("Please provide a valid PID.");
                }
            }
        };

        Shell.prototype.shellRunAll= function () {
            if(_ResidentList.length !== 0) {
                for(var i = 0; i < _ResidentList.length; i++){
                    _ReadyQueue.enqueue(_ResidentList[i]);
                }
                _StdOut.putText("Executing " + _ReadyQueue.getSize() + " program(s) from memory...");
                _Scheduling = true;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(RUN_ALL_PROG));
            } else {
                _StdOut.putText("There are no programs to run!");
            }
        };

        Shell.prototype.shellQuantum = function (args) {
            if(args.length > 0) {
                _Quantum = args[0];
                _StdOut.putText("The quantum is now set to " + _Quantum + ".")
            } else {
                _StdOut.putText("Please provide a valid number.");
            }
        };

        // Clearmem: Clears all current memory
        Shell.prototype.shellClear= function () {
            _MemoryManager.memory.initMemory();
            updateMemory(_MemoryManager.memory);
            clearPcbTable();
            _ResidentList = [];
            while(!_ReadyQueue.isEmpty()){
                _ReadyQueue.dequeue();
            }
        };

        Shell.prototype.shellPs = function () {
            if(_CPU.isExecuting === true) {
                _StdOut.putText("Running Programs:");
                for (var i = 0; i < _ResidentList.length; i++) {
                    if (_ResidentList[i].state === "Running" || _ResidentList[i].state === "Waiting") {
                        _StdOut.advanceLine();
                        _StdOut.putText("PID: " + _ResidentList[i].PID);
                    }
                }
            } else {
                _StdOut.putText("There are no programs running.");
            }
        };

        Shell.prototype.shellKill = function (args) {
            if(_Scheduling) {
                for (var i = 0; i < _ResidentList.length; i++) {
                    if (_ResidentList[i].PID == args[0]) {
                        _CPU.currentPcb.state = "Terminated";
                        _ResidentList.splice(i, 1);
                    } else if (i === _ResidentList.length) {
                        _StdOut.putText("Please enter a valid PID.");
                    }
                }
            } else {
                _StdOut.putText("There are no running processes!")
            }
        };

        Shell.prototype.getSchedule = function () {
            var type = _CpuScheduler.type;
            _StdOut.putText("Current Scheduling Algorithm: ");
            _StdOut.advanceLine();

            if(type === "rr")
                _StdOut.putText("Round Robin");
            else if (type === "fcfs")
                _StdOut.putText("First Come First Served");
            else if (type === "priority")
                _StdOut.putText("Priority");
        };

        Shell.prototype.setSchedule = function (args) {
            if(args[0] == "rr") {
                _CpuScheduler.type = "rr";
                _StdOut.putText("Scheduling Algorithm set to Round Robin.");
            } else if(args[0] == "fcfs") {
                _CpuScheduler.type = "fcfs";
                _StdOut.putText("Scheduling Algorithm set to First Come First Served.");
            } else if(args[0] == "priority"){
                _CpuScheduler.type = "priority";
                _StdOut.putText("Scheduling Algorithm set to Priority.");
            } else {
                _StdOut.putText("That is not a valid scheduling algorithm. Available algorithms:");
                _StdOut.advanceLine();
                _StdOut.putText("rr, fcfs, priority");
            }
        };

        Shell.prototype.format = function () {
            _FileSystem.format();
            _StdOut.putText("Successfully formatted file system.");
            _StdOut.advanceLine();
        };

        Shell.prototype.create = function (args) {
            if(_FileSystem.isFormatted) {
                if (args.length > 0)
                    _FileSystem.createFile(args[0].toString(), "file");
                else
                    _StdOut.putText("Please specify a file name to create.");
            } else {
                _StdOut.putText("You need to format the file system.");
            }
        };

        Shell.prototype.write = function (args) {
            if(_FileSystem.isFormatted) {
                if (args.length >= 2){
                    var name = args[0].toString();
                    var writeData = "";
                    for (var i = 1; i < args.length; i++) {
                        writeData += args[i] + " ";
                    }
                    _FileSystem.writeToFile(name, writeData, "file");
                } else {
                    _StdOut.putText("Please supply a file name and the data to write to it.")
                }
            } else {
                _StdOut.putText("You need to format the file system.");
            }
        };

        Shell.prototype.read = function (args) {
            if(_FileSystem.isFormatted) {
                if (args.length > 0)
                    _FileSystem.readFile(args[0].toString());
                else
                    _StdOut.putText("Please specify a file name to read.");
            } else {
                _StdOut.putText("You need to format the file system.");
            }
        };

        Shell.prototype.delete = function (args) {
            if(_FileSystem.isFormatted) {
                if (args.length > 0)
                    _FileSystem.deleteFile(args[0].toString(), "file");
                else
                    _StdOut.putText("Please specify a file name to delete.");
            } else {
                _StdOut.putText("You need to format the file system.");
            }
        };

        Shell.prototype.ls = function () {
            if(_FileSystem.isFormatted) {
                _FileSystem.ls();
            } else {
                _StdOut.putText("You need to format the file system.");
            }
        };


        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
