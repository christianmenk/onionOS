var TSOS;
(function (TSOS) {
    var DeviceDriverFileSystem = (function () {
        function DeviceDriverFileSystem() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.bytes = 64;
            this.isFormatted = false;
        }

        DeviceDriverFileSystem.prototype.format = function() {
            this.isFormatted = true;
            sessionStorage.clear();
            var emptyData = "";
            for(var i = 0; i < this.bytes; i++) {
                emptyData += "-";
            }
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        sessionStorage.setItem((t.toString() + s.toString() + b.toString()), emptyData);
                    }
                }
            }
            // Create MBR
            sessionStorage.setItem( "000", "1---MBR");
            updateFileSystem();
        };

        DeviceDriverFileSystem.prototype.createFile = function(name) {
            var dirLoc = this.getNextDirectoryLocation();
            var fileLoc = this.getNextFileLocation();
            var metaData = "1" + fileLoc;
            sessionStorage.setItem(dirLoc, metaData + name);
            sessionStorage.setItem(fileLoc, "1---");

            _StdOut.putText(dirLoc + " " + fileLoc);
            updateFileSystem();
        };

        DeviceDriverFileSystem.prototype.writeToFile = function(name, data) {
             var location = this.getFileLocation(name);
            console.log(name);

             if(location !== null){

             } else {
                 _StdOut.putText("That file does not exist.")
             }

        };


        DeviceDriverFileSystem.prototype.getFileLocation = function(name) {
            for (var s = 0; s < this.sectors; s++) {
                for (var b = 0; b < this.blocks; b++) {
                    var location = "0" + s.toString() + b.toString();
                    var data = sessionStorage.getItem(location);
                    if(data.indexOf("-") > 3){
                        console.log(location);
                    }
                }
            }
        };

        DeviceDriverFileSystem.prototype.getNextDirectoryLocation = function() {
            for (var s = 0; s < this.sectors; s++) {
                for (var b = 0; b < this.blocks; b++) {
                    var location = "0" + s.toString() + b.toString();
                    var data = sessionStorage.getItem(location);
                    if(data.indexOf("-") === 0){
                        return location;
                    }
                }
            }
        };

        DeviceDriverFileSystem.prototype.getNextFileLocation = function() {
            for(var t = 1; t < this.tracks; t++)
                for (var s = 0; s < this.sectors; s++) {
                for (var b = 0; b < this.blocks; b++) {
                    var location = t.toString() + s.toString() + b.toString();
                    var data = sessionStorage.getItem(location);
                    if(data.indexOf("-") === 0){
                        return location;
                    }
                }
            }
        };









        return DeviceDriverFileSystem;
    })();
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
