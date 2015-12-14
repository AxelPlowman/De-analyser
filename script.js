//////////////////////////////////////////
//	VARIABLES
//////////////////////////////////////////
var canvas = document.getElementById("visuals1"), //Zet de variabel 'canvas' gelijk aan de canvas in het HTML-bestand 
	canvasCtx = canvas.getContext("2d"), //We geven de canvas een 2D context en slaan deze op 
	//player = new Audio(), //creates new <audio>

	audioCtx = new AudioContext(),
	source = audioCtx.createMediaElementSource(player),

	//creates an analyser node
	analyser = audioCtx.createAnalyser(),

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
var fbcArray, bars, barX, barWidth, barHeight;


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
};

//audio settings
// audio.src = "audio/Phoenix.wav"; 
// audio.controls = true; 
// audio.loop = true;
// audio.autoplay = true; 


//////////////////////////////////////////
//	EVENT LISTENERS
//////////////////////////////////////////

//window.addEventListener("load", initAudioPlayer, false); //Stelt: als de pagina geladen is, voer dan de functie "initAudioPlayer" uit.

//range slider inputs to equaliser nodes
document.querySelector(".equaliserSliders").addEventListener('input', function () {
	for (var i = 0; i < equaliserNodes.length; i++) {
		equaliserNodes[i].gain.value = document.querySelector(sliderIDList[i]).value;
		console.log(equaliserNodes[i].gain.value);
	};
}, false);
//reset button
document.querySelector(".resetButton").addEventListener('click', function () {
	for (var i = 0; i < equaliserNodes.length; i++) {
		equaliserNodes[i].gain.value = 0;
		console.log(equaliserNodes[i].gain.value);
	};
}, false);




//De hierboven aangeroepen functie:

	//document.getElementById("audioBox").appendChild(player); //Stelt dat de hierboven gemaakte audio in de audioBox van het HTML-bestand gaat.

	//Hieronder wordt de boel met elkaar geconnect: 
	

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





//////////////////////////////////////////
//	SOUNDCLOUD
//////////////////////////////////////////
var searchQuery,
	maxResultsAmount= 20,
	searchResults = {
		header: 'Search Results',
		songs: []
	};





document.querySelector(".submitQuery").addEventListener('click', function () {
	var userInput = document.querySelector("#searchField").value;
	if (userInput.length === 0) {
		alert('Please fill in something!');
	} 
	else {
	searchQuery = userInput.replace(/ /g, "%20").toLowerCase();
	console.log('"' + searchQuery + '" was submitted');
	soundcloudRequest();	
	}
});



function soundcloudRequest() {
	method = "GET";
	requestURL = 'https://api.soundcloud.com/tracks?client_id=00856b340598a8c7e317e1f148b5a13c&limit=' + maxResultsAmount + '&q=' + searchQuery;
	xhr = new XMLHttpRequest();
	xhr.open(method, requestURL, true);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			var APIResponse = JSON.parse(xhr.responseText);
			console.log(APIResponse);
			searchResults.songs = [];
			for (var i=0; i<APIResponse.length; i++){
				songInfo = new Object();
				songInfo.title = (APIResponse[i].title);
				songInfo.url = (APIResponse[i].permalink_url);
				songInfo.uploader = (APIResponse[i].user.username);
				searchResults.songs.push(songInfo);
			};
			console.log(APIResponse.length);
			console.log(searchResults);
			
            $("#listSongs li").remove();            
			var theTemplateScript = $("#list-template").html(); 
            var theTemplate = Handlebars.compile(theTemplateScript); 
            $("#listSongs").append(theTemplate(searchResults.songs));

		};
	};
};




// var xhr = new XMLHttpRequest();

// var SoundCloudAudioSource = function(audioElement) {
//     var player = document.getElementById(audioElement);
//     player.crossOrigin = 'Anonymous';
//     var self = this;
//     self.streamData = new Uint8Array(128);
  
    
//     // source.connect(analyser);
//     // analyser.connect(audioCtx.destination);

//     this.loadStream = function(track_url) {
//         var clientID = "00856b340598a8c7e317e1f148b5a13c";

//         SC.initialize({
//             client_id: clientID
//         });
//         SC.get('/resolve', { url: track_url }, function(track) {
//             SC.get('/tracks/' + track.id, {}, function(sound, error) {
//                 player.setAttribute('src', sound.stream_url + '?client_id=' + clientID);
//                 player.play();
//             });
//         });
//     };
//     frameLooper();
// };

//     var audioSource = new SoundCloudAudioSource('player');
//     var submitButton = document.getElementById('submit');
//     submitButton.onclick = function() {
//         var track_url = document.getElementById('input').value;
//         audioSource.loadStream(track_url);
//     };




//////////////////////////////////////////
//	VISUALS
//////////////////////////////////////////
//Hieronder de frameLooperfunctie. Deze geeft de animaties op basis van de audiofrequentie.
// function frameLooper(){
// 	window.requestAnimationFrame(frameLooper); //Creërt een loop voor de animatie.
// 	fbcArray = new Uint8Array(analyser.frequencyBinCount); //Stopt de audiodata in een array.
// 	analyser.getByteFrequencyData(fbcArray);
// 	canvasCtx.clearRect(0, 0, canvas.width, canvas.height); //'Clear' de canvas.
	
// 	bars = 30; //Hoeveelheid staven(bars).
// 	for (var i = 0; i < bars; i++) { //Deze loopt de staven.
// 		canvasCtx.fillStyle = "hsla("+i*12+", "+50+Math.floor(fbcArray[i]/255*50)+"%, 20%,"+(fbcArray[i]/255)+")";
// 		barX = i * 3; //Bepaalt de plaats van iederen staaf, zodat ze naast elkaar staan.
// 		barWidth = 2; //Bepaalt de breedte van de staven.
// 		barHeight = -(fbcArray[i] / 2);
// 		if (fbcArray[i] >= 0.5) {barHeight = -(fbcArray[i] * 1)} //Bepaalt de hoogte van de staven op basis van de de audiodata (dus het samplegetal) die in de array is gestopt. 
// 		//  fillRect( x, y, width, height ) // Explanation of the parameters below
// 		canvasCtx.fillRect(barX, canvas.height, barWidth, barHeight); //Deze geeft de staven weer.
// 	};
// };

function frameLooper(){
	window.requestAnimationFrame(frameLooper); //Creërt een loop voor de animatie.
	fbcArray = new Uint8Array(analyser.frequencyBinCount); //Stopt de audiodata in een array.
	analyser.getByteFrequencyData(fbcArray);
	canvasCtx.clearRect(0, 0, canvas.width, canvas.height); //'Clear' de canvas.
	
	bars = 30; //Hoeveelheid staven(bars).
	for (var i = 0; i < bars; i++) { //Deze loopt de staven.
		canvasCtx.fillStyle = "hsla("+i*12+", "+50+Math.floor(fbcArray[i]/255*50)+"%, 20%,"+(fbcArray[i]/255)+")";
		barX = i * 3; //Bepaalt de plaats van iederen staaf, zodat ze naast elkaar staan.
		barWidth = 5; //Bepaalt de breedte van de staven.
		barHeight = -(fbcArray[i]);
		if (fbcArray[i] >= 0.5) {barHeight = -(fbcArray[i] * 0.5)} //Bepaalt de hoogte van de staven op basis van de de audiodata (dus het samplegetal) die in de array is gestopt. 
		//  fillRect( x, y, width, height ) // Explanation of the parameters below
		canvasCtx.fillRect(barX, canvas.height, barWidth, barHeight); //Deze geeft de staven weer.
	};
};


