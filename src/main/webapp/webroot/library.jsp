<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ct" uri="http://eric-hicks.com/loon/commontags" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="inc_title.jsp"/>
    <jsp:include page="inc_header.jsp"/>
    <style>
        #level {
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: #dbdbdb;
        }

        section {padding: 10px !important;}

        .playingHighlight {color: #1ed176;}

        .playlist {overflow-y: auto; }
        .list-song {cursor: pointer;}
    </style>

    <script>
        function ajaxGetMoreTracks(from, amount)
        {
            $("#result").load('${pageContext.request.contextPath}/view?tab1=library&action=ajaxGetMoreTracks&from=${from}&amount=100');
        }
    </script>
</head>
<body>

<jsp:include page="header.jsp"/>

<section class="section" id="root">
    <%--<div class="container">--%>
        <div class="columns is-multiline is-centered">
            <%--<div class="column is-one-fifth">--%>
                <%--<h5 class="subtitle is-5">Menu</h5>--%>

            <%--</div>--%>
            <div class="column is-three-fifths">
                <h5 class="subtitle is-5">Playlist</h5>

                <!-- Playlist -->
                <div id="playlist" class="playlist">
                    <div id="list">
                        <table class="table is-fullwidth is-hoverable is-narrow">
                            <jsp:include page="inc_libraryTracks.jsp" />
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div style="height: 150px;">

        </div>
    <%--</div>--%>
</section>

<section class="section" id="level">
    <nav class="level">
        <!-- Left side -->
        <div class="level-left">
            <p class="level-item">
                <a class="button" id="prevBtn">
                <span class="icon">
                    <i class="fas fa-step-backward"></i>
                </span>
                </a>
                <a class="button is-large" id="playBtn">
                <span class="icon"> 
                    <i class="fas fa-play"></i>
                </span>
                </a>
                <a class="button is-large" id="pauseBtn" style="display:none;">
                <span class="icon">
                    <i class="fas fa-pause"></i>
                </span>
                </a>
                <a class="button" id="nextBtn">
                <span class="icon">
                    <i class="fas fa-step-forward"></i>
                </span>
                </a>
            </p>
            <div class="level-item">
                <span id="timer">0:00</span> /
                <span id="duration">0:00</span>
                <span style="width:10px;"></span>
                <span id="track"></span>
            </div>
        </div>

        <!-- Right side -->
        <div class="level-right">
            <p class="level-item">
                <%--<progress id="progress" style="width:500px;" class="progress is-fullwidth is-small is-success" value="0" max="100">0%</progress>--%>
                <input id="progress" style="width:500px;" class="slider is-fullwidth is-small is-success" type="range" value="0" max="100" />
            </p>

            <div class="level-item is-hidden-mobile">
                <a class="button is-small" id="volumeBtn" style="margin-right:1em;margin-left:3em;">
                    <span class="icon">
                        <i id="volumeBtnIcon" class="fas fa-volume-up"></i>
                    </span>
                </a>
                <input id="sliderBtn" class="slider is-small is-success" type="range" value="100" max="100" />
            </div>
        </div>
    </nav>
</section>
<jsp:include page="footer.jsp"/>

<script>
    var playlistIndexToTrackInfo = [];
    <c:forEach var="track" items="${library}" varStatus="loop">
    playlistIndexToTrackInfo.push([
            <c:out value="${loop.index}" />,
            {
                id: '<c:out value="${track.id}" />',
                artist: '<c:out value="${track.artist}" />',
                title: '<c:out value="${track.title}" />',
                album: '<c:out value="${track.album}" />',
                duration: '<c:out value="${track.duration}" />',
                trackGain: '<c:out value="${track.trackGainLinear}" />',
                size: '<c:out value="${ct:fileSize(track.size)}" />',
                file: '${pageContext.request.contextPath}/media?id=${track.id}'
            }
        ]);
    </c:forEach>

    var playlistIndexToTrackInfoMap = new Map(playlistIndexToTrackInfo);
</script>
<script src="${pageContext.request.contextPath}/js/audioSampleLoader.js" ></script>
<script>
    // Cache references to DOM elements.
    var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'volumeBtn', 'progress', 'list', 'volume', 'sliderBtn'];
    elms.forEach(function(elm) {
        window[elm] = document.getElementById(elm);
    });

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    var biquadFilter = audioCtx.createBiquadFilter();
    var trackGainNode = audioCtx.createGain();
    trackGainNode.connect(biquadFilter);

    var gainNode = audioCtx.createGain();
    gainNode.connect(trackGainNode);

    var audioBufferSourceNode = audioCtx.createBufferSource;

    var audio;

    biquadFilter.connect(audioCtx.destination);

    biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = 1000;
    biquadFilter.gain.value = 0;

    /**
     * Player class containing the state of our playlist and where we are in it.
     * Includes all methods for playing, skipping, updating the display, etc.
     * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
     */
    var Player = function(playlist) {
        this.playlist = playlist;
        this.index = 0;
        this.muted = false;
        this.playing = false;
        this.startedAt = 0;
        this.pausedAt = 0;
        this.storedVolume = 1;

        // Display the title of the first track.
        track.innerHTML = '1. ' + playlist.get(0).artist + ' &centerdot; <b>' + playlist.get(0).title + '</b>';
    };

    Player.prototype = {
        /**
         * Play a song in the playlist.
         * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
         */
        play: function(index) {
            var self = this;

            if (index !== 0 && !index)
                index = this.index;

            document.querySelectorAll('.list-song').forEach(function (div) {
                div.classList.remove('playingHighlight');
            });
            document.getElementById('track' + index).classList.add('playingHighlight');

            index = typeof index === 'number' ? index : self.index;
            var data = self.playlist.get(index);

            trackGainNode.gain.setTargetAtTime(data.trackGain, audioCtx.currentTime, 0.01);

            if (audio)
                audio.pause();

            audio = new Audio();
            audio.src = data.file;
            audio.controls = false;
            audio.autoplay = false;
            document.body.appendChild(audio);
            
            audioBufferSourceNode = audioCtx.createMediaElementSource(audio);
            audioBufferSourceNode.connect(gainNode);

            audio.onended = function () {
                self.skip('next');
            };

            // Keep track of the index we are currently playing.
            self.index = index;

            // Start upating the progress of the track.
            requestAnimationFrame(self.step.bind(self));

            audio.currentTime = self.pausedAt;
            audio.play();

            self.pausedAt = 0;
            self.playing = true;

            audio.onloadedmetadata = function (ev) {
                // Update the track display.
                track.innerHTML = (index + 1) + '. ' + data.artist + ' &centerdot; <b>' + data.title + '</b>';
                duration.innerHTML = self.formatTime(Math.round(audio.duration));

                // Show the pause button.
                playBtn.style.display = 'none';
                pauseBtn.style.display = '';
            };

            scrollToTrack(index);

        },

        pause: function() {
            var self = this;

            self.pausedAt = audio.currentTime;
            audio.pause();
            
            playBtn.style.display = '';
            pauseBtn.style.display = 'none';
        },

        stop: function() {
            var self = this;

            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            playBtn.style.display = '';
            pauseBtn.style.display = 'none';
        },

        getCurrentTime: function() {
            return audio.currentTime;
        },

        /** @param  {String} direction 'next' or 'prev'. */
        skip: function(direction) {
            var self = this;

            // Get the next track based on the direction of the track.
            var index = 0;
            if (direction === 'prev') {
                index = self.index - 1;
                if (index < 0) {
                    index = self.playlist.size - 1;
                }
            } else {
                index = self.index + 1;
                if (index >= self.playlist.size) {
                    index = 0;
                }
            }

            self.skipTo(index);
        },

        skipTo: function(index) {
            var self = this;

            self.play(index);

            // Reset progress.
            progress.value = 0;
        },
        
        volume: function(val) {
            var self = this;

            if (val > 1) val = 1;
            if (val < 0) val = 0;

            var scaledVolume = 3.16e-3 * Math.exp(val * 5.757);
            if (val === 0)
                scaledVolume = 0;

            gainNode.gain.setTargetAtTime(scaledVolume, audioCtx.currentTime, 0.02);

            this.storedVolume = val;

            // Update the display on the slider.
            sliderBtn.value = ((val * 100) || 0);
        },

        /** @param  {Number} per Percentage through the song to skip. */
        seek: function(per) {
            var self = this;

            // Convert the percent into a seek position.
            var seekPosition = audio.duration * per;

            audio.currentTime = seekPosition;

            // Determine our current seek position.
            timer.innerHTML = self.formatTime(Math.round(seekPosition));
            progress.value = ((per * 100) || 0);
        },

        /** The step called within requestAnimationFrame to update the playback position. */
        step: function() {
            var self = this;

            // Determine our current seek position.
            var elapsed = audio.currentTime;
            timer.innerHTML = self.formatTime(Math.round(elapsed));
            if (audio)
                progress.value = (((elapsed / audio.duration) * 100) || 0);

            // If the sound is still playing, continue stepping.
            if (this.playing) {
                requestAnimationFrame(self.step.bind(self));
            }
        },

        toggleVolume: function() {
            var newIcon = '';
            if (player.muted)
            {
                gainNode.gain.setTargetAtTime(this.storedVolume, audioCtx.currentTime, 0.02);
                newIcon = 'volume-up'
            }
            else
            {
                gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.02);
                newIcon = 'volume-off'
            }

            player.muted = !player.muted;
            document.getElementById('volumeBtnIcon').setAttribute('data-icon', newIcon);
        },

        /**
         * Format the time from seconds to M:SS.
         * @param  {Number} secs Seconds to format.
         * @return {String}      Formatted time.
         */
        formatTime: function(secs) {
            var minutes = Math.floor(secs / 60) || 0;
            var seconds = (secs - minutes * 60) || 0;

            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }
    };

    // Bind our player controls.
    playBtn.addEventListener('click', function() {
        player.play();
    });
    pauseBtn.addEventListener('click', function() {
        player.pause();
    });
    prevBtn.addEventListener('click', function() {
        player.skip('prev');
    });
    nextBtn.addEventListener('click', function() {
        player.skip('next');
    });
    progress.addEventListener('click', function(event) {
        var x = event.offsetX;
        var clickedValue = x * this.max / this.offsetWidth;
        var clickedPercent = clickedValue / 100;

        player.seek(clickedPercent);
    });
    volumeBtn.addEventListener('click', function() {
        player.toggleVolume();
    });

    // Setup the event listeners to enable dragging of volume slider.
    sliderBtn.addEventListener('click', function(event) {
        var x = event.offsetX;
        var clickedValue = x * this.max / this.offsetWidth;
        var clickedPercent = clickedValue / 100;

        player.volume(clickedPercent);
    });
    sliderBtn.addEventListener('mousedown', function() {
        window.sliderDown = true;
    });
    sliderBtn.addEventListener('mouseup', function() {
        window.sliderDown = false;
    });

    var move = function(event) {
        if (window.sliderDown) {
            var x = event.offsetX;
            var clickedValue = x * this.max / this.offsetWidth;
            var clickedPercent = clickedValue / 100;

            console.log('x ' + x);
            console.log('clickedValue ' + x * this.max / this.offsetWidth);
            console.log('clickedPercent ' + clickedPercent);

            player.volume(clickedPercent);
        }
    };

    sliderBtn.addEventListener('mousemove', move);

    /**
     * Format the time from seconds to M:SS.
     * @param  {Number} secs Seconds to format.
     * @return {String}      Formatted time.
     */
    function formatTime(secs) {
        var minutes = Math.floor(secs / 60) || 0;
        var seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    function scrollToTrack(index)
    {
        const element = document.getElementById('track' + index);
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        window.scrollTo(0, middle);
    }
</script>
<script>
   var player = new Player(playlistIndexToTrackInfoMap);

</script>
</body>
</html>