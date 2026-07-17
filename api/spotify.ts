const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token || '',
        }),
    });
    return response.json();
};

export default async function handler(req: any, res: any) {
    try {
        const { access_token } = await getAccessToken();

        // 1. Check currently playing
        const response = await fetch(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (response.status === 204 || response.status > 400) {
            // 2. If nothing is playing, get recently played
            const recentResponse = await fetch(RECENTLY_PLAYED_ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            
            if (recentResponse.status === 204 || recentResponse.status > 400) {
                return res.status(200).json({ isPlaying: false });
            }
            
            const recentData = await recentResponse.json();
            const track = recentData.items[0]?.track;
            
            if (!track) {
                return res.status(200).json({ isPlaying: false });
            }
            
            return res.status(200).json({
                isPlaying: false,
                title: track.name,
                artist: track.artists.map((_artist: any) => _artist.name).join(', '),
                albumImageUrl: track.album.images[0].url,
                songUrl: track.external_urls.spotify,
            });
        }

        const song = await response.json();

        if (song.item === null) {
            return res.status(200).json({ isPlaying: false });
        }

        const isPlaying = song.is_playing;
        const title = song.item.name;
        const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
        const albumImageUrl = song.item.album.images[0].url;
        const songUrl = song.item.external_urls.spotify;

        return res.status(200).json({
            albumImageUrl,
            artist,
            isPlaying,
            songUrl,
            title,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch' });
    }
}
