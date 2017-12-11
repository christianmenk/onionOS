var TSOS;
(function (TSOS) {
    var DeviceDriverFileSystem = (function () {
        function DeviceDriverFileSystem() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
        }

        DeviceDriverFileSystem.prototype.format = function() {
            sessionStorage.clear();
            var emptyData = "";
            for(var i = 0; i < 64; i++) {
                emptyData += "0";
            }
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        sessionStorage.setItem((t.toString() + s.toString() + b.toString()), emptyData);
                    }
                }
            }
            updateFileSystem();
        };





        return DeviceDriverFileSystem;
    })();
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
