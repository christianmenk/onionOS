/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = (function () {
        function Utils() {
        }

        Utils.trim = function (str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        return Utils;
    })();
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));


// Clock functions

function TimeRefresh(){
    var d = new Date();
    var clock = document.getElementById("time");
    var date = document.getElementById("date");

    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    clock.innerText =  ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);

    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    date.innerText = ('0' + month).slice(-2) + '/' + ('0' + day).slice(-2) + '/' + year;

    _Timeout = setTimeout(TimeRefresh, 500, true);
}

function StopTime(){
    document.getElementById("time").innerText = "00:00:00";
    document.getElementById("date").innerText = "00/00/0000";
    clearTimeout(_Timeout);
}

function updateCpu(){
    $('#cpuPC').html(_CPU.PC);
    $('#cpuAcc').html(_CPU.Acc);
    $('#cpuX').html(_CPU.Xreg);
    $('#cpuY').html(_CPU.Yreg);
    $('#cpuZ').html(_CPU.Zflag);
}

function updatePcb(pcb){
    $('#pcbPID').html(pcb.PID);
    $('#pcbState').html(pcb.state);
    $('#pcbPC').html(pcb.PC);
    $('#pcbAcc').html(pcb.Acc);
    $('#pcbX').html(pcb.Xreg);
    $('#pcbY').html(pcb.Yreg);
    $('#pcbZ').html(pcb.Zflag);
    $('#pcbBase').html(pcb.base);
    $('#pcbLimit').html(pcb.limit);
}

// Used to update the HTML memory element through the use of jQuery replace methods
// Using innerhtml would've required me to create the whole table (I think), not good for future project reqs
function updateMemory(memory){
    var table = $('#memoryTable');
    var html = "<tbody>";

    // For loop is used to loop through the totalMemory size and populate the table accordingly
    for (var i = 0; i < memory.totalMemory; i++) {
        // Creating table header
        if (i % 8 === 0) {
            var header = i.toString(16).toUpperCase();
            // Adds preceding 0's
            while(header.length < (memory.totalMemory.toString(16)).length){
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
        html += '<td id="' + "memCell" + i + '"> ' + memory.storedData[i] + '</td>';
    }
    html += "</tbody>";

    // This will replace the entire body each time updateMemory is called
    table.find('tbody').replaceWith(html);
}
