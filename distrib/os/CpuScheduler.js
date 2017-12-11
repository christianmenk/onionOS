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
                if(currentProgram.state === "Ready"){
                    _CPU.init(currentProgram, true);
                    currentProgram.state = "Running";
                } else if(currentProgram.state === "Waiting" || currentProgram.state === "Running") {
                    this.contextSwitch(currentProgram);
                    currentProgram.state = "Running";
                }
            }

        };

        CpuScheduler.prototype.contextSwitch = function (runningProgram) {
            _CPU.PC = runningProgram.PC;
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
                        _ReadyQueue.enqueue(runningProgram);
                    } else if (_ReadyQueue.isEmpty() && runningProgram.state === "Terminated") {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK));
                        _Scheduling = false;
                    }
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
                        _ReadyQueue.enqueue(runningProgram);
                    } else if (_ReadyQueue.isEmpty() && runningProgram.state === "Terminated") {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK));
                        _Scheduling = false;
                    }
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
