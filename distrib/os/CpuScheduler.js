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














        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
