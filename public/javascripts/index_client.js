var socket = io.connect('http://localhost:3000');		
// allow live mode with checkbox?
// local id counter, 
// local active id
// local active animation/frame?
// change settings (all but color) for all nodes in queue
// next previous etc.
// move 
// select nodes running, select groups (finished if at least one node responded with finish)
//var socket = io.connect(window.location.search.split("/")[0]);
var idCur = 0;
socket.emit("mqttPublish", {"topic": "presence", "message": "Message from web"});
function sendStart(){			
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": [byteStartAnimation]});
}
function sendStop(){			
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": [byteStopAnimation]});
}
function sendPause(){			
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": [bytePauseAnimation]});
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
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": [0x14,r1,g1,b1,r2,g2,b2,t>>8,t%(2<<7),n_rep,b_rep]});
}

function loadAnimationDataSettings(id, animationData){
    document.getElementById('rangeDuration').value = logslDur.position(animationData.t/100);
    document.getElementById('numberDuration').value = animationData.t/100;

    document.getElementById('rangePercOn').value = animationData.p;
    document.getElementById('numberPercOn').value = animationData.p;

    document.getElementById('rangeNumRep').value = animationData.nr;
    document.getElementById('numberNumRep').value = animationData.nr;

    document.getElementById('checkReQueue').checked = animationData.br;

    var color1 = byteToHexString(animationData.c1.r)+byteToHexString(animationData.c1.g)+byteToHexString(animationData.c1.b);    
    var colorInput1 = document.getElementById('colorInput1')
    colorInput1.value = color1;
    colorInput1.dispatchEvent(new Event('input'));

    var color2 = byteToHexString(animationData.c2.r)+byteToHexString(animationData.c2.g)+byteToHexString(animationData.c2.b);    
    var colorInput2 = document.getElementById('colorInput2')
    colorInput2.value = color2;
    colorInput2.dispatchEvent(new Event('input'));

    document.getElementById('radioMode'+animationData.mode).checked = true;
}

function loadAnimation(id){
    for (anEl of document.getElementsByClassName("animationElementMarked")){
        anEl.classList.remove("animationElementMarked");
    }    
    var animationElement = document.getElementById('animationElement'+id);
    if (animationElement){        
        idCur = id;
        animationElement.classList.add("animationElementMarked");
    }
    for (el of animationQueue){
        if (el.id == id)
        {
            loadAnimationDataSettings(id, el.animationData);
            return;
        }
    }
    console.log("Warning: Id ", id, " not found while using loadAnimation(Id).");    
}

function getAnimationData(){
    let mode = getMode()
    let c1 = document.getElementById("colorInput1").value;
    let c2 = document.getElementById("colorInput2").value;
    let t = Math.floor(document.getElementById("numberDuration").value*100);
    let p = document.getElementById("numberPercOn").value*1;
    let nr = document.getElementById("numberNumRep").value*1;
    let br = document.getElementById("checkReQueue").checked;

    let c1r = parseInt(c1.slice(0,2), 16);
    let c1g = parseInt(c1.slice(2,4), 16);
    let c1b = parseInt(c1.slice(4,6), 16);
    let c2r = parseInt(c2.slice(0,2), 16);
    let c2g = parseInt(c2.slice(2,4), 16);
    let c2b = parseInt(c2.slice(4,6), 16);

    return {mode: mode, c1: {r: c1r, g: c1g, b: c1b}, c2: {r: c2r, g: c2g, b: c2b}, t: t, p: p, nr: nr, br: br};
}

function addAnimation(animationData){
    //console.log("append: ", getAnimationData());
    // get new id
    var id = 123
    animationQueue.push({id: id, animationData: animationData});
    addAnimationElement(id, animationData);
}

function applySettings(){
    setAnimation(idCur, getAnimationData());
}

function resetSettings(){
    loadAnimation(idCur);
}

function setAnimation(id, animationData){
    console.log("change id: ", id, " to: ", animationData);
    // store curently selected id somewhere
    for (el of animationQueue){
        if (el.id == id)
        {
            //loadAnimationDataSettings(id, el.animationData);
            el.animationData = animationData;
            setAnimationElement(id, animationData);
            return;
        }
    }
    console.log("Warning: Id ", id, " not found while using setAnimation(Id, animationData)."); 
}

function displayAnimationElements(animationDataList){
    var divParent = document.getElementById('divQueue');
    divParent.innerHTML = "";
    for ( an of animationDataList ){
        addAnimationElement(an.id, an.animationData);
    }
}

function setAnimationElement(id, animationData){
    let divAnimationElement = document.getElementById("animationElement"+id);
    switch (animationData.mode % 2){
        case 0:
            divAnimationElement.style.backgroundImage = "linear-gradient(to right, rgb("+animationData.c1.r+","+animationData.c1.g+","+animationData.c1.b+") "+animationData.p+"%, rgb("+animationData.c2.r+","+animationData.c2.g+","+animationData.c2.b+") 0)";
            break;

        case 1:
            divAnimationElement.style.backgroundImage = "linear-gradient(to right, rgb("+animationData.c1.r+","+animationData.c1.g+","+animationData.c1.b+") 20%, rgb("+animationData.c2.r+","+animationData.c2.g+","+animationData.c2.b+") 80%)";
            break;          
    }
}

function byteToHexString(d) {    
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}

function addAnimationElement(id, animationData){
    //socket.emit("addAmimation", {"topic": "rgb", "bytes": [0x14,r1,g1,b1,r2,g2,b2,t>>8,t-(t>>8),n_rep,b_rep]});
    var divParent = document.getElementById('divQueue');

	var divAnimationElment = document.createElement('div');

    divAnimationElment.className = "animationElement";
    divAnimationElment.setAttribute("onclick", "loadAnimation("+id+");");
    

	var divIdName = 'animationElement'+id;
    divAnimationElment.id = divIdName;
    

    var button = document.createElement('button')
    button.className = "delButton"
    button.setAttribute("onclick", "removeAnimation("+id+");");
    button.innerHTML = "X";
    divAnimationElment.appendChild(button);
    
    var inputId = document.createElement("input");
    inputId.type = "number"; 
    inputId.className = "hidden"; 
    inputId.setAttribute("value", id);
    divAnimationElment.appendChild(inputId);

    divParent.appendChild(divAnimationElment);
    
    setAnimationElement(id, animationData);
}

function removeAnimation(id){
    // if global mode? from rgb controller call socket remove animationelement.
    removeAnimationElement(id);
    var i = 0;
    for (var i = 0; i < animationQueue.length; i++){
        if (animationQueue[i].id == id)
        {
            animationQueue.splice(i,1);
            console.log("removed animation with id: ", id);
            return;
        }
    }
    console.log("Warning: Id ", id, " not found while using removeAnimation(Id).");     
}

function removeAnimationElement(id) {
	document.getElementById("animationElement"+id).remove();
}

function getMode(){
    return parseInt(document.querySelector('input[name="radioMode"]:checked').value);
}

function modeSwitch(){
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
    displayAnimationElements(animationQueue);
}

function bytesAppendAnimationQueue(animationQueue){
    // for queue_list....
    var byteArray = [];
    for (anim of animationQueue){
        byteArray.push(...bytesFromAnimationData(anim.animationData));
    }
    return byteArray;
}

function bytesFromAnimationData(animationData){
    var byteArray = [0x14+(animationData.mode%2), 
        animationData.c1.r, animationData.c1.g, animationData.c1.b,
        animationData.c2.r, animationData.c2.g, animationData.c2.b,
        animationData.t>>8, animationData.t%(2<<7)];
    if ((animationData.mode%2)==0){
        byteArray.push(animationData.p);
    }
    byteArray.push(animationData.nr);
    byteArray.push(animationData.br*1);
    console.log(byteArray);
    return byteArray;
}

function bytesStartAnimationQueue(animationQueue){
    var byteArray = [byteStopAnimation, 
    ...bytesAppendAnimationQueue(animationQueue),
    byteStartAnimation];
    console.log(byteArray);
    return byteArray;
}

function sendStartSettings(){    
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": bytesStartAnimationQueue(animationQueue)});
}

function sendAppendSettings(){    
    console.log(bytesAppendAnimationQueue(animationQueue));
    socket.emit("mqttPublishBytes", {"topic": "rgb", "bytes": bytesAppendAnimationQueue(animationQueue)});
    //socket.emit("mqttPublish", {"topic": "rgb2", "message": bytesAppendAnimationQueue(animationQueue)});
}

const byteStartAnimation = 0x00;
const byteStopAnimation = 0x01;
const bytePauseAnimation = 0x02;
console.log("Script loaded");

var animationQueue = [{id: 0, animationData: {mode: 0, c1: {r: 255, g: 129, b: 0}, c2: {r: 0, g: 0, b: 0}, t: 1025, p: 40, nr: 5, br: true}},{id: 1, animationData: {mode: 1, c1: {r: 255, g: 0, b: 0}, c2: {r: 0, g: 0, b: 255}, t: 1025, p: 20, nr: 4, br: false}}];
    
