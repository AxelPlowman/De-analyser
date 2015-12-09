var canvas, ctx, source, context, analyser, fbcArray, bars, barX, barWidth, barHeight; //Creëert een heleboel variabelen voor de analyser.
var audio = new Audio(); //Hier maken we een nieuwee <audio> in het HTML-bestand.

//Audio specificeren:
audio.src = "audio/Phoenix.wav"; //Het liedje. http://icecast.omroep.nl/3fm-bb-mp3
audio.controls = true; //Standaard audio knoppen.
audio.loop = true; //Liedje afgelopen? Dan begint hij opnieuw.
audio.autoplay = true; //Stelt dat de audio niet begint met lopen wanneer de pagina wordt geopend.

window.addEventListener("load", initAudioPlayer, false); //Stelt: als de pagina geladen is, voer dan de functie "initAudioPlayer" uit.

//De hierboven aangeroepen functie:
function initAudioPlayer(){
	document.getElementById("audioBox").appendChild(audio); //Stelt dat de hierboven gemaakte audio in de audioBox van het HTML-bestand gaat.
	context = new AudioContext(); //Creëert een audio context voor de analyaer
	analyser = context.createAnalyser(); //Creëert een analysernode in de context.
	canvas = document.getElementById("analyserRender"); //Zet de variabel 'canvas' gelijk aan de canvas in het HTML-bestand met het ID 'analyser'.
	ctx = canvas.getContext("2d"); //We geven de canvas een 2D context en slaan deze op in 'ctx'.
	//Hieronder wordt de boel met elkaar geconnect: 
	analyser.FFTSize = 10;
	source = context.createMediaElementSource(audio); 
	source.connect(analyser);
	analyser.connect(context.destination);
	frameLooper(); //Runt de functie frameLooper.
}

//Hieronder de frameLooperfunctie. Deze geeft de animaties op basis van de audiofrequentie.
function frameLooper(){
	window.requestAnimationFrame(frameLooper); //Creërt een loop voor de animatie.
	fbcArray = new Uint8Array(analyser.frequencyBinCount); //Stopt de audiodata in een array.
	analyser.getByteFrequencyData(fbcArray);
	ctx.clearRect(0, 0, canvas.width, canvas.height); //'Clear' de canvas.
	
	
	
	bars = 30; //Hoeveelheid staven(bars).
	for (var i = 0; i < bars; i++) { //Deze loopt de staven.
		ctx.fillStyle = "hsla("+i*12+", "+50+Math.floor(fbcArray[i]/255*50)+"%, 20%,"+(fbcArray[i]/255)+")";
		barX = i * 3; //Bepaalt de plaats van iederen staaf, zodat ze naast elkaar staan.
		barWidth = 10; //Bepaalt de breedte van de staven.
		barHeight = -(fbcArray[i] / 2);
		if (fbcArray[i] >= 0.5) {barHeight = -(fbcArray[i] * 1)} //Bepaalt de hoogte van de staven op basis van de de audiodata (dus het samplegetal) die in de array is gestopt. 
		//  fillRect( x, y, width, height ) // Explanation of the parameters below
		ctx.fillRect(barX, canvas.height, barWidth, barHeight); //Deze geeft de staven weer.
	};
};



