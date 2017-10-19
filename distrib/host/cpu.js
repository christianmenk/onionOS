///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;

            updateCpu();
        };

        // Cycle function
        // Each cycle, executeProgram is called with the parameter of the next part in memory containing program information
        // Calls HTML update methods
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            this.executeProgram(_MemoryManager.memory.storedData[this.PC]);

            updateCpu();
            updatePcb();
    };

        // Execute program function
        // Gets called on every CPU cycle with the hex code to be translated by the OP codes and printed
        // Utilizes an if to ensure the CPU does not execute any extra unused memory.
        // When complete, sets execution state to false to stop the cpu execution.
        Cpu.prototype.executeProgram = function (hex){
            if(this.PC < _ProgramLength) {
                switch(hex) {
                    case "A9":
                     this.Acc = _MemoryManager
                    case "AD":
                    // load acc from memory
                    case "8D":
                    // store acc in memory
                    case "6D":
                    // add with carry
                    case "A2":
                    // load xreg with constant
                    case "AE":
                    //load xreg from mem
                    case "A0":
                    // load yreg with constant
                    case "AC":
                    // load yreg from memory
                    case "EA":
                    // no operation
                    case "00":
                    // break
                    case "EC":
                    // compare byte in memory to xreg, sets zflag if equal
                    case "D0":
                    // branch n bytes if z flag = 0
                    case "EE":
                    // increment value of a byte
                    case "FF":
                    // system call
                    default:
                        //unknown op code
                        break;
                }

                }
                _StdOut.putText(hex);
                _StdOut.advanceLine();
                this.PC++;
            } else {
                this.isExecuting = false;
                this.PC = 0;
                updateCpu();
                updatePcb();
                _StdOut.putText("Execution complete.");
                _CurrentProgram.state = "Complete";
                _StdOut.advanceLine();
                _StdOut.putText(_OsShell.promptStr);
            }

        };

        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
