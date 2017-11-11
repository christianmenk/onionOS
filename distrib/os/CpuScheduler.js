var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
        }

        CpuScheduler.prototype.begin = function() {
            var program = _ReadyQueue.dequeue();
            program.state = "Running";
            _CPU.init(program, true);
        };

        CpuScheduler.prototype.runAll = function (){
            if(!_ReadyQueue.isEmpty()) {
                var currentProgram = _ReadyQueue.dequeue();
                if(currentProgram.state === "Ready"){
                    _CPU.init(currentProgram, true);
                    currentProgram.state = "Running";
                } else if(currentProgram.state === "Waiting") {
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
            if(_CycleCount === _Quantum || runningProgram.state === "Terminated"){
                _CycleCount = 0;
                if(runningProgram.state !== "Terminated"){
                    runningProgram.state = "Waiting";
                    updateCurrentPcb(runningProgram);
                    _ReadyQueue.enqueue(runningProgram);
                } else if(_ReadyQueue.isEmpty() && runningProgram.state === "Terminated"){
                    _Scheduling = false;
                }
                this.runAll();
            }



        };

        CpuScheduler.prototype.complete = function (runningProgram){
            _CPU.isExecuting = false;
        };














        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
