var audio = new Audio(); //Hier maken we een <audio> in het HTML-bestand en specificeren hem.
audio.src = "audio/Phoenix.wav";
audio.controls = true; 
audio.autoplay = true;
document.getElementById("audioBox").appendChild(audio); //Hier zeggen we waar <audio> moet staan in het HTML-bestand
var context = new AudioContext(); //Hier wordt een audiocontext gemaakt, anders gezegd: alle informatie over de geluiddetails worden in het variabel context opgeslagen.
var source, frequencyData; //Hier worden enkele variabelen aangemaakt, om die vooral bovenin het document te houden.
var analyser = context.createAnalyser(); //Hier wordt een analyser gemaakt in de auciocontext.

window.addEventListener("load", initAudioPlayer, false); //Als de pagina geladen is, roept functie 'initAudioPlayer' aan.

function initAudioPlayer() {
	source = context.createMediaElementSource(audio); //Hier creëert hij een node(koppelpunt) in de audiocontext, zodat deze straks verbonden kan worden.
	//frequencyData = new Uint8Array(analyser.frequencyBinCount);
	//analyser.getByteFrequencyData(frequencyData);
	source.connect(analyser); //Verbind de source met de analyser.
	analyser.connect(context.destination); //Verbind de analyser met het eindpunt, zodat het geluid wordt afgespeeld.
	frameLooper(); //Roept de functie frameLooper aan.
}

function frameLooper() { 
	window.requestAnimationFrame(frameLooper); //Elke keer dat het scherm ververst (60 keer per seconde ofzo?) wordt de functie opnieuw aangeroepen, er ontstaat dus een loop.
	frequencyData = new Uint8Array(analyser.frequencyBinCount); //Stopt de audiodata in een array (stap 1).
	analyser.getByteFrequencyData(frequencyData); //Stopt de audiodata in een array (stap 2).
	
	//Hier moeten de visuels worden geplaatst. De functie zorgt dat elke keer als het scherm een 'repaint' doet, de frequencyData ververst. Als jouw animatie hier staat en gebasseerd is op de frequencyData, dan wordt die dus ook steeds ververst.
	console.log(frequencyData); //De console.log laat zien hoe de data in de array verandert, dit is slechts voorbeeld, als je ermee gaat werken zou ik het weghalen. Het vertraagt slechts.
}


