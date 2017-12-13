var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.type = "rr";
        }

        CpuScheduler.prototype.begin = function() {
            var program = _ReadyQueue.dequeue();
            program.state = "Running";
            _CPU.init(program, true);
        };

        CpuScheduler.prototype.runAll = function (){
            if(this.type === "priority")
                _ReadyQueue.prioritySort();

            if(!_ReadyQueue.isEmpty()) {
                var currentProgram = _ReadyQueue.dequeue();



                if(_LastProgram !== null) {
                    _LastProgram.PC = _LastProgram.PC - _LastProgram.base;

                    if(currentProgram.location === "Disk"){
                        currentProgram = this.rollInOut(currentProgram);
                    }

                    if (_LastProgram.state !== "Terminated") {
                        _ReadyQueue.enqueue(_LastProgram);
                    }
                }

                if(currentProgram.state === "Ready"){
                    _CPU.init(currentProgram, true);
                    currentProgram.state = "Running";
                } else if(currentProgram.state === "Waiting" || currentProgram.state === "Running") {
                    this.contextSwitch(currentProgram);
                    currentProgram.state = "Running";
                }
            }

        };

        CpuScheduler.prototype.rollInOut = function (currentProgram) {
            // Obtain old program's base/limit

            currentProgram.base = _LastProgram.base;
            currentProgram.limit = _LastProgram.limit;
            currentProgram.location = "Memory";



            var newHex = _FileSystem.readFile("program" + currentProgram.PID, "program");
            var newHexArray = newHex.toUpperCase().split(" ");

            // Get last program's data, free up memory
            var lastHex = "";
            for(var i = _LastProgram.base; i < _LastProgram.limit; i++){
                lastHex += _MemoryManager.memory.storedData[i] + " ";
                _MemoryManager.memory.storedData[i] = "00";
            }

            console.log(lastHex);

            // Enter in new program's data
            for(var i = 0; i < newHexArray.length; i++){
                _MemoryManager.memory.storedData[i + _LastProgram.base] = newHexArray[i];
            }

            _LastProgram.base = "-";
            _LastProgram.limit = "-";
            _LastProgram.location = "Disk";

            _FileSystem.deleteFile("program" + currentProgram.PID, "program");
            _FileSystem.createFile("program" + _LastProgram.PID, "program");
            _FileSystem.writeToFile("program" + _LastProgram.PID, lastHex.trim(), "program");

            updateCurrentPcb(_LastProgram, currentProgram.base);
            updateCurrentPcb(currentProgram);
            updateMemory(_MemoryManager.memory.storedData);

            return currentProgram;

        };


        CpuScheduler.prototype.contextSwitch = function (runningProgram) {
            _CPU.PC = runningProgram.PC + runningProgram.base;
            _CPU.Acc = runningProgram.Acc;
            _CPU.Xreg = runningProgram.Xreg;
            _CPU.Yreg = runningProgram.Yreg;
            _CPU.Zflag = runningProgram.Zflag;
            _CPU.currentPcb = runningProgram;
        };

        CpuScheduler.prototype.checkSwitch = function (runningProgram){

            if(this.type === "rr") {
                if (_CycleCount === _Quantum || runningProgram.state === "Terminated") {
                    _CycleCount = 0;
                    if (runningProgram.state !== "Terminated") {
                        if (_ReadyQueue.isEmpty()) {
                            runningProgram.state = "Running"
                        } else {
                            runningProgram.state = "Waiting";
                        }
                        updateCurrentPcb(runningProgram);

                    } else if (_ReadyQueue.isEmpty() && runningProgram.state === "Terminated") {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK));
                        _Scheduling = false;
                    }
                    _LastProgram = runningProgram;
                    this.runAll();
                }
            } else if(this.type === "fcfs" || this.type === "priority"){
                if (runningProgram.state === "Terminated") {
                    _CycleCount = 0;
                    if (runningProgram.state !== "Terminated") {
                        if (_ReadyQueue.isEmpty()) {
                            runningProgram.state = "Running"
                        } else {
                            runningProgram.state = "Waiting";
                        }
                        updateCurrentPcb(runningProgram);
                    } else if (_ReadyQueue.isEmpty() && runningProgram.state === "Terminated") {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK));
                        _Scheduling = false;
                    }
                    _LastProgram = runningProgram;
                    this.runAll();
                }
            }



        };

        CpuScheduler.prototype.complete = function (runningProgram){
            _CPU.isExecuting = false;
        };


        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
