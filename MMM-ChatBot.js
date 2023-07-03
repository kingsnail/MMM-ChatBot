/* Chat Bot
 * Module: MMM-ChatBot
 *
 * By Mark Pearce
 *
 */
Module.register("MMM-ChatBot", {

    // Module config defaults.
    defaults: {
        useHeader: true, // false if you don't want a header
        header: "Loading Data", // Any text you want
        maxWidth: "250px",
        rotateInterval: 300 * 1000,
        animationSpeed: 10, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 5 * 1 * 1000, // Update every 5 seconds
    },

    getStyles: function() {
        return ["MMM-ChatBot.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
	this.Status = "Unknown";
	this.LastResult = "No Results.";
	this.lastclicked = -1;
        this.activeItem = 0;         // <-- starts rotation at item 0 (see Rotation below)
        this.rotateInterval = null;  // <-- sets rotation time (see below)
        this.scheduleUpdate();       // <-- When the module updates (see below)
	var self = this;
    },
	
    getDom: function() {
		
		// creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

		// The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Checking Status ... !";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

		// creating the header
        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

		// Rotating the data
        // Display the Status
	var Devs = this.Devices.devices.sort(this.compareDevs);
	var Groups = this.Devices.groups.sort(this.compareDevs);

	// Creating the div's for your data items
        var top = document.createElement("div");
        top.classList.add("list-row");
        var stateTitleSpan = document.createElement("span");
	stateTitleSpan.classList.add("small", "bright", "status_title");
	stateTitleSpan.innerHTML = "STATUS: ";
        var stateValueSpan = document.createElement("span");
	stateValueSpan.classList.add("small", "bright", "status_value");
        stateValueSpan.innerHTML = this.Status;
	top.appendChild(stateTitleSpan);
	top.appendChild(stateValueSpan);
	wrapper.appendChild(top);
	    
	//for(var dev = 0; dev < Devs.length; dev++){	
	//	var devrow = document.createElement("div");
	//	var statespan = document.createElement("span");
	//	var textspan  = document.createElement("span");
	//	if (Devs[dev].state === "on"){
        //  	    statespan.classList.add("small", "bright", "state_on");
	//	} else {
	//	    statespan.classList.add("small", "bright", "state_off");
	//	}
	//	textspan.classList.add("small", "bright", "state");
	//	devrow.classList.add("small", "bright", "staterow");
	//	
	//	statespan.innerHTML = Devs[dev].state.toUpperCase();
	//	textspan.innerHTML  = " " + Devs[dev].name + " ID(" + Devs[dev].bulbID + "), B(" + Devs[dev].brightness + "), W(" + Devs[dev].warmth + ")";
        //  	
	//	const d = Devs[dev].bulbID;
	//	const s = Devs[dev].state;
	//	statespan.addEventListener ("click", ()=>{this.setDevice(d, s)}, false);
	//	
	//	devrow.appendChild(statespan);
	//	devrow.appendChild(textspan);
        //  	wrapper.appendChild(devrow);
	//}	
        return wrapper;	
    }, // <-- closes the getDom function from above

	// this processes your data
    setDevice: function(d, s) { 
	if ( s === "on" ) {
             console.log("KS-SH: setDevice(" + d + ", " + s + ") Turn Off");
             this.sendSocketNotification('SET_DEVICE_OFF', d);
	     this.getDevices();

	} else {
             console.log("KS-SH: setDevice(" + d + ", " + s + ") Turn On");
             this.sendSocketNotification('SET_DEVICE_ON', d);
	     this.getDevices();
	}
    },
    
    processStatus: function(data) {
        this.Status = data;
        console.log("MMM-ChatBot: Status Updated");
	console.log(this.Status);
	this.loaded  = true;
    },
	
    processLastResult: function(data) {
        this.LastResult = data;
        console.log("MMM-ChatBot: LastResult Updated");
	console.log(this.LastResult);
    },
	
// this tells module when to update
    scheduleUpdate: function() { 
	//console.log("MMM-ChatBot scheduleUpdate called.");
        setInterval(() => {
            this.getStatus();
        }, this.config.updateInterval);
        this.getStatus(this.config.initialLoadDelay);
    },
	
    getStatus: function(){
        console.log("MMM-ChatBot: getStatus called...");
	// Send the GET_STATUS request to node_helper.js for action.
        this.sendSocketNotification('GET_STATUS', this.url);
    },

    getLastResult: function(){
	console.log("MMM-ChatBot: getLastResult called...");
        // Send the GET_LAST_RESULT request to node_helper.js for action.
        this.sendSocketNotification('GET_LAST_RESULT', this.url);    },
	    
    processSetResponse: function(payload){
        console.log("SET_DEVICE_RESPONSE: " + payload);
    },

	// this gets data from node_helper
    socketNotificationReceived: function(notification, payload) { 
        if (notification === "STATUS_RESULT") {
            this.processStatus(payload);
            this.updateDom(this.config.animationSpeed);
        }
        if (notification === "LAST_RESULT_RESPONSE") {
            this.processLastResult(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
