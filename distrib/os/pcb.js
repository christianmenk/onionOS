var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        function Pcb(pid) {
            this.PID = pid;
            this.state = "New";
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = 0;
            this.limit = 255;
            this.priority = 10;
            this.location = "";
        }

        return Pcb;
    })();
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
