//This file is very likely broken in it's current state.
//Will be working on it
let userAccessToken = "";
let expiresTime = "";
const redirectURI = "http://localhost:3000/";
const clientID = "ff5520a985fb4726a019ecb73485d028";
const accessTokenRegex = /access_token=([^&]*)/;
const expiresRegex = /expires_in=([^&]*)/;
const Spotify = {
  getAccessToken() {
    if (userAccessToken !== "") {
      return userAccessToken;
    }
    else if (window.location.href.match(accessTokenRegex) !== null) {
      userAccessToken = window.location.href.match(accessTokenRegex)[1];
      expiresTime = window.location.href.match(expiresRegex)[1];
      window.setTimeout(() => userAccessToken = '', expiresTime * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    else {
      window.location = "https://accounts.spotify.com/authorize?client_id=" + clientID + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + redirectURI;
    }
  },
  search(term) {
    return fetch("https://api.spotify.com/v1/search?type=track&q=" + term, {
      headers: {
        Authorization: "Bearer " + userAccessToken
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }))
      }
      else {
        return [];
      }
    });
  },
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || trackURIs.length === 0 || trackURIs[0] === undefined) {
      return;
    }
    let userID;
    let playlistID;
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + userAccessToken
      }
    }).then(response => {
      return response.json();
    }).then(responseJson => {
      userID = responseJson.id;
    }).then(movingOn => {
      fetch("https://api.spotify.com/v1/users/" + userID + "/playlists", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userAccessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: playlistName
        })
      }).then(response => {
        return response.json();
      }).then(responseJson => {
        playlistID = responseJson.id;
      }).then(movingOn => {
        fetch("https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID + "/tracks", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + userAccessToken,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            uris: trackURIs
          })
        }).then(response => {
          return response.json();
        }).then(responseJson => {
          console.log(responseJson);
        });
      });
    });
  }
};
export default Spotify;
