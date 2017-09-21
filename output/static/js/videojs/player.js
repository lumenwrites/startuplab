var videos = [ "jFPj5MtoBrU" ]
var playlist = videos.map(function (video, index) {
    return {
	sources: [{
	    src: "https://www.youtube.com/watch?v="+video,
	    type: "video/youtube",
	}],
	poster: "https://img.youtube.com/vi/"+video+"/hqdefault.jpg"
    }
})

var player = videojs('#video', {
});
/*
    nativeControlsForTouch: false,
    controlBar: {
	children: [
            'playToggle',
            'muteToggle',	  
            'volumeControl',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'liveDisplay',
            'remainingTimeDisplay',
            'customControlSpacer',
            'playbackRateMenuButton',
            'chaptersButton',
            'subtitlesButton',
            'captionsButton',
            'fullscreenToggle'
	]      
    }
*/

player.playlist(playlist);

function playThis(event) {
    console.log("Play " + event.data.index);
    player.playlist.currentItem(event.data.index);
    $(".overlay").removeClass("active");    
    $(event.target).addClass('active');
    localStorage.setItem("lecture-"+slug, event.data.index);
}

/* Append videos to playlist, onClick plays video. */
/*
if (playlist.length > 1) {
    playlist.map(function (video, index) {
	$('.video-list').append($('<div class="video" id="'+index+'"></div>').html('<div class="wrapper"><div class="thumbnail" style="background-image: url('+video.poster+');"></div></div><div class="overlay"></div>'));
	
	$('#'+index).click({index: index}, playThis);
    })
}

$('.video-list').append($('<div class="clearfix"></div>'));
*/
/* Image overlay to disable right click */
player.imageOverlay({
    image_url: "",
    click_url:"#",
    opacity: 0,
    start_time: 0,
    end_time: 99999999999
});


// Save/Load volume
if (localStorage.getItem("volume")) {
    player.volume(localStorage.getItem("volume"));
}
player.on('volumechange', function () {
    var level = this.volume();
    console.log("Volume " + level);
    localStorage.setItem("volume", level);
});

// Load previous lecture if it was saved
/*
if (localStorage.getItem("lecture-"+slug)) {
    var index = localStorage.getItem("lecture-"+slug);
    player.playlist.currentItem(index);
    $(".overlay").removeClass("active"); 
    $("#"+index).children(".overlay").addClass('active');
    console.log("Last lecture " + index); 
}
*/
// Use plugin to save playback position
/*
player.remember({"localStorageKey": "playback-position-"+slug});
*/
