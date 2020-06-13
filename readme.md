## Loon
Music Player
![Screenshot](https://i.imgur.com/GQD7KeL.jpg)

### Motivation
Stream your music library from your browser. Support desktop or mobile device.
 

### Feature Summary
* Stream your music library from any browser
* Album art support
* Spotify api support for artist/album art
* Make playlists
* Mark songs as your favorites!
* Drag and drop re-ordering for playlists
* Equalizer
* Replaygain support
* Transcode to various mp3 quality levels
* Watch your music folder for changes and automatically sync
* Keyboard shortcuts for playback controls.

### Known Issues / Todo
* Consider Redux?
* Performance, specifically with re-rendering. One example being updating the track's
  progress bar seems to cause the entire PlaybackControls component to re-render. 

### Getting Started

#### Prerequisites
* Windows (linux is untested)
* Java
* Postgres
* Music collection:
  * Cleanly tagged with artist, album, albumartist, title, musicBrainzTrackId, replaygain
  * Album art embedded in the files or in the same folder and named folder.jpg

#### Building
1. Clone project
2. Build with Gradle

### Deployment (WIP)
1. Configure application.properties for DB connection info, etc...
2. Build with Gradle
3. Place jar file where you want to run Loon
4. Run 'java -jar nameofjar.jar'
5. Default port is 8082
5. Log in as admin@test.com, pw: pw.
6. Once logged in, go to Admin -> Manage System to specify where music is stored.

### Built With (partial listing)
* [Spring Boot](https://spring.io/projects/spring-boot) - Backend Framework
* [React](https://reactjs.org/) - Frontend Framework
* [Bulma](https://bulma.io/) - CSS Framework
