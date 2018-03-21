// /**
//  * Player class containing the state of our playlist and where we are in it.
//  * Includes all methods for playing, skipping, updating the display, etc.
//  * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
//  */
// let Player = function(playlist) {
//     this.index = 0;
//     this.muted = false;
//     this.playing = false;
//     this.pausedAt = 0;
//     this.storedVolume = 1;
//
//     this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//
//     this.audio = null;
//     this.audioBufferSourceNode = this.audioCtx.createBufferSource;
//
//     this.trackGainNode = this.audioCtx.createGain();
//     this.trackGainNode.connect(this.audioCtx.destination);
//
//     this.gainNode = this.audioCtx.createGain();
//     this.gainNode.connect(this.trackGainNode);
//
//     // Display the title of the first track.
//     document.getElementById('track').innerHTML = '1. ' + '<b>' + playlist.get(0).title + '</b> <br>' + playlist.get(0).artist + '&centerdot;';
// };
//
// Player.prototype = {
//     /**
//      * Play a song in the playlist.
//      * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
//      */
//     play: function(index) {
//         var self = this;
//
//         if (index !== 0 && !index)
//             index = this.index;
//
//         document.querySelectorAll('.list-song').forEach(function (div) {
//             div.classList.remove('playingHighlight');
//         });
//         document.getElementById('track' + index).classList.add('playingHighlight');
//
//         index = typeof index === 'number' ? index : self.index;
//         var data = playlistIndexToTrackInfoMap.get(index);
//
//         this.trackGainNode.gain.setTargetAtTime(data.trackGain, audioCtx.currentTime, 0.01);
//
//         if (self.audio)
//             self.audio.pause();
//
//         self.audio = new Audio();
//         self.audio.src = data.file;
//         self.audio.controls = false;
//         self.audio.autoplay = false;
//         document.body.appendChild(audio);
//
//         self.audioBufferSourceNode = audioCtx.createMediaElementSource(audio);
//         self.audioBufferSourceNode.connect(this.gainNode);
//
//         audio.onended = function () {
//             self.skip('next');
//         };
//
//         // Keep track of the index we are currently playing.
//         self.index = index;
//
//         // Start upating the progress of the track.
//         requestAnimationFrame(self.step.bind(self));
//
//         self.audio.currentTime = self.pausedAt;
//         self.audio.play();
//
//         self.pausedAt = 0;
//         self.playing = true;
//
//         self.audio.onloadedmetadata = function (ev) {
//             // Update the track display.
//             document.getElementById('track').innerHTML = (index + 1) + '. ' + '<b>' + data.title + '</b><br>' + data.artist + ' &centerdot;';
//             document.getElementById('duration').innerHTML = self.formatTime(Math.round(self.audio.duration));
//
//             // Show the pause button.
//             document.getElementById('playBtn').style.display = 'none';
//             document.getElementById('pauseBtn').style.display = '';
//         };
//
//         scrollToTrack(index);
//
//     },
//
//     pause: function() {
//         var self = this;
//
//         self.pausedAt = self.audio.currentTime;
//         self.audio.pause();
//
//         document.getElementById('playBtn').style.display = '';
//         document.getElementById('pauseBtn').style.display = 'none';
//     },
//
//     stop: function() {
//         var self = this;
//
//         if (self.audio) {
//             self.audio.pause();
//             self.audio.currentTime = 0;
//         }
//
//         document.getElementById('playBtn').style.display = '';
//         document.getElementById('pauseBtn').style.display = 'none';
//     },
//
//     getCurrentTime: function() {
//         return self.audio.currentTime;
//     },
//
//     /** @param  {String} direction 'next' or 'prev'. */
//     skip: function(direction) {
//         var self = this;
//
//         // Get the next track based on the direction of the track.
//         var index = 0;
//         if (direction === 'prev') {
//             index = self.index - 1;
//             if (index < 0) {
//                 index = playlistIndexToTrackInfoMap.size - 1;
//             }
//         } else {
//             index = self.index + 1;
//             if (index >= playlistIndexToTrackInfoMap.size) {
//                 index = 0;
//             }
//         }
//
//         self.skipTo(index);
//     },
//
//     skipTo: function(index) {
//         var self = this;
//
//         self.play(index);
//
//         // Reset progress.
//         document.getElementById('progress').value = 0;
//     },
//
//     volume: function(val) {
//         var self = this;
//
//         if (val > 1) val = 1;
//         if (val < 0) val = 0;
//
//         var scaledVolume = 3.16e-3 * Math.exp(val * 5.757);
//         if (val === 0)
//             scaledVolume = 0;
//
//         this.gainNode.gain.setTargetAtTime(scaledVolume, audioCtx.currentTime, 0.02);
//
//         this.storedVolume = val;
//
//         // Update the display on the slider.
//         document.getElementById('sliderBtn').value = ((val * 100) || 0);
//     },
//
//     /** @param  {Number} per Percentage through the song to skip. */
//     seek: function(per) {
//         var self = this;
//
//         // Convert the percent into a seek position.
//         var seekPosition = self.audio.duration * per;
//
//         self.audio.currentTime = seekPosition;
//
//         // Determine our current seek position.
//         document.getElementById('timer').innerHTML = self.formatTime(Math.round(seekPosition));
//         document.getElementById('progress').value = ((per * 100) || 0);
//     },
//
//     /** The step called within requestAnimationFrame to update the playback position. */
//     step: function() {
//         var self = this;
//
//         // Determine our current seek position.
//         var elapsed = self.audio.currentTime;
//         document.getElementById('timer').innerHTML = self.formatTime(Math.round(elapsed));
//         if (self.audio)
//             document.getElementById('progress').value = (((elapsed / self.audio.duration) * 100) || 0);
//
//         // If the sound is still playing, continue stepping.
//         if (this.playing) {
//             requestAnimationFrame(self.step.bind(self));
//         }
//     },
//
//     toggleVolume: function() {
//         var newIcon = '';
//         if (player.muted)
//         {
//             gainNode.gain.setTargetAtTime(this.storedVolume, audioCtx.currentTime, 0.02);
//             newIcon = 'volume-up'
//         }
//         else
//         {
//             gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.02);
//             newIcon = 'volume-off'
//         }
//
//         player.muted = !player.muted;
//         document.getElementById('volumeBtnIcon').setAttribute('data-icon', newIcon);
//     },
//
//     /**
//      * Format the time from seconds to M:SS.
//      * @param  {Number} secs Seconds to format.
//      * @return {String}      Formatted time.
//      */
//     formatTime: function(secs) {
//         var minutes = Math.floor(secs / 60) || 0;
//         var seconds = (secs - minutes * 60) || 0;
//
//         return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
//     }
// };
//
// // Bind our player controls.
// document.getElementById('playBtn').addEventListener('click', function() {
//     player.play();
// });
// document.getElementById('pauseBtn').addEventListener('click', function() {
//     player.pause();
// });
// document.getElementById('prevBtn').addEventListener('click', function() {
//     player.skip('prev');
// });
// document.getElementById('nextBtn').addEventListener('click', function() {
//     player.skip('next');
// });
// document.getElementById('progress').addEventListener('click', function(event) {
//     var x = event.offsetX;
//     var clickedValue = x * this.max / this.offsetWidth;
//     var clickedPercent = clickedValue / 100;
//
//     player.seek(clickedPercent);
// });
// document.getElementById('volumeBtn').addEventListener('click', function() {
//     player.toggleVolume();
// });
//
// // Setup the event listeners to enable dragging of volume slider.
// document.getElementById('sliderBtn').addEventListener('click', function(event) {
//     var x = event.offsetX;
//     var clickedValue = x * this.max / this.offsetWidth;
//     var clickedPercent = clickedValue / 100;
//
//     player.volume(clickedPercent);
// });
// document.getElementById('sliderBtn').addEventListener('mousedown', function() {
//     window.sliderDown = true;
// });
// document.getElementById('sliderBtn').addEventListener('mouseup', function() {
//     window.sliderDown = false;
// });
//
// var move = function(event) {
//     if (window.sliderDown) {
//         var x = event.offsetX;
//         var clickedValue = x * this.max / this.offsetWidth;
//         var clickedPercent = clickedValue / 100;
//
//         console.log('x ' + x);
//         console.log('clickedValue ' + x * this.max / this.offsetWidth);
//         console.log('clickedPercent ' + clickedPercent);
//
//         player.volume(clickedPercent);
//     }
// };
//
// document.getElementById('sliderBtn').addEventListener('mousemove', move);
//
// /**
//  * Format the time from seconds to M:SS.
//  * @param  {Number} secs Seconds to format.
//  * @return {String}      Formatted time.
//  */
// function formatTime(secs) {
//     var minutes = Math.floor(secs / 60) || 0;
//     var seconds = (secs - minutes * 60) || 0;
//
//     return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
// }
//
// function scrollToTrack(index)
// {
//     const element = document.getElementById('track' + index);
//     const elementRect = element.getBoundingClientRect();
//     const absoluteElementTop = elementRect.top + window.pageYOffset;
//     const middle = absoluteElementTop - (window.innerHeight / 2);
//     window.scrollTo(0, middle);
// }
//
// var player = new Player(playlistIndexToTrackInfoMap);