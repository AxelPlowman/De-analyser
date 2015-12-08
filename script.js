var SoundCloudAudioSource = function(audioElement) {
    var player = document.getElementById(audioElement);
    player.crossOrigin = 'Anonymous';
    var self = this;
    self.streamData = new Uint8Array(128);
  
    var context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    var source = context.createMediaElementSource(player);
    source.connect(analyser);
    analyser.connect(context.destination);

    this.loadStream = function(track_url) {
        var clientID = "00856b340598a8c7e317e1f148b5a13c";

        SC.initialize({
            client_id: clientID
        });
        SC.get('/resolve', { url: track_url }, function(track) {
            SC.get('/tracks/' + track.id, {}, function(sound, error) {
                player.setAttribute('src', sound.stream_url + '?client_id=' + clientID);
                player.play();
            });
        });
    };
    frameLooper();
};

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var songLength;
var pre = document.querySelector('pre');
var myScript = document.querySelector('script');
var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var playbackControl = document.querySelector('.playback-rate-control');
var playbackValue = document.querySelector('.playback-rate-value');
playbackControl.setAttribute('disabled', 'disabled');
var loopstartControl = document.querySelector('.loopstart-control');
var loopstartValue = document.querySelector('.loopstart-value');
loopstartControl.setAttribute('disabled', 'disabled');
var loopendControl = document.querySelector('.loopend-control');
var loopendValue = document.querySelector('.loopend-value');
loopendControl.setAttribute('disabled', 'disabled');
// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source
function getData() {
  source = audioCtx.createBufferSource();
  request = new XMLHttpRequest();
  request.open('GET', 'viper.ogg', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        myBuffer = buffer;
        songLength = buffer.duration;
        source.buffer = myBuffer;
        source.playbackRate.value = playbackControl.value;
        source.connect(audioCtx.destination);
        source.loop = true;
        loopstartControl.setAttribute('max', Math.floor(songLength));
        loopendControl.setAttribute('max', Math.floor(songLength));
      },
      function(e){"Error with decoding audio data" + e.err});
  }
  request.send();
}
// wire up buttons to stop and play audio, and range slider control
play.onclick = function() {
  getData();
  source.start(0);
  play.setAttribute('disabled', 'disabled');
  playbackControl.removeAttribute('disabled');
  loopstartControl.removeAttribute('disabled');
  loopendControl.removeAttribute('disabled');
}
stop.onclick = function() {
  source.stop(0);
  play.removeAttribute('disabled');
  playbackControl.setAttribute('disabled', 'disabled');
  loopstartControl.setAttribute('disabled', 'disabled');
  loopendControl.setAttribute('disabled', 'disabled');
}
playbackControl.oninput = function() {
  source.playbackRate.value = playbackControl.value;
  playbackValue.innerHTML = playbackControl.value;
}
loopstartControl.oninput = function() {
  source.loopStart = loopstartControl.value;
  loopstartValue.innerHTML = loopstartControl.value;
}
loopendControl.oninput = function() {
  source.loopEnd = loopendControl.value;
  loopendValue.innerHTML = loopendControl.value;
}




// var analyser;

// var SoundCloudAudioSource = function(audioElement) {
//     var player = document.getElementById(audioElement);
//     player.crossOrigin = 'Anonymous';
//     var self = this;
//     self.streamData = new Uint8Array(128);
  
//     var context = new AudioContext();
//     analyser = context.createAnalyser();
//     analyser.fftSize = 256;
//     var source = context.createMediaElementSource(player);
//     source.playbackRate(1.24);
//     source.connect(analyser);
//     analyser.connect(context.destination);

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

// function frameLooper() { 
// 	window.requestAnimationFrame(frameLooper); //Elke keer dat het scherm ververst (60 keer per seconde ofzo?) wordt de functie opnieuw aangeroepen, er ontstaat dus een loop.
// 	frequencyData = new Uint8Array(analyser.frequencyBinCount); //Stopt de audiodata in een array (stap 1).
// 	analyser.getByteFrequencyData(frequencyData); //Stopt de audiodata in een array (stap 2).
	
// 	//Hier moeten de visuels worden geplaatst. De functie zorgt dat elke keer als het scherm een 'repaint' doet, de frequencyData ververst. Als jouw animatie hier staat en gebasseerd is op de frequencyData, dan wordt die dus ook steeds ververst.
// 	//console.log(frequencyData); //De console.log laat zien hoe de data in de array verandert, dit is slechts voorbeeld, als je ermee gaat werken zou ik het weghalen. Het vertraagt slechts.
//     // !!!!! -> Er zitten 128 getallen in de array!!!!!!!
// }

// window.onload = function() {
//     var audioSource = new SoundCloudAudioSource('player');
//     var submitButton = document.getElementById('submit');
//     submitButton.onclick = function() {
//         var track_url = document.getElementById('input').value;
//         audioSource.loadStream(track_url);
//     };
// };

