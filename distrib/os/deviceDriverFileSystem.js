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

        DeviceDriverFileSystem.prototype.createFile = function(name) {
            var dirLoc = this.getNextDirectoryLocation();
            var fileLoc = this.getNextFileLocation();
            var metaData = "1" + fileLoc;
            var hexName = this.formatToHex(name);
            console.log(hexName);
            sessionStorage.setItem(dirLoc, metaData + hexName);
            sessionStorage.setItem(fileLoc, "1---");

            _StdOut.putText("Successfully created file: " + name);

            updateFileSystem();
        };

        DeviceDriverFileSystem.prototype.formatToHex = function(name) {
            var newData = "";
            for (var i = 0; i < name.length; i++) {
                newData += name.charCodeAt(i).toString(16)
            }
            return newData;
        };

        DeviceDriverFileSystem.prototype.formatToString = function(hex) {
            var newString = "";
            for (var i = 0; i < hex.length; i += 2) {
                var text = parseInt(hex.charAt(i) + hex.charAt(i + 1), 16);
                if (text !== 0) {
                    newString += String.fromCharCode(text);
                }
            }

            return newString;
        };

        DeviceDriverFileSystem.prototype.writeToFile = function(name, data) {
            var hexName = this.formatToHex(name);
            var location = this.getFileLocation(hexName);
            console.log(name);

             if(location !== null){
                 var dataLoc = parseInt(sessionStorage.getItem(location).slice(1, 4));
                 var metaData = "1" + dataLoc;
                 var newData = this.formatToHex(data);
                 var dataBlocks = [];

                 while (newData.length) {
                     dataBlocks.push(newData.slice(0, 60));
                     newData = newData.slice(60);
                 }

                 for(var i = 0; i < dataBlocks.length; i++){
                     if(i !== dataBlocks.length - 1)
                        metaData = "1" + dataLoc;
                     else
                        metaData = "1---";
                     sessionStorage.setItem((dataLoc + ""), (metaData + dataBlocks[i]));
                     dataLoc++;
                 }

                 _StdOut.putText("Successfully wrote data to " + name + "!");
             } else {
                 _StdOut.putText("That file does not exist.");
             }
             updateFileSystem();
        };

        DeviceDriverFileSystem.prototype.readFile = function(name) {
            var hexName = this.formatToHex(name);
            var location = this.getFileLocation(hexName);

            if(location !== null){
                var fileDataLoc = parseInt(sessionStorage.getItem(location).slice(1, 4));
                var fileData = sessionStorage.getItem(fileDataLoc + "");
                _StdOut.putText("Here are the contents of the " + name + ":");
                _StdOut.advanceLine();
                while(fileData.slice(0,4) !== "1---"){
                    _StdOut.putText(this.formatToString(fileData.slice(4, fileData.length)));
                    _StdOut.advanceLine();
                    fileDataLoc++;
                    fileData = sessionStorage.getItem(fileDataLoc + "");
                }

                if(fileData.slice(0,4) === "1---"){
                    _StdOut.putText(this.formatToString(fileData.slice(4, fileData.length)));
                }


            } else {
                _StdOut.putText("That file does not exist.");
            }
        };

        DeviceDriverFileSystem.prototype.deleteFile = function(name) {
            var hexName = this.formatToHex(name);
            var location = this.getFileLocation(hexName);
            var emptyData = "";
            for(var i = 0; i < this.bytes; i++) {
                emptyData += "0";
            }


            if(location !== null){
                var fileDataLoc = parseInt(sessionStorage.getItem(location).slice(1, 4));
                var fileData = sessionStorage.getItem(fileDataLoc + "");
                sessionStorage.setItem(location, emptyData);

                while(fileData.slice(0,4) !== "1---"){
                    sessionStorage.setItem(fileDataLoc + "", emptyData);
                    fileDataLoc++;
                    fileData = sessionStorage.getItem(fileDataLoc + "");
                }

                if(fileData.slice(0,4) === "1---"){
                    sessionStorage.setItem(fileDataLoc + "", emptyData);
                }

                _StdOut.putText("Successfully deleted " + name + " from the file system.");
                updateFileSystem();
            } else {
                _StdOut.putText("That file does not exist.");
            }
        };


        DeviceDriverFileSystem.prototype.ls = function() {
            var files = [];

            for (var s = 0; s < this.sectors; s++) {
                for (var b = 0; b < this.blocks; b++) {
                    var location = "0" + s.toString() + b.toString();
                    var data = sessionStorage.getItem(location);
                    if(data.indexOf("0") !== 0){
                        files.push(data.slice(4, data.length));
                    }
                }
            }

            if(files === []){
                _StdOut.putText("There are no files stored in the file system.");
            } else {
                _StdOut.putText("Files stored on file system:");
                _StdOut.advanceLine();
                _StdOut.putText(files.toString());
            }
        };

        DeviceDriverFileSystem.prototype.getFileLocation = function(name) {
            for (var s = 0; s < this.sectors; s++) {
                for (var b = 0; b < this.blocks; b++) {
                    var location = "0" + s.toString() + b.toString();
                    var data = sessionStorage.getItem(location);
                    if(data.indexOf("0") !== 0 && data.indexOf(name) === 4){
                        return location;
                    }
                }
            }
            //Return null if not found
            return null;
        };

        DeviceDriverFileSystem.prototype.getNextDirectoryLocation = function() {
            for (var s = 0; s < this.sectors; s++) {
                for (var b = 0; b < this.blocks; b++) {
                    var location = "0" + s.toString() + b.toString();
                    var data = sessionStorage.getItem(location);
                    if(data.indexOf("0") === 0){
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
                    if(data.indexOf("0") === 0){
                        return location;
                    }
                }
            }
        };









        return DeviceDriverFileSystem;
    })();
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
