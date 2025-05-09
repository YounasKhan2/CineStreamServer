# CineStream Backend

This is the backend service for CineStream, a torrent streaming application. The backend provides a streamable URL for media files in torrents.

## Features
- Accepts a torrent URL and streams the first `.mp4` file found.
- Provides a direct media file URL for the app to play using ExoPlayer.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Access the service at `http://localhost:3000/stream?torrentUrl=<TORRENT_URL>`

## Dependencies
- [Express](https://expressjs.com/): Web framework for Node.js
- [WebTorrent](https://webtorrent.io/): Streaming torrent client for Node.js and the browser

## License
MIT
