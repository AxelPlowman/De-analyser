var analyser;

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

function frameLooper() { 
	window.requestAnimationFrame(frameLooper); //Elke keer dat het scherm ververst (60 keer per seconde ofzo?) wordt de functie opnieuw aangeroepen, er ontstaat dus een loop.
	frequencyData = new Uint8Array(analyser.frequencyBinCount); //Stopt de audiodata in een array (stap 1).
	analyser.getByteFrequencyData(frequencyData); //Stopt de audiodata in een array (stap 2).
	
	//Hier moeten de visuels worden geplaatst. De functie zorgt dat elke keer als het scherm een 'repaint' doet, de frequencyData ververst. Als jouw animatie hier staat en gebasseerd is op de frequencyData, dan wordt die dus ook steeds ververst.
	//console.log(frequencyData); //De console.log laat zien hoe de data in de array verandert, dit is slechts voorbeeld, als je ermee gaat werken zou ik het weghalen. Het vertraagt slechts.
    // !!!!! -> Er zitten 128 getallen in de array!!!!!!!
}

window.onload = function() {
    var audioSource = new SoundCloudAudioSource('player');
    var submitButton = document.getElementById('submit');
    submitButton.onclick = function() {
        var track_url = document.getElementById('input').value;
        audioSource.loadStream(track_url);
    };
};
