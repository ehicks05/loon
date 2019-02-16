## Loon
Music Player

### Motivation
Be able to stream your entire music library from your browser. Use it from desktop or mobile device.
 

### Feature Summary
* Stream your music library from any browser
* Album art support
* Last.fm api support for artist artwork. Can also load album artwork if your tracks don't have it
* Make playlists
* Mark songs as your favorites!
* Drag and drop re-ordering for playlists
* Replaygain tag support (mostly)
* Transcode to various mp3 bitrates (mostly works, saves output to temp dir for now)
* Equalizer (work-in-progress)
* Spring Boot Admin support (experimental)
* Prometheus support (experimental)

### Known Issues
* Howler.js seems to support either streaming OR using web audio api filters. This will have to be resolved for
  streaming and equalization to work at the same time.
* React-beautiful-dnd doesn't yet support react-virtualized. Until then we either have drag and drop, or snappy 
  lists of songs.
* The JAVE library, used for transcoding, isn't being utilized. It seems to require outputting to a file. This
  implies we have to wait for a song to finish transcoding, which could take a while, which makes the client wait.
  If this could generate a stream maybe we could avoid the wait?

### Getting Started

#### Prerequisites
* Windows (linux is a work-in-progress)
* Postgresql
* Gradle

#### Installing
1. Clone project
2. Build with Gradle

### Deployment (WIP)
1. Build fat jar file with Gradle
2. Place jar file where you want to run Loon
3. configure application.properties for DB connection info, etc...
4. Log in as admin@test.com, pw: password.
5. Once logged in, go to Admin -> Manage System to identify where music is stored.

### Built With (partial listing)
* [Spring Boot](https://spring.io/projects/spring-boot) - Backend Framework
* [React](https://reactjs.org/) - Frontend Framework
* [Bulma](https://bulma.io/) - CSS Framework
