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
        body {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
        }

        #root {
            flex: 1 0 auto;
        }

        section {padding: 10px !important;}

        .playingHighlight {color: #1ed176;}

        .playlist {overflow-y: auto; max-height: 850px;}
        .list-song {cursor: pointer;}
    </style>
</head>
<body>

<jsp:include page="header.jsp"/>

<section class="section" id="root">
    <%--<div class="container">--%>
        <div class="columns is-multiline is-centered">
            <%--<div class="column is-one-fifth">--%>
                <%--<h5 class="subtitle is-5">Menu</h5>--%>

            <%--</div>--%>
            <div class="column is-four-fifths">
                <h5 class="subtitle is-5">Playlist</h5>

                <!-- Playlist -->
                <div id="playlist" class="playlist">
                    <div id="list">
                        <table class="table is-fullwidth is-hoverable">
                            <c:forEach var="track" items="${userSession.tracks}" varStatus="loop">
                                <tr id="track${loop.index}" class="list-song" title="${track.size}" onclick="player.skipTo(${loop.index})">
                                    <td class="has-text-right" style="width:1px;">
                                        ${loop.count}.
                                    </td>
                                    <td>
                                        ${track.artist} &centerdot; ${track.title}
                                    </td>
                                    <td class="has-text-right">
                                        ${track.formattedDuration}
                                    </td>
                                </tr>
                            </c:forEach>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    <%--</div>--%>
</section>

<section class="section">
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
                <span id="track"></span>
            </div>
        </div>

        <!-- Right side -->
        <div class="level-right">
            <p class="level-item">
                <span id="timer">0:00</span>
            </p>
            <p class="level-item">
                <progress id="progress" style="width:500px;" class="progress is-fullwidth is-small is-success" value="0" max="100">0%</progress>
            </p>
            <p class="level-item">
                <span id="duration">0:00</span>
            </p>
            
            <div class="level-item">
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
    <c:forEach var="track" items="${userSession.tracks}" varStatus="loop">
    playlistIndexToTrackInfo.push([
            <c:out value="${loop.index}" />,
            {
                id: '<c:out value="${track.id}" />',
                artist: '<c:out value="${track.artist}" />',
                title: '<c:out value="${track.title}" />',
                duration: '<c:out value="${track.duration}" />',
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

    var gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    var audioBufferSourceNode = audioCtx.createBufferSource;

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
        track.innerHTML = '1. ' + playlist.get(0).artist + ' &centerdot; ' + playlist.get(0).title;
    };

    Player.prototype = {
        /**
         * Play a song in the playlist.
         * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
         */
        play: function(index) {
            var self = this;

            if (!index)
                index = 0;

            document.querySelectorAll('.list-song').forEach(function (div) {
                div.classList.remove('playingHighlight');
            });
            document.getElementById('track' + index).classList.add('playingHighlight');

            index = typeof index === 'number' ? index : self.index;
            var data = self.playlist.get(index);

            var loader = new AudioSampleLoader();
            loader.src = data.file;
            loader.ctx = audioCtx;

            loader.onload = function () {
                var offset = self.pausedAt;

                audioBufferSourceNode = audioCtx.createBufferSource();
                audioBufferSourceNode.buffer = loader.response;
                audioBufferSourceNode.connect(gainNode);

                // if (!startTime)
                //     startTime = 0;
                audioBufferSourceNode.start(0, offset);

                audioBufferSourceNode.onended = function () {
                    self.skip('next');
                };

                // Update the track display.
                track.innerHTML = (index + 1) + '. ' + data.artist + ' &centerdot; ' + data.title;
                duration.innerHTML = self.formatTime(Math.round(audioBufferSourceNode.buffer.duration));

                // Show the pause button.
                playBtn.style.display = 'none';
                pauseBtn.style.display = '';

                // Keep track of the index we are currently playing.
                self.index = index;

                self.startedAt = audioCtx.currentTime - offset;
                self.pausedAt = 0;
                self.playing = true;

                // Start upating the progress of the track.
                requestAnimationFrame(self.step.bind(self));
            };

            loader.send();
        },

        pause: function() {
            var self = this;

            var elapsed = this.getCurrentTime();
            player.stop();
            self.pausedAt = elapsed;
            
            playBtn.style.display = '';
            pauseBtn.style.display = 'none';
        },

        stop: function() {
            var self = this;

            if (audioBufferSourceNode) {
                audioBufferSourceNode.disconnect();
                audioBufferSourceNode.stop(0);
                audioBufferSourceNode = null;
            }
            self.pausedAt = 0;
            self.startedAt = 0;
            self.playing = false;

            playBtn.style.display = '';
            pauseBtn.style.display = 'none';
        },

        getCurrentTime: function() {
            if(this.pausedAt) {
                return this.pausedAt;
            }
            if(this.startedAt) {
                return audioCtx.currentTime - this.startedAt;
            }
            return 0;
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

            if (self.playing)
                self.stop();
            self.pausedAt = 0;
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
            var seekPosition = audioBufferSourceNode.buffer.duration * per;

            self.stop();
            this.pausedAt = seekPosition;
            this.play(this.index);

            // Determine our current seek position.
            timer.innerHTML = self.formatTime(Math.round(seekPosition));
            progress.value = ((per * 100) || 0);
        },

        /**
         * The step called within requestAnimationFrame to update the playback position.
         */
        step: function() {
            var self = this;

            // Determine our current seek position.
            var elapsed = this.getCurrentTime();
            timer.innerHTML = self.formatTime(Math.round(elapsed));
            if (audioBufferSourceNode)
                progress.value = (((elapsed / audioBufferSourceNode.buffer.duration) * 100) || 0);

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
</script>
<script>
   var player = new Player(playlistIndexToTrackInfoMap);

</script>
</body>
</html>