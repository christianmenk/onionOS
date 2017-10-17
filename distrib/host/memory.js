var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.storedData = [];
            this.totalMemory = 768;
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