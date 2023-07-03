/* ChatBot
 * Module: MMM-ChatBot
 *
 * By Mark Pearce
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
const spawn = require("child_process").spawn; // Required to be able to make calls to Python code externally

var self; // Used for reference to this module when 'this' is out of scope.

module.exports = NodeHelper.create({
	

    start: function() {
        console.log("Starting node_helper for: " + this.name);
	      self = this;
    },

    updatedStatus: function(stat){
        self.sendSocketNotification('STATUS_RESULT', stat);
    },

    updatedResult: function(stat){
        self.sendSocketNotification('LAST_RESULT_RESPONSE', stat);
    },


    getStatus: function(callback) {    
	     var devstr = "Test";
        /* Call the external python module to get the system status  */
       const pythonStatusProcess = spawn('python',["ChatBbotStatus.py"]);
	     pythonProcess.stdout.on('data', function (data) { var result = JSON.parse(data.toString());
							  callback(result);							 
						        });
    },

    getLastResult: function(callback) {    
	     var devstr = "Test";
        /* Call the external python module to get the system status  */
       const pythonStatusProcess = spawn('python',["ChatBbotLastResult.py"]);
	     pythonProcess.stdout.on('data', function (data) { var result = JSON.parse(data.toString());
							  callback(result);							 
						        });
    },
 
 
    socketNotificationReceived: function(notification, payload) {
	      if (notification === 'GET_STATUS') {
	         this.getStatus(this.updatedStatus);
	      }
	      if (notification === 'LAST_RESULT_REQUEST'){
	         this.getLastResult(this.updatedResult);
	      }
    }
});
