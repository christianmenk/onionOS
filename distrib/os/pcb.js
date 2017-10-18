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
            this.limit = 0;
        }

        Pcb.prototype.updatePcb = function (){
          $('#pcbPID').html(this.PID);
          $('#pcbState').html(this.state);
          $('#pcbPC').html(this.PC);
          $('#pcbAcc').html(this.Acc);
          $('#pcbX').html(this.Xreg);
          $('#pcbY').html(this.Yreg);
          $('#pcbZ').html(this.Zflag);
          $('#pcbBase').html(this.base);
          $('#pcbLimit').html(this.limit);
        };

        return Pcb;
    })();
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
