## Loon
Music Player
<!-- ![Screenshot](https://i.imgur.com/GQD7KeL.jpg) -->

### Motivation
Stream your music library from your browser. Support desktop or mobile device.
 

### Feature Summary
* Stream your music library from any browser
* Display album art (and optionally get art via Spotify api)
* Make playlists
* Mark songs as your favorites!
* Drag and drop re-ordering for playlists
* Equalizer
* Replaygain support
* ~~Transcode to various mp3 quality levels~~
* ~~Watch your music folder for changes and automatically sync~~
* Keyboard shortcuts for playback controls.
  * space = play/pause, left arrow = previous track, right arrow = next track

### Known Issues / Todo
* scan embedded album art


### Getting Started

#### Prerequisites
* Node
* Postgres
* Music collection:
  * In the format you want to stream (mp3)
  * Cleanly tagged with artist, album, albumartist, title, musicBrainzTrackId, replaygain. Maybe use MusicBrainz Picard to help.
  * Album art embedded in the files or in the same folder and named folder.jpg

### Running it Locally (WIP)
1. Clone project
2. Configure `./loon-be/.env` and `./loon-be/.env`
3. Fire up backend: `cd loon-be && npm i && npm run dev`
4. Fire up frontend: `cd loon-fe && npm i && npm run dev`
5. Create account via GitHub OAuth
6. Go in to db and manually set your user in users table to `isAdmin=true`
7. Go to system settings and set up the music folder and scan

### Built With (WIP)
* [React](https://reactjs.org/) - Frontend
* [Tailwind](https://https://tailwindcss.com) - Styling
