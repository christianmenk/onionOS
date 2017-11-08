var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.storedData = [];
            this.segment0 = 0;
            this.segment1= _ProgramSize;
            this.segment2 = _ProgramSize * 2;
            this.totalMemory = _ProgramSize * 3;
            this.initMemory();
        }

        // Populate array with empty data
    Memory.prototype.initMemory = function() {
        for (var i = 0; i < this.totalMemory; i++) {
            this.storedData[i] = "00";
        }
    };

    return Memory;
})();
TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));