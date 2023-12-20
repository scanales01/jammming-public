const clientID = '';
const redirectURI = 'https://jammming-ten.vercel.app';
const scope = 'playlist-modify-public'

const apiURL = 'https://api.spotify.com/v1';

// let state = generateRandomString(16);

let authorizeURL = 'https://accounts.spotify.com/authorize';
authorizeURL += '?response_type=token';
authorizeURL += '&client_id=' + encodeURIComponent(clientID);
authorizeURL += '&scope=' + encodeURIComponent(scope);
authorizeURL += '&redirect_uri=' + encodeURIComponent(redirectURI);
// authorizeURL += '&state=' + encodeURIComponent(state);

let accessToken

const Spotify = {
    getHashParams() {
        const hashParams = {};
        const r = /([^&;=]+)=?([^&*]*)/g;
        const q = window.location.hash.substring(1);
        let e = r.exec(q);
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    },

    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const params = this.getHashParams();
        if (params.access_token && params.expires_in) {
            accessToken = params.access_token;
            const expiresIn = Number(params.expires_in);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/')
            return accessToken;
        } else {
            window.location = authorizeURL;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`${apiURL}/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        let userID;

        return fetch(`${apiURL}/me`, { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`${apiURL}/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`${apiURL}/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({
                        uris: trackURIs
                    })
                });
            });
        });
    }
}

export default Spotify;