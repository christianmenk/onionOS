var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.memory = new TSOS.Memory();
            this.init();
        }

        MemoryManager.prototype.init = function(){
            updateMemory(this.memory);
            _ReadyQueue = new TSOS.Queue;
        };

        MemoryManager.prototype.load = function (hex, priority){
            // Split user input into an array
            var hexArray = hex.toUpperCase().split(" ");

            // Make sure the program can fit into memory
            if(_ProgramSize < hexArray.length){
                _StdOut.putText("The program is too large to fit into memory.");
            } else {

                // Init can be used to reset memory for new functions being entered

                if(this.memory.storedData[this.memory.segment0] === "00"){
                    for (var i = 0; i < hexArray.length; i++) {
                        this.memory.storedData[i] = hexArray[i];
                    }
                    this.createPCB(this.memory.segment0, "Ready", priority, "Memory");
                } else if(this.memory.storedData[this.memory.segment1] === "00"){
                    for (var i = 0; i < hexArray.length; i++) {
                        this.memory.storedData[i + this.memory.segment1] = hexArray[i];
                    }
                    this.createPCB(this.memory.segment1, "Ready", priority, "Memory");
                }  else if(this.memory.storedData[this.memory.segment2] === "00"){
                    for (var i = 0; i < hexArray.length; i++) {
                        this.memory.storedData[i + this.memory.segment2] = hexArray[i];
                    }
                    this.createPCB(this.memory.segment2, "Ready", priority, "Memory");
                }

                else {
                    if(_FileSystem.isFormatted === true){
                        this.createPCB(0, "Ready", priority, "Disk");
                        var progName = "program" + _PID;
                        _FileSystem.createFile(progName, "program");
                        _FileSystem.writeToFile(progName, hex.toUpperCase());

                    } else {
                        _StdOut.putText("There is no available memory.");
                        _StdOut.advanceLine();
                        _StdOut.putText("To store more programs, you must format the file system.");
                        _StdOut.advanceLine();
                    }
                }

                _ProgramLength = hexArray.length;
                // Add new hex array to memory

                // Update the memory table
                updateMemory(this.memory);
            }

        };

        MemoryManager.prototype.createPCB = function (base, state, priority, location){
            // Increment PID for next program loaded
            _PID++;

            this.pcb = new TSOS.Pcb(_PID);
            this.pcb.state = state;
            this.pcb.priority = priority;
            this.pcb.location = location;

            if(location === "Disk") {
                this.pcb.base = "-";
                this.pcb.limit = "-";
            } else {
                this.pcb.base = base;
                this.pcb.limit = base += _ProgramSize;

            }

            _ResidentList.push(this.pcb);
            createPcbRow(this.pcb);
            // Update pcb display


            _StdOut.putText("Program loaded: PID " + this.pcb.PID);
            _StdOut.advanceLine();
            _StdOut.putText("Program priority: " + priority);

        };

        // Inserts data at a given location
        MemoryManager.prototype.insertData = function (data, location){
                this.memory.storedData[location] = data.toUpperCase();
        };

        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));




