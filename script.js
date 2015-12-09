var canvas = document.getElementById("analyserRender"), //Zet de variabel 'canvas' gelijk aan de canvas in het HTML-bestand 
	canvasCtx = canvas.getContext("2d"), //We geven de canvas een 2D context en slaan deze op 
	audio = new Audio(), //creates new <audio>

	audioCtx = new AudioContext(),

	//creates 10 biquadFilters, one for each node in our equaliser
	equaliserNodes = [audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter(), 
		audioCtx.createBiquadFilter()],
	biquadFilter = audioCtx.createBiquadFilter(),

	//excuse us for our 10 sliders... 
	slider1Input = document.querySelector('#filterFreqIn1'),
	slider2Input = document.querySelector('#filterFreqIn2'),
	slider3Input = document.querySelector('#filterFreqIn3'),
	slider4Input = document.querySelector('#filterFreqIn4'),
	slider5Input = document.querySelector('#filterFreqIn5'),
	slider6Input = document.querySelector('#filterFreqIn6'),
	slider7Input = document.querySelector('#filterFreqIn7'),
	slider8Input = document.querySelector('#filterFreqIn8'),
	slider9Input = document.querySelector('#filterFreqIn9'),
	slider10Input = document.querySelector('#filterFreqIn10'),

	

	//variables to be filled later on:
	analyser, source, fbcArray, bars, barX, barWidth, barHeight;


//analyser settings
analyser = audioCtx.createAnalyser();
analyser.FFTSize = 2048; //sets analyser's FFTSize-property

//biquadFilter settings
biquadFilter.type = "peaking";
biquadFilter.frequency.value = slider1Input.value;
biquadFilter.Q.value = 1;
biquadFilter.gain.value = 24;


//Audio specificeren:
audio.src = "audio/Phoenix.wav"; //Het liedje.
audio.controls = true; //Standaard audio knoppen.
audio.loop = true; //Liedje afgelopen? Dan begint hij opnieuw.
audio.autoplay = true; //Stelt dat de audio niet begint met lopen wanneer de pagina wordt geopend.

window.addEventListener("load", initAudioPlayer, false); //Stelt: als de pagina geladen is, voer dan de functie "initAudioPlayer" uit.

//range slider output display




slider1Input.addEventListener('input', function () {
	slider1Output.innerHTML = slider1Input.value;
	biquadFilter.frequency.value = slider1Input.value;
	console.log(biquadFilter.frequency.value);
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



