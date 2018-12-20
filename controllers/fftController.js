var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var Analyser = require('audio-analyser');

var generator = Generator(
    //Generator function, returns sample values -1..1 for channels
    function (time) {
        return [
            Math.sin(Math.PI * 2 * time * 1000)*0.1+            Math.sin(Math.PI * 2 * time * 5000)*0.05, //channel 2
        ]
    },
 
    {
        //Duration of generated stream, in seconds, after which stream will end.
        duration: Infinity,
 
        //Periodicity of the time.
        period: Infinity
})
.on('error', function (e) {
    //error happened during generation the frame
})

var analyser = new Analyser({
    // Magnitude diapasone, in dB
    minDecibels: -100,
    maxDecibels: -30,
 
    // Number of time samples to transform to frequency
    fftSize: 32,
 
    // Number of frequencies, twice less than fftSize
    frequencyBinCount: 32/2,
 
    // Smoothing, or the priority of the old data over the new data
    smoothingTimeConstant: 0.2,
 
    // Number of channel to analyse
    channel: 1,
 
    // Size of time data to buffer
    bufferSize: 8000,
 
    // Windowing function for fft, https://github.com/scijs/window-functions
    applyWindow: function (sampleNumber, totalSamples) {
    }
 
    //...pcm-stream params, if required
});

//generator.pipe(Speaker());
generator.pipe(analyser);

const FFT = require('fft.js');
 
const f = new FFT(1024);

function sum(a,b){
    return Math.abs(a)+Math.abs(b);
}

var fftdata = new Array(f.size);
var nbuckets = 32;
var nbuf = 8000;
fftb = new Array(nbuckets)
var util = require('util')

function plot(data){
    var m = Math.max(...data);
    var h = 8;
    for (var i=h; i>0; i--){
        let line = "I";
        for (var j = 0; j<data.length; j++){
            if ((data[j]/m*h)>i){
                line = line + '#     ';
            }else{
                line = line + '      ';
            }
        }
        console.log(line, "I");
    }
    let line = "I";
    for (var i in data){
        line = line + ((i+1)*nbuf/nbuckets/2) + " ";
    }
    console.log(   "   ", line, "I");
}

function output(){
    let tdata = analyser.getTimeData(f.size);
    /*let fftdata = analyser.getFrequencyData();
    let ldata1 = fftdata.splice(256,512).reduce(sum,0)
    let ldata2 = fftdata.splice(510,1023).reduce(sum,0)
    console.log(ldata1, ldata2)*/
    f.realTransform(fftdata, tdata);
    for ( var b = 0; b<nbuckets; b++){
        let istart = b*f.size/nbuckets;
        fftb[b] = fftdata.slice(istart,istart+nbuckets).reduce(sum,0);
    }
    //let ldata1 = fftdata.splice(0,512).reduce(sum,0);
    //let ldata2 = fftdata.splice(510,1023).reduce(sum,0);
    console.log(fftb);
    plot(fftb);
    //console.log(analyser.getFrequencyData())
}


setInterval(output, 100);