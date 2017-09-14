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


