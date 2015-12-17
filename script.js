//////////////////////////////////////////
//	VARIABLES
//////////////////////////////////////////
var canvas = document.getElementById("visuals1"), //Zet de variabel 'canvas' gelijk aan de canvas in het HTML-bestand 
	canvasCtx = canvas.getContext("2d"), //We geven de canvas een 2D context en slaan deze op 
	//player1 = new Audio(), //creates new <audio>
    player1 = document.getElementById("player1"),
    player2 = document.getElementById("player2"),
    PBSpeedDeck1,
    PBSpeedDeck2,
	audioCtx = new AudioContext(),
	source1 = audioCtx.createMediaElementSource(player1),
	source2 = audioCtx.createMediaElementSource(player2),

	frameLooperRunning = false,
    
	//creates an analyser node
	splitterNodes = [
		audioCtx.createChannelSplitter(2),
		audioCtx.createChannelSplitter(2)
	],
	gainNodes = [
		audioCtx.createGain(),
		audioCtx.createGain(),
		audioCtx.createGain(),
		audioCtx.createGain()
	],



	merger = audioCtx.createChannelMerger(4),

	analyser = audioCtx.createAnalyser(),

	//creates 10 biquadFilter nodes, one for each frequency in our equaliser
	EQNodes = [
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
for (var i = 0; i < EQNodes.length; i++) {
	EQNodes[i].type = "peaking";
	EQNodes[i].Q.value = 1;
	EQNodes[i].frequency.value = equaliserFrequencies[i];
	EQNodes[i].gain.value = 0;
};

//audio settings





//////////////////////////////////////////
//	EVENT LISTENERS
//////////////////////////////////////////

//load song to deck 1
$('#listSongs').on('click', '.deck1Button', function() {
	var songNumber = this.id;
	var songURL = searchResults.songs[songNumber].url;
	new SoundCloudAudioSource1(player1).loadStream(songURL);
	console.log("DECK-1 buttonNumber = #" + songNumber);
});

//load song to deck 2
$('#listSongs').on('click', '.deck2Button', function() {
	var songNumber = this.id;
	var songURL = searchResults.songs[songNumber].url;
	new SoundCloudAudioSource2(player2).loadStream(songURL);
	console.log("DECK-2 buttonNumber = #" + songNumber);
});


//range slider inputs to equaliser nodes
document.querySelector(".equaliserSliders").addEventListener('input', function () {
	for (var i = 0; i < EQNodes.length; i++) {
		EQNodes[i].gain.value = document.querySelector(sliderIDList[i]).value;
		console.log(EQNodes[i].gain.value);
	};
}, false);
//reset button
document.querySelector(".resetButton").addEventListener('click', function () {
	for (var i = 0; i < EQNodes.length; i++) {
		EQNodes[i].gain.value = 0;
		console.log(EQNodes[i].gain.value);
	};
}, false);


//range slider inputs to playbackSpeed
//deck 1
document.querySelector("#tempoDeck1").addEventListener('input', function () {
	PBSpeedDeck1 = document.querySelector('#tempoDeck1').value;
	player1.playbackRate = document.querySelector('#tempoDeck1').value;
	console.log("player1.playbackRate = " + player1.playbackRate);
}, false);
//deck 2
document.querySelector("#tempoDeck2").addEventListener('input', function () {
	PBSpeedDeck2 = document.querySelector('#tempoDeck2').value;
	player2.playbackRate = document.querySelector('#tempoDeck2').value;
	console.log("player2.playbackRate = " + player2.playbackRate);
}, false);

//crossFader
document.querySelector(".crossFader").addEventListener('input', function () {
	crossFaderPosition = document.querySelector('.crossFader').value;
	var x = parseInt(crossFaderPosition.value) / parseInt(crossFaderPosition.max);
  // Use an equal-power crossfading curve:
	var gain1 = Math.cos(x * 0.5*Math.PI);
	var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
	gainNodes[0].gain.value = gain1;
	gainNodes[1].gain.value = gain1;
	gainNodes[2].gain.value = gain2;
	gainNodes[3].gain.value = gain2;

}, false);



//De hierboven aangeroepen functie:

	//document.getElementById("audioBox").appendChild(player1); //Stelt dat de hierboven gemaakte audio in de audioBox van het HTML-bestand gaat.

	//Hieronder wordt de boel met elkaar geconnect: 
	
//////////////////////////////////////////
//	AUDIO PATH  
//////////////////////////////////////////


source1.connect(splitterNodes[0]);
source2.connect(splitterNodes[1]);

//connect LEFT  channel of deck 1 to gain[0]
splitterNodes[0].connect(gainNodes[0], 0, 0);
//connect RIGHT channel of deck 1 to gain[1]
splitterNodes[0].connect(gainNodes[1], 1, 0);
//connect LEFT  channel of deck 2 to gain[2]
splitterNodes[1].connect(gainNodes[2], 0, 0);
//connect RIGHT channel of deck 2 to gain[3]
splitterNodes[1].connect(gainNodes[3], 1, 0);

gainNodes[0].connect(merger, 0, 0);
gainNodes[1].connect(merger, 0, 1);
gainNodes[2].connect(merger, 0, 0);
gainNodes[3].connect(merger, 0, 1);g
merger.connect(EQNodes[0]);
EQNodes[0].connect(EQNodes[1]);
EQNodes[1].connect(EQNodes[2]);
EQNodes[2].connect(EQNodes[3]);
EQNodes[3].connect(EQNodes[4]);
EQNodes[4].connect(EQNodes[5]);
EQNodes[5].connect(EQNodes[6]);
EQNodes[6].connect(EQNodes[7]);
EQNodes[7].connect(EQNodes[8]);
EQNodes[8].connect(EQNodes[9]);
EQNodes[9].connect(analyser);
analyser.connect(audioCtx.destination);





//////////////////////////////////////////
//	SOUNDCLOUD
//////////////////////////////////////////
var audioSource,
    searchQuery,
	maxResultsAmount= 15,
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
			searchResults.songs = [];
			for (var i=0; i<APIResponse.length; i++){
				songInfo = new Object();
				songInfo.title = (APIResponse[i].title);
				songInfo.url = (APIResponse[i].permalink_url);
				songInfo.uploader = (APIResponse[i].user.username);
				searchResults.songs.push(songInfo);
			}
			console.log(searchResults);
            $("#listSongs li").remove();
			var theTemplateScript = $("#list-template").html(); 
            var theTemplate = Handlebars.compile(theTemplateScript); 
            $("#listSongs").append(theTemplate(searchResults.songs));
            
            document.getElementById('searchHeader').style = "visibility:visible";
            if (searchResults.songs.length === 0) {
                document.getElementById('searchHeader').textContent = "Search results: no results";
            }
            else {
                document.getElementById('moreResults').style = "visibility:visible";
                document.getElementById('searchHeader').textContent = "Search results: " + searchResults.songs.length + " results";
            }
		}
	};
}

// player1.addEventListener('error', function(e) {
//     var noSourceLoaded = (this.networkState===HTMLMediaElement.NETWORK_NO_SOURCE);
//     if(noSourceLoaded) window.alert("Sorry, this song is blocked (copyright), please try another one");
// }, true);

// var xhr = new XMLHttpRequest();

//Vraagt toestemming aan de soundcloud om het liedje af te spelen, etc.
var SoundCloudAudioSource1 = function(audioElement) {
    player1.crossOrigin = 'Anonymous';
    var self = this;
    self.streamData = new Uint8Array(128);
  
    this.loadStream = function(urlSong) {
        var clientID = "00856b340598a8c7e317e1f148b5a13c";

        SC.initialize({
            client_id: clientID
        });
        SC.get('/resolve', { url: urlSong }, function(track) {
            SC.get('/tracks/' + track.id, {}, function(sound, error) {
                player1.setAttribute('src', sound.stream_url + '?client_id=' + clientID);
                player1.play();
            });
        });
    };
    if (frameLooperRunning = false) {
    	frameLooper;
    }
};
var SoundCloudAudioSource2 = function(audioElement) {
    player2.crossOrigin = 'Anonymous';
    var self = this;
    self.streamData = new Uint8Array(128);
  
    this.loadStream = function(urlSong) {
        var clientID = "00856b340598a8c7e317e1f148b5a13c";

        SC.initialize({
            client_id: clientID
        });
        SC.get('/resolve', { url: urlSong }, function(track) {
            SC.get('/tracks/' + track.id, {}, function(sound, error) {
                player2.setAttribute('src', sound.stream_url + '?client_id=' + clientID);
                player2.play();
            });
        });
    };
    if (frameLooperRunning = false) {
    	frameLooper;
    }
};
   

//Deze functie wordt afgespeeld als er op de "More results" (of "Less results") knop wordt gedrukt.
var moreResults = function() {
    if (maxResultsAmount === 15) {
        maxResultsAmount = 30;
        soundcloudRequest();
        document.getElementById('moreResults').textContent = "Less results";
    }
    else {
        maxResultsAmount = 15;
        soundcloudRequest(); 
        document.getElementById('moreResults').textContent = "More results";
    }
};

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
	frameLooperRunning = true;
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
		console.log(fbcArray);
	};
};


