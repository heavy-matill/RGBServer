var socket = io.connect('http://localhost:3000');		
//var socket = io.connect(window.location.search.split("/")[0]);
socket.emit("mqttPublish", {"topic": "presence", "message": "Message from web"});
function start(){			
    socket.emit("mqttPublish", {"topic": "rgb", "message": String.fromCharCode(0x00)});
}
function stop(){			
    socket.emit("mqttPublish", {"topic": "rgb", "message": String.fromCharCode(0x01)});
}
function pause(){			
    socket.emit("mqttPublish", {"topic": "rgb", "message": String.fromCharCode(0x02)});
}
function setRGB(r,g,b){			
    //socket.emit("mqttPublish", {"topic": "rgb", "message": String.fromCharCode(0x0A,r,g,b)});
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": [0x10,r,g,b]});
}
function slideRGB(r,g,b){			
    //socket.emit("mqttPublish", {"topic": "rgb", "message": String.fromCharCode(0x0A,r,g,b)});
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": [0x11,r,g,b]});
}
function queueSlideRGB(r1,g1,b1,r2,g2,b2,t,n_rep,b_rep){			
    //socket.emit("mqttPublish", {"topic": "rgb", "message": String.fromCharCode(0x0A,r,g,b)});
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": [0x14,r1,g1,b1,r2,g2,b2,t>>8,t-(t>>8),n_rep,b_rep]});
}
function addAmimation(){
    var colorString = "00FF00";

    //socket.emit("addAmimation", {"topic": "rgb", "bytes": [0x14,r1,g1,b1,r2,g2,b2,t>>8,t-(t>>8),n_rep,b_rep]});
    var parentDiv = document.getElementById('divQueue');

	var inputQueueCount = document.getElementById('queueCount');
	var count = inputQueueCount.value-(-1);
	inputQueueCount.value = count;

	var newDiv = document.createElement('div');

	newDiv.className = "colorElement";

	var divIdName = 'queueElement'+count;
	newDiv.id = divIdName;

	var colorInput = document.createElement('input');

	colorInput.className='colorInput';

	var picker = new jscolor(colorInput);
	picker.backgroundColor='#666';
	//picker.width=250;
	//picker.height=150;
	picker.insertColor='#FFF';
	picker.borderColor='#FFF';
	//picker.position='left';
	picker.fromString(colorString);
	newDiv.appendChild(colorInput);

	var closeButton = document.createElement('button');
	closeButton.className='closeButton';
	closeButton.onclick=function() {
		if(document.getElementsByClassName('colorInput').length>1)
			removeElement(divIdName);
	};
	closeButton.innerHTML='x';
	newDiv.appendChild(closeButton);


	parentDiv.appendChild(newDiv);
}
function addSameElement()
{
	var colorInputs = document.getElementsByClassName('colorInput');
	addElement(colorInputs[colorInputs.length-1].value);
}
function removeElement(id) {
	var elem = document.getElementById(id);
	elem.remove();
}

function getMode()
{
    return parseInt(document.querySelector('input[name="radioMode"]:checked').value);
}

function modeSwitch()
{
    var mode = getMode();

	// if flash and pulse modes exist
    var secondaryIds = ["buttonColorSwitch", "colorInput2", "buttonColor2First", "buttonColor2Next", "buttonColor2Previous", "buttonColor2Last"];
    var hideSecondarys = "visible";
    if(mode > 1)
    {
        hideSecondarys = "hidden";
    }
    for (var i = 0; i < secondaryIds.length; i++)
    {
        document.getElementById(secondaryIds[i]).style.visibility = hideSecondarys;
    }

    if (mode%2 > 0){
        document.getElementById("trPercOn").style.display = "none";
    }
    else{
        document.getElementById("trPercOn").style.display = "table-row";
    }
}

var colorInputIds = ["colorInput1", "colorInput2"]

function switchColorInputs(){    
    var colorInput1 = document.getElementById(colorInputIds[0]);
    var colorInput2 = document.getElementById(colorInputIds[1]);
    var tempColor = colorInput1.value;
    colorInput1.value = colorInput2.value;
    colorInput2.value = tempColor;
    colorInput1.dispatchEvent(new Event('input'));
    colorInput2.dispatchEvent(new Event('input'));

}


function LogSlider(options) {
    options = options || {};
    this.minpos = options.minpos || 0;
    this.maxpos = options.maxpos || 100;
    this.minlval = Math.log(options.minval || 1);
    this.maxlval = Math.log(options.maxval || 100000);
 
    this.scale = (this.maxlval - this.minlval) / (this.maxpos - this.minpos);
 }
 
 LogSlider.prototype = {
    // Calculate value from a slider position
    value: function(position) {
       return Math.exp((position - this.minpos) * this.scale + this.minlval);
    },
    // Calculate slider position from a value
    position: function(value) {
       return this.minpos + (Math.log(value) - this.minlval) / this.scale;
    }
 };
 
var logslDur = new LogSlider({maxpos: 100, minval: 0.01, maxval: 65.535});
var logslRep = new LogSlider({maxpos: 100, minval: 0, maxval: 256});

function onLoadFunction(){    
    console.log("Page loaded");
    for (var i in colorInputIds){
        let colorInput = document.getElementById(colorInputIds[i]);
        let picker = new jscolor(colorInput);
        picker.backgroundColor='#666';
        picker.insertColor='#FFF';
        picker.borderColor='#FFF';
        //picker.width=250;
        //picker.height=150;
        //picker.position='left';
    }

    // set radio click listener
    var radios = document.getElementsByName('radioMode');
    for(var i = 0, max = radios.length; i < max; i++) {
        radios[i].onclick = modeSwitch;
    }
    //document.querySelector('input[type=radio][name=radioMode]').addEventListener('change', modeSwitch);
}
console.log("Script loaded");
