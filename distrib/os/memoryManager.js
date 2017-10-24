var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.memory = new TSOS.Memory();
            this.init();
        }

        MemoryManager.prototype.init = function(){
            updateMemory(this.memory);
        };

        MemoryManager.prototype.load = function (hex){
            // Split user input into an array
            var hexArray = hex.toUpperCase().split(" ");

            // Make sure the program can fit into memory
            if(this.memory.storedData.length < hexArray.length){
                _StdOut.putText("The program is too large to fit into memory.");
            } else {

                // Init can be used to reset memory for new functions being entered
                this.memory.initMemory();

                _ProgramLength = hexArray.length;
                // Add new hex array to memory
                for (var i = 0; i < hexArray.length; i++) {
                    this.memory.storedData[i] = hexArray[i];
                }

                // Update the memory table
                updateMemory(this.memory);

                // Increment PID for next program loaded
                _PID++;

                this.pcb = new TSOS.Pcb(_PID);
                this.pcb.state = "Ready";
                _CurrentProgram = this.pcb;


                // Update pcb display
                updatePcb();

                _StdOut.putText("Program loaded: PID " + this.pcb.PID);
            }

        };

        // Inserts data at a given location
        MemoryManager.prototype.insertData = function (data, location){
                this.memory.storedData[location] = data.toUpperCase();
        };

        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));




