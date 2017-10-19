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
            updateMemory(_MemoryManager.memory);
    };

        // Execute program function
        // Gets called on every CPU cycle with the hex code to be translated by the OP codes and printed
        // Utilizes an if to ensure the CPU does not execute any extra unused memory.
        // When complete, sets execution state to false to stop the cpu execution.
        Cpu.prototype.executeProgram = function (hex){
            if(this.PC < _ProgramLength) {
                switch(hex) {
                    case "A9":
                        // load acc with constant
                     this.loadAccConstant();
                     break;
                    case "AD":
                    // load acc from memory
                    this.loadAccFromMemory();
                        break;
                    case "8D":
                    // store acc in memory
                    this.storeAccInMemory();
                        break;
                    case "6D":
                    // add with carry
                        this.addWithCarry();
                        break;
                    case "A2":
                    // load xreg with constant
                        this.loadXregConstant();
                        break;
                    case "AE":
                    //load xreg from mem
                        this.loadXregFromMemory();
                        break;
                    case "A0":
                    // load yreg with constant
                        this.loadYregConstant();
                        break;
                    case "AC":
                    // load yreg from memory
                        this.loadYregFromMemory();
                        break;
                    case "EA":
                    // no operation
                        break;
                    case "00":
                        this.break();
                        break;
                    case "EC":
                    // compare byte in memory to xreg, sets zflag if equal
                        break;
                    case "D0":
                    // branch n bytes if z flag = 0
                        break;
                    case "EE":
                    // increment value of a byte
                        break;
                    case "FF":
                    // system call
                        break;
                    default:
                        //unknown op code
                        break;
                }
                this.PC++;
            }
        };

        Cpu.prototype.loadAccConstant = function(){
            this.Acc = _MemoryManager.convert(_MemoryManager.memory.storedData[++this.PC]);
        };

        Cpu.prototype.loadAccFromMemory = function(){
            this.Acc = this.getDataAtAddress(this.getMemoryAddress());
        };

        Cpu.prototype.storeAccInMemory = function(){
            _MemoryManager.insertData(this.Acc.toString(16), this.getMemoryAddress());
        };

        Cpu.prototype.addWithCarry = function(){
            this.Acc = this.Acc + this.getDataAtAddress();
        };

        Cpu.prototype.loadXregConstant = function(){
            this.Xreg = _MemoryManager.convert(_MemoryManager.memory.storedData[++this.PC]);
        };

        Cpu.prototype.loadXregFromMemory = function(){
            this.Xreg = this.getDataAtAddress(this.getMemoryAddress());
        };

        Cpu.prototype.loadYregConstant = function(){
            this.Yreg = _MemoryManager.convert(_MemoryManager.memory.storedData[++this.PC]);
        };

        Cpu.prototype.loadYregFromMemory = function(){
            this.Yreg = this.getDataAtAddress(this.getMemoryAddress());
        };

        Cpu.prototype.getMemoryAddress = function(){
            var firstLoc = _MemoryManager.memory.storedData[++this.PC];
            var secondLoc = _MemoryManager.memory.storedData[++this.PC];
            var location = secondLoc + firstLoc;
            return location;
        };

        Cpu.prototype.getDataAtAddress = function (location){
            return _MemoryManager.memory.storedData[location];
        };

        Cpu.prototype.break = function (){
            _CurrentProgram.PC = this.PC;
            _CurrentProgram.Acc = this.Acc;
            _CurrentProgram.Xreg = this.Xreg;
            _CurrentProgram.Yreg = this.Yreg;
            _CurrentProgram.Yreg = this.Yreg;
            _CurrentProgram.state = "Terminated";

            updateCpu();
            updatePcb();
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK))
        };


        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
