## Loon
Music Player
![Screenshot](https://i.imgur.com/GQD7KeL.jpg)

### Motivation
Be able to stream your entire music library from your browser. Support desktop or mobile device.
 

### Feature Summary
* Stream your music library from any browser
* Album art support
* Last.fm api support for artist/album artwork
* Make playlists
* Mark songs as your favorites!
* Drag and drop re-ordering for playlists
* Equalizer
* Replaygain tag support
* Transcode to various mp3 quality levels

### Known Issues / Todo
* Adopt React-beautiful-dnd virtual lists once it is ready. Without virtual lists, we get to about 1000 songs in a 
  list before it becomes really slow on a beefy pc.
* Can we monitor the music library for changes and automatically react based on the changes?
* Fix context menu when search.jsx is showing one item. (it cuts off)

### Getting Started

#### Prerequisites
* Windows (linux is untested)
* Music collection:
  * Cleanly tagged with artist, album, albumartist, title, musicBrainzTrackId, replaygain
  * Album art embedded in the files or in the same folder and named folder.jpg
* Postgresql (optional - embedded H2 can be used instead)

#### Building
1. Clone project
2. Build with Gradle

### Deployment (WIP)
1. Configure application.properties for DB connection info, etc...
2. Build fat jar file with Gradle
3. Place jar file where you want to run Loon
4. Run 'java -jar nameofjar.jar'
5. Log in as admin@test.com, pw: password.
6. Once logged in, go to Admin -> Manage System to specify where music is stored.

### Built With (partial listing)
* [Spring Boot](https://spring.io/projects/spring-boot) - Backend Framework
* [React](https://reactjs.org/) - Frontend Framework
* [Bulma](https://bulma.io/) - CSS Framework
