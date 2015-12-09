//////////////////////////////////////////
//	VARIABLES
//////////////////////////////////////////
var canvas = document.getElementById("analyserRender"), //Zet de variabel 'canvas' gelijk aan de canvas in het HTML-bestand 
	canvasCtx = canvas.getContext("2d"), //We geven de canvas een 2D context en slaan deze op 
	audio = new Audio(), //creates new <audio>

	audioCtx = new AudioContext(),

	//creates an analyser node
	analyser = audioCtx.createAnalyser();

	//creates 10 biquadFilter nodes, one for each frequency in our equaliser
	equaliserNodes = [
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter()
	],

	//frequencies that can be boosted or decreased in volume
	equaliserFrequencies = [
		32,
		54,
		125,
		250,
		500,
		1000,
		2000,
		4000,
		8000,
		16000
	],

	//excuse me, ten slider inputs coming trough...
	sliderIDList = [
	'#EQValueIn1',
	'#EQValueIn2',
	'#EQValueIn3',
	'#EQValueIn4',
	'#EQValueIn5',
	'#EQValueIn6',
	'#EQValueIn7',
	'#EQValueIn8',
	'#EQValueIn9',
	'#EQValueIn10',
	];

	//variables to be filled later on:
var source, fbcArray, bars, barX, barWidth, barHeight;


//////////////////////////////////////////
//	WEB SOUND API ELEMENT SETTINGS
//////////////////////////////////////////
//analyser settings
analyser.FFTSize = 2048; //sets analyser's FFTSize-property

//biquadFilter default settings
for (var i = 0; i < equaliserNodes.length; i++) {
	equaliserNodes[i].type = "peaking";
	equaliserNodes[i].Q.value = 1;
	equaliserNodes[i].frequency.value = equaliserFrequencies[i];
	equaliserNodes[i].gain.value = 0;
	console.log(equaliserFrequencies[i]);
};

//audio settings
audio.src = "audio/Phoenix.wav"; 
audio.controls = true; 
audio.loop = true;
audio.autoplay = true; 


//////////////////////////////////////////
//	EVENT LISTENERS
//////////////////////////////////////////

window.addEventListener("load", initAudioPlayer, false); //Stelt: als de pagina geladen is, voer dan de functie "initAudioPlayer" uit.

//range slider inputs to equaliser nodes
document.querySelector(".equaliserSliders").addEventListener('input', function () {
	for (var i = 0; i < equaliserNodes.length; i++) {
		equaliserNodes[i].gain.value = document.querySelector(sliderIDList[i]).value;
		console.log(equaliserNodes[i].gain.value);
	};
	
}, false);




//De hierboven aangeroepen functie:
function initAudioPlayer(){
	document.getElementById("audioBox").appendChild(audio); //Stelt dat de hierboven gemaakte audio in de audioBox van het HTML-bestand gaat.

	//Hieronder wordt de boel met elkaar geconnect: 
	source = audioCtx.createMediaElementSource(audio); 

	// audiopath
	source.connect(equaliserNodes[0]);
	equaliserNodes[0].connect(equaliserNodes[1]);
	equaliserNodes[1].connect(equaliserNodes[2]);
	equaliserNodes[2].connect(equaliserNodes[3]);
	equaliserNodes[3].connect(equaliserNodes[4]);
	equaliserNodes[4].connect(equaliserNodes[5]);
	equaliserNodes[5].connect(equaliserNodes[6]);
	equaliserNodes[6].connect(equaliserNodes[7]);
	equaliserNodes[7].connect(equaliserNodes[8]);
	equaliserNodes[8].connect(equaliserNodes[9]);
	equaliserNodes[9].connect(analyser);
	analyser.connect(audioCtx.destination);

	frameLooper(); //Runt de functie frameLooper.
}

//Hieronder de frameLooperfunctie. Deze geeft de animaties op basis van de audiofrequentie.
function frameLooper(){
	window.requestAnimationFrame(frameLooper); //Creërt een loop voor de animatie.
	fbcArray = new Uint8Array(analyser.frequencyBinCount); //Stopt de audiodata in een array.
	analyser.getByteFrequencyData(fbcArray);
	canvasCtx.clearRect(0, 0, canvas.width, canvas.height); //'Clear' de canvas.
	
	bars = 30; //Hoeveelheid staven(bars).
	for (var i = 0; i < bars; i++) { //Deze loopt de staven.
		canvasCtx.fillStyle = "hsla("+i*12+", "+50+Math.floor(fbcArray[i]/255*50)+"%, 20%,"+(fbcArray[i]/255)+")";
		barX = i * 3; //Bepaalt de plaats van iederen staaf, zodat ze naast elkaar staan.
		barWidth = 2; //Bepaalt de breedte van de staven.
		barHeight = -(fbcArray[i] / 2);
		if (fbcArray[i] >= 0.5) {barHeight = -(fbcArray[i] * 1)} //Bepaalt de hoogte van de staven op basis van de de audiodata (dus het samplegetal) die in de array is gestopt. 
		//  fillRect( x, y, width, height ) // Explanation of the parameters below
		canvasCtx.fillRect(barX, canvas.height, barWidth, barHeight); //Deze geeft de staven weer.
	};
};



