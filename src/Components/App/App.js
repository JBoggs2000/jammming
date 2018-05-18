import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {
          id: "track2",
          name: "Defaulted Search",
          artist: "The Algorithms",
          album: "Searching for a Use Case"
        }
      ],
      playlistName: "Stringing together a List",
      playlistTracks: [
        {
          id: "track1",
          name: "Race Conditions",
          artist: "Null Terminator",
          album: "Incremental Additives"
        }
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let temporaryPlaylist = this.state.playlistTracks;
    temporaryPlaylist.push(track);
    this.setState({playlistTracks: temporaryPlaylist});
  }
  removeTrack(track) {
    let playlistIndex = this.state.playlistTracks.findIndex(savedTrack => savedTrack.id === track.id);
    if (playlistIndex !== -1) {
      let temporaryPlaylist = this.state.playlistTracks;
      temporaryPlaylist.splice(playlistIndex, 1);
      this.setState({playlistTracks: temporaryPlaylist});
    }
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.map(track => {
      trackURIs.push(track.id);
      console.log(trackURIs);
    });
  }
  search(term) {
    console.log(term);
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
