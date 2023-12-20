import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import LogIn from '../LogIn/LogIn';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      isLoggedIn: false
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    const params = Spotify.getHashParams();

    const accessToken = params.access_token;
    
    if (accessToken) {
      window.localStorage.removeItem('spotifyAccessToken');
      this.setState({ isLoggedIn: true });
    }
}

  renderContent() {
    let loggedIn = this.state.isLoggedIn;
    if (loggedIn) {
      return (
        <div className='App'>
          <SearchBar onSearch={this.search} />
           <div className='App-playlist'>
             <SearchResults
                searchResults={this.state.searchResults} 
                onAdd={this.addTrack}/>
             <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}/>
           </div>
        </div>
      );
    } else {
      return (
        <div className='App'>
          <LogIn 
            onLogIn={this.logIn}/>
        </div>
      );
    }
  }

  logIn() {
    Spotify.getAccessToken();
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      tracks.push(track);
      this.setState({ playlistTracks: tracks });
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let removalIndex = tracks.indexOf(track.id);
    tracks.splice(removalIndex, 1);
    this.setState({ playlistTracks: tracks });

  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        {this.renderContent()}
      </div>
    );
  }
}

export default App;