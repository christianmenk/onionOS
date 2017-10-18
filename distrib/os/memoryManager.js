var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.memory = new TSOS.Memory();
            this.init();
        }

        MemoryManager.prototype.init = function(){
            this.updateMemory();
        };

        MemoryManager.prototype.load = function (hex){
            // Split user input into an array
            var hexArray = hex.split(" ");

            // Make sure the program can fit into memory
            if(this.memory.storedData.length < hexArray.length){
                _StdOut.putText("The program is too large to fit into memory.");
            } else {

                // Init can be used to reset memory for new functions being entered
                this.memory.initMemory();

                // Add new hex array to memory
                for (var i = 0; i < hexArray.length; i++) {
                    this.memory.storedData[i] = hexArray[i];
                }
                // Update the memory table
                this.updateMemory();

                this.pcb = new TSOS.Pcb(_PID);
                this.pcb.state = "Ready";
                _PID++;
                this.pcb.updatePcb();

                _StdOut.putText("Program loaded: PID " + this.pcb.PID);
            }


        };

        // Used to update the HTML memory element through the use of jQuery replace methods
        // Using innerhtml would've required me to create the whole table (I think), not good for future project reqs
        MemoryManager.prototype.updateMemory = function() {
            var table = $('#memoryTable');
            var html = "<tbody>";

            // For loop is used to loop through the totalMemory size and populate the table accordingly
            for (var i = 0; i < this.memory.totalMemory; i++) {
                // Creating table header
                if (i % 8 === 0) {
                    var header = i.toString(16).toUpperCase();
                    // Adds preceding 0's
                    while(header.length < (this.memory.totalMemory.toString(16)).length){
                        header = '0' + header;
                    }
                    header = "0x" + header;
                    // Ends the row if it isn't the first one
                    if(i !== 0){
                        html += '</tr>';
                    }
                    // Writes the header
                    html += '<tr><td><b>' + header + '</b></td>';
                }
                // Add all other table elements
                html += '<td id="' + "memCell" + i + '"> ' + this.memory.storedData[i] + '</td>';
            }
            html += "</tbody>";

            // This will replace the entire body each time updateMemory is called
            table.find('tbody').replaceWith(html);
        };

        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));




