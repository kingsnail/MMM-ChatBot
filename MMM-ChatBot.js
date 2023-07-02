/* Chat Bot
 * Module: MMM-ChatBot
 *
 * By Mark Pearce
 *
 */
Module.register("MMM-CHatBot", {

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
	showPresetDetails: true,
	presets: [
		    {scene: "Scene A",
		     lights: [{id: "65547", state: "on", brt: "100", color: "100"},
			      {id: "65546", state: "on", brt: "100", color: "100"}
			     ]
		    },
		    {scene: "Scene B",
		     lights: [{id: "65547", state: "off", brt: "0", color: "100"},
			      {id: "65546", state: "off", brt: "0", color: "100"}
			     ]
		    }
		]
    },

    getStyles: function() {
        return ["KS-SH.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
	this.Devices = [];
	this.Presets = [];
	this.lastclicked = -1;
        this.activeItem = 0;         // <-- starts rotation at item 0 (see Rotation below)
        this.rotateInterval = null;  // <-- sets rotation time (see below)
        this.scheduleUpdate();       // <-- When the module updates (see below)
	var self = this;
    },

    compareDevs: function( a, b ) {
        if ( a.name < b.name ){
             return -1;
        }
        if ( a.name > b.name ){
             return 1;
        }
        return 0;
    },
	
    getDom: function() {
		
		// creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

		// The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Loading Devices . . !";
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
        // Display the lights
	var Devs = this.Devices.devices.sort(this.compareDevs);
	var Groups = this.Devices.groups.sort(this.compareDevs);

	// Creating the div's for your data items
        var top = document.createElement("div");
        top.classList.add("list-row");
	    
	for(var dev = 0; dev < Devs.length; dev++){	
		var devrow = document.createElement("div");
		var statespan = document.createElement("span");
		var textspan  = document.createElement("span");
		if (Devs[dev].state === "on"){
            	    statespan.classList.add("small", "bright", "state_on");
		} else {
		    statespan.classList.add("small", "bright", "state_off");
		}
		textspan.classList.add("small", "bright", "state");
		devrow.classList.add("small", "bright", "staterow");
		
		statespan.innerHTML = Devs[dev].state.toUpperCase();
		textspan.innerHTML  = " " + Devs[dev].name + " ID(" + Devs[dev].bulbID + "), B(" + Devs[dev].brightness + "), W(" + Devs[dev].warmth + ")";
            	
		const d = Devs[dev].bulbID;
		const s = Devs[dev].state;
		statespan.addEventListener ("click", ()=>{this.setDevice(d, s)}, false);
		
		devrow.appendChild(statespan);
		devrow.appendChild(textspan);
            	wrapper.appendChild(devrow);
	}
	
	//for(var grp = 0; grp < Groups.length; grp++){
	//        var grprow = document.createElement("div");
        //        var gstate = document.createElement("span");
	//	var gtext  = document.createElement("span");
		
	//	if (Groups[grp].state === "on"){
   	//	    gstate.classList.add("small", "bright", "state_on");
	//	} else {
	//	    gstate.classList.add("small", "bright", "state_off");
	//	}
	//	gtext.classList.add("small", "bright", "state");
	//	grprow.classList.add("small", "bright", "staterow");
	//	
	//	gstate.innerHTML = Groups[grp].state.toUpperCase();
	//	gtext.innerHTML  = " Group: " + Groups[grp].groupID + "(" + Groups[grp].name + ")";
	//	grprow.appendChild(gstate);
	//	grprow.appendChild(gtext);
	//	wrapper.appendChild(grprow);
	//}
	
	var presets = this.config.presets;
	for(var p = 0; p < presets.length; p++){
		var prow = document.createElement("div");
		var pname = document.createElement("span");
		prow.classList.add("small", "bright");
                pname.classList.add("small", "bright");
		pname.innerHTML = presets[p].scene;
		const pp = p;
		const pl = presets;
		pname.addEventListener("click", ()=>{this.setScene(pp, pl)}, false);
		prow.appendChild(pname);
		if(this.config.showPresetDetails){
		    for(l = 0; l < presets[p].lights.length; l++){
  		        var pdetails = document.createElement("span");
  		        pdetails.innerHTML = "(" + presets[p].lights[l].id + ", " + presets[p].lights[l].state+ ", " + presets[p].lights[l].brt + ", " + presets[p].lights[l].color +")";
  		        if(this.lastclicked == p){
			    pdetails.classList.add("small", "bright", "selected");
			} else {
			    pdetails.classList.add("small", "bright", "notselected");
			}
	                prow.appendChild(pdetails);
		    }
		}
		wrapper.appendChild(prow);
	}
        return wrapper;
		
    }, // <-- closes the getDom function from above

	// this will activate a scene
    setScene: function(s, plist){
	    if (s >= 0 && s < plist.length){
		    console.log("KS-SH: Activate scene " + plist[s].scene);
		    this.lastclicked = s;
		    for(var b = 0; b < plist[s].lights.length; b++){
		        this.setFullDevice(plist[s].lights[b].id,plist[s].lights[b].state, plist[s].lights[b].brt, plist[s].lights[b].color);
		    }
	    } else {
	            console.log("KS-SH: Invalid Scene Id " + s.toString());
		    }
    },
    setFullDevice: function(d, s, b, c){
        console.log("KS-SH: setFullDevice()");
        var pl = '{ "device": ' + d.toString() + ', "state": "' + s + '", "bright": ' + b.toString() + ', "color": ' + c.toString() + '}';
	this.sendSocketNotification('SET_DEVICE_STATE', pl);
    },
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
    
    processDevices: function(data) {
        this.Devices = data;
        console.log("KS-SH: Devices Updated");
	console.log(this.Devices);
	this.loaded  = true;
    },
	
// this tells module when to update
    scheduleUpdate: function() { 
	//console.log("KS-SH scheduleUpdate called.");
        setInterval(() => {
            this.getDevices();
        }, this.config.updateInterval);
        this.getDevices(this.config.initialLoadDelay);
    },
	
    getDevices: function(){
        console.log("KS-SH: getDevices called...");
        this.sendSocketNotification('GET_DEVICES', this.url);
    },

    processSetResponse: function(payload){
        console.log("SET_DEVICE_RESPONSE: " + payload);
    },

	// this gets data from node_helper
    socketNotificationReceived: function(notification, payload) { 
        if (notification === "DEVICES_RESULT") {
            this.processDevices(payload);
            this.updateDom(this.config.animationSpeed);
        }
        if (notification === "SET_DEVICE_RESPONSE") {
            this.processSetResponse(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
