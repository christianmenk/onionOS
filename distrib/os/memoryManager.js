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

        MemoryManager.prototype.load = function (hex){
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
                    this.createPCB(this.memory.segment0, "Ready");
                } else if(this.memory.storedData[this.memory.segment1] === "00"){
                    for (var i = 0; i < hexArray.length; i++) {
                        this.memory.storedData[i + this.memory.segment1] = hexArray[i];
                    }
                    this.createPCB(this.memory.segment1, "Ready");
                }  else if(this.memory.storedData[this.memory.segment2] === "00"){
                    for (var i = 0; i < hexArray.length; i++) {
                        this.memory.storedData[i + this.memory.segment2] = hexArray[i];
                    }
                    this.createPCB(this.memory.segment2, "Ready");
                } else {
                    _StdOut.putText("There is no available memory.");
                }

                _ProgramLength = hexArray.length;
                // Add new hex array to memory



                // Update the memory table
                updateMemory(this.memory);
            }

        };

        MemoryManager.prototype.createPCB = function (base, state){
            // Increment PID for next program loaded
            _PID++;

            this.pcb = new TSOS.Pcb(_PID);
            this.pcb.base = base;
            this.pcb.state = state;
            this.pcb.limit = base += _ProgramSize;
            _ResidentList.push(this.pcb);
            createPcbRow(this.pcb);
            // Update pcb display


            _StdOut.putText("Program loaded: PID " + this.pcb.PID);

        };

        // Inserts data at a given location
        MemoryManager.prototype.insertData = function (data, location){
                this.memory.storedData[location] = data.toUpperCase();
        };

        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));




