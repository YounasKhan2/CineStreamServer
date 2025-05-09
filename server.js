import express from 'express';
import WebTorrent from 'webtorrent';
import cors from 'cors';

const app = express();
const client = new WebTorrent();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the CineStream Backend! Use /stream?torrentUrl=<TORRENT_URL> to stream a video.');
});

app.get('/stream', (req, res) => {
    const torrentUrl = req.query.torrentUrl;

    if (!torrentUrl) {
        console.error('No torrent URL provided');
        return res.status(400).send('Torrent URL is required');
    }

    try {
        console.log(`Adding torrent: ${torrentUrl}`);
        client.add(torrentUrl, torrent => {
            console.log(`Torrent added: ${torrent.infoHash}`);
            const file = torrent.files.find(file => file.name.endsWith('.mp4'));

            if (!file) {
                console.error('No .mp4 file found in the torrent');
                torrent.destroy();
                return res.status(404).send('No streamable file found in the torrent');
            }

            console.log(`Streaming file: ${file.name}`);
            res.setHeader('Content-Type', 'video/mp4');
            const stream = file.createReadStream();
            let responseSent = false;

            stream.pipe(res);

            stream.on('error', err => {
                if (!responseSent) {
                    responseSent = true;
                    console.error('Stream error:', err);
                    res.status(500).send('Error streaming the file');
                }
            });

            res.on('close', () => {
                console.log('Response closed, destroying torrent');
                torrent.destroy();
            });
        });
    } catch (error) {
        console.error('Error adding torrent:', error);
        if (!res.headersSent) {
            res.status(500).send('Failed to process the torrent');
        }
    }
});