<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="inc_title.jsp"/>
    <jsp:include page="inc_header.jsp"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.9/howler.js"></script>
    <script>

    </script>
    <style>
        body {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
        }

        #root {
            flex: 1 0 auto;
        }
    </style>
</head>
<body>

<jsp:include page="header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <span class="title">
                <span>Music</span>
            </span>
        </div>
    </div>
</section>

<section class="section" id="root">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column is-one-fifth">
                <h3 class="subtitle is-3">Menu</h3>

            </div>
            <div class="column is-four-fifths">
                <h3 class="subtitle is-3">Playlist</h3>

                <!-- Playlist -->
                <div id="playlist">
                    <div id="list"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section">
    <nav class="level">
        <!-- Left side -->
        <div class="level-left">
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
                <progress id="progress" style="width:400px;" class="progress is-small is-success" value="0" max="100">0%</progress>
            </p>
            <p class="level-item">
                <span id="duration">0:00</span>
            </p>
            <p class="level-item">
            </p>
            <p class="level-item">
            </p>
            <p class="level-item">
                <a class="button is-small" id="volumeBtn">
                    <span class="icon">
                        <i class="fas fa-volume-up"></i>
                    </span>
                </a>
            </p>
            <div class="level-item">
                <progress id="sliderBtn" style="width:100px;" class="progress is-small is-success" value="100" max="100">0%</progress>
            </div>
        </div>
    </nav>

    <nav class="level">
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
    </nav>
</section>
<jsp:include page="footer.jsp"/>

<%--<script src="js/player.js">--%>
<script>
    /*!
 *  Howler.js Audio Player Demo
 *  howlerjs.com
 *
 *  (c) 2013-2018, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

    // Cache references to DOM elements.
    var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress',
        'bar', 'wave', 'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];
    elms.forEach(function(elm) {
        window[elm] = document.getElementById(elm);
    });

    /**
     * Player class containing the state of our playlist and where we are in it.
     * Includes all methods for playing, skipping, updating the display, etc.
     * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
     */
    var Player = function(playlist) {
        this.playlist = playlist;
        this.index = 0;

        // Display the title of the first track.
        track.innerHTML = '1. ' + playlist[0].title;

        // Setup the playlist display.
        playlist.forEach(function(song) {
            var div = document.createElement('div');
            div.className = 'list-song';
            div.innerHTML = song.title;
            div.onclick = function() {
                player.skipTo(playlist.indexOf(song));
            };
            list.appendChild(div);
        });
    };
    Player.prototype = {
        /**
         * Play a song in the playlist.
         * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
         */
        play: function(index) {
            var self = this;
            var sound;

            index = typeof index === 'number' ? index : self.index;
            var data = self.playlist[index];

            // If we already loaded this track, use the current one.
            // Otherwise, setup and load a new Howl.
            if (data.howl) {
                sound = data.howl;
            } else {
                sound = data.howl = new Howl({
                    src: [data.file],
                    html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
                    onplay: function() {
                        // Display the duration.
                        duration.innerHTML = self.formatTime(Math.round(sound.duration()));

                        // Start upating the progress of the track.
                        requestAnimationFrame(self.step.bind(self));

                        // Start the wave animation if we have already loaded
                        // wave.container.style.display = 'block';
                        // bar.style.display = 'none';
                        pauseBtn.style.display = '';
                    },
                    onload: function() {
                        // Start the wave animation.
                        // wave.container.style.display = 'block';
                        // bar.style.display = 'none';
                        // loading.style.display = 'none';
                    },
                    onend: function() {
                        // Stop the wave animation.
                        // wave.container.style.display = 'none';
                        // bar.style.display = 'block';
                        self.skip('right');
                    },
                    onpause: function() {
                        // Stop the wave animation.
                        // wave.container.style.display = 'none';
                        // bar.style.display = 'block';
                    },
                    onstop: function() {
                        // Stop the wave animation.
                        // wave.container.style.display = 'none';
                        // bar.style.display = 'block';
                    }
                });
            }

            // Begin playing the sound.
            sound.play();

            // Update the track display.
            track.innerHTML = (index + 1) + '. ' + data.title;

            // Show the pause button.
            if (sound.state() === 'loaded') {
                playBtn.style.display = 'none';
                pauseBtn.style.display = '';
            } else {
                // loading.style.display = '';
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'none';
            }

            // Keep track of the index we are currently playing.
            self.index = index;
        },

        /**
         * Pause the currently playing track.
         */
        pause: function() {
            var self = this;

            // Get the Howl we want to manipulate.
            var sound = self.playlist[self.index].howl;

            // Puase the sound.
            sound.pause();

            // Show the play button.
            playBtn.style.display = '';
            pauseBtn.style.display = 'none';
        },

        /**
         * Skip to the next or previous track.
         * @param  {String} direction 'next' or 'prev'.
         */
        skip: function(direction) {
            var self = this;

            // Get the next track based on the direction of the track.
            var index = 0;
            if (direction === 'prev') {
                index = self.index - 1;
                if (index < 0) {
                    index = self.playlist.length - 1;
                }
            } else {
                index = self.index + 1;
                if (index >= self.playlist.length) {
                    index = 0;
                }
            }

            self.skipTo(index);
        },

        /**
         * Skip to a specific track based on its playlist index.
         * @param  {Number} index Index in the playlist.
         */
        skipTo: function(index) {
            var self = this;

            // Stop the current track.
            if (self.playlist[self.index].howl) {
                self.playlist[self.index].howl.stop();
            }

            // Reset progress.
            progress.value = 0;

            // Play the new track.
            self.play(index);
        },

        /**
         * Set the volume and update the volume slider display.
         * @param  {Number} val Volume between 0 and 1.
         */
        volume: function(val) {
            var self = this;

            // Update the global volume (affecting all Howls).
            var scaledVolume = 3.16e-3 * Math.exp(val * 5.757);
            if (val === 0)
                scaledVolume = 0;
            Howler.volume(scaledVolume);

            // Update the display on the slider.
            // var barWidth = (val * 90) / 100;
            // barFull.style.width = (barWidth * 100) + '%';
            sliderBtn.value = ((val * 100) || 0);
        },

        /**
         * Seek to a new position in the currently playing track.
         * @param  {Number} per Percentage through the song to skip.
         */
        seek: function(per) {
            var self = this;

            // Get the Howl we want to manipulate.
            var sound = self.playlist[self.index].howl;

            // Convert the percent into a seek position.
            // if (sound.playing()) {
            sound.seek(sound.duration() * per);

            // Determine our current seek position.
            var seek = sound.seek() || 0;
            timer.innerHTML = self.formatTime(Math.round(seek));
            progress.value = (((seek / sound.duration()) * 100) || 0);
            // }
        },

        /**
         * The step called within requestAnimationFrame to update the playback position.
         */
        step: function() {
            var self = this;

            // Get the Howl we want to manipulate.
            var sound = self.playlist[self.index].howl;

            // Determine our current seek position.
            var seek = sound.seek() || 0;
            timer.innerHTML = self.formatTime(Math.round(seek));
            progress.value = (((seek / sound.duration()) * 100) || 0);

            // If the sound is still playing, continue stepping.
            if (sound.playing()) {
                requestAnimationFrame(self.step.bind(self));
            }
        },

        /**
         * Toggle the playlist display on/off.
         */
        togglePlaylist: function() {
            var self = this;
            var display = (playlist.style.display === 'block') ? 'none' : 'block';

            setTimeout(function() {
                playlist.style.display = display;
            }, (display === 'block') ? 0 : 500);
            playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
        },

        /**
         * Toggle the volume display on/off.
         */
        toggleVolume: function() {
            if (Howler.volume() === 0)
            {
                player.volume(1);
            }
            else
            {
                player.volume(0);
            }

            // var self = this;
            // var display = (volume.style.display === 'block') ? 'none' : 'block';
            //
            // setTimeout(function() {
            //     volume.style.display = display;
            // }, (display === 'block') ? 0 : 500);
            // volume.className = (display === 'block') ? 'fadein' : 'fadeout';
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

        console.log('x ' + x);
        console.log('clickedValue ' + x * this.max / this.offsetWidth);
        console.log('clickedPercent ' + clickedPercent);

        player.seek(clickedPercent);
    });
    // playlistBtn.addEventListener('click', function() {
    //     player.togglePlaylist();
    // });
    playlist.addEventListener('click', function() {
        player.togglePlaylist();
    });
    volumeBtn.addEventListener('click', function() {
        player.toggleVolume();
    });

    // Setup the event listeners to enable dragging of volume slider.
    sliderBtn.addEventListener('click', function(event) {
        var x = event.offsetX;
        var clickedValue = x * this.max / this.offsetWidth;
        var clickedPercent = clickedValue / 100;

        console.log('x ' + x);
        console.log('clickedValue ' + x * this.max / this.offsetWidth);
        console.log('clickedPercent ' + clickedPercent);

        player.volume(clickedPercent);
    });
    sliderBtn.addEventListener('mousedown', function() {
        window.sliderDown = true;
    });
    sliderBtn.addEventListener('touchstart', function() {
        window.sliderDown = true;
    });
    sliderBtn.addEventListener('mouseup', function() {
        window.sliderDown = false;
    });
    sliderBtn.addEventListener('touchend', function() {
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
    sliderBtn.addEventListener('touchmove', move);

</script>

<script>
    var player = new Player([
        {
            title: 'Jazz Bass',
            file: '${pageContext.request.contextPath}/images/jazz.flac',
            howl: null
        },
        {
            title: 'Deluxe 65',
            file: '${pageContext.request.contextPath}/images/deluxe65.flac',
            howl: null
        }
    ]);
</script>
</body>
</html>