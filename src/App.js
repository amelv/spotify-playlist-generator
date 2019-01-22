import React, { Component } from 'react';
import './App.css';
import Form from './components/Form';
import Spotify from 'spotify-web-api-js';


import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

const spotifyWebApi = new Spotify();
const SliderWithTooltip = createSliderWithTooltip(Slider);

const slider_style = { width: 300, margin: 25 };

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true: false,
      nowPlaying: {
        name: 'Not Checked',
        image: ''
      },
      inputs: {
        tracks: [],
        acousticness: 0.5,
        danceability: 0.5,
        energy: 0.5,
        liveness: 0.5,
        popularity: 50,
        valence: 0.5
      },
      recs: []
    }
    if(params.access_token){
      spotifyWebApi.setAccessToken(params.access_token)
    }
	  console.log("started");
  }
  getRec = async (e) => {
    e.preventDefault();
    const song = e.target.elements.song.value;
	  console.log("getting recs...");
    const rec_res = await spotifyWebApi.getRecommendations({ seed_tracks: [song] });
    this.setState({
      recs: rec_res.tracks
    });
    console.log(this.state.recs[0].id);

/*    const create_res = await spotifyWebApi.createPlaylist({
      "name": "New Playlist",
      "description": "New playlist description",
      "public": false
    } */
    //we could then have the user chose to keep or remove the song from the playlist
    //also the sliders for each track
  }
  
  
  onAcChange = (value) => {
    this.setState({
      inputs: {
        acousticness: value
      }
    });  
  }

  onDanceChange = (value) => {
    this.setState({
      inputs: {
        danceability: value
      }
    });  
  }

  onEnChange = (value) => {
    this.setState({
      inputs: {
        energy: value
      }
    });  
  }

  onPopChange = (value) => {
    this.setState({
      inputs: {
        popularity: value
      }
    });  
  }

  onValChange = (value) => {
    this.setState({
      inputs: {
        valence: value
      }
    });  
  }

  getPlayURL() {
    return "https://open.spotify.com/embed/track/" + this.state.recs[0].id;
  }
  
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  getNowPlaying(){
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      })
  }
  render() {
    return (
      <div className="wrapper">
        <a href = 'http://localhost:8888'>
          <button>Log in With Spotify</button>
        </a>
        <div> Now Playing: { this.state.nowPlaying.name}</div> 
        <div>
          <img src= {this.state.nowPlaying.image } style = {{ width: 50}}/>
        </div>
        <button onClick= {()=> this.getNowPlaying()}>
          Check Now Playing
        </button>
        <div style={slider_style}>
          <p>Acousticness</p>
          <Slider step={0.1} defaultValue={0.5} min={0.0} max={1.0} dots = {true}
            onChange = {this.onAcChange} />
        </div>
        <div style={slider_style}>
          <p>Danceability</p>
          <Slider step={0.1} defaultValue={0.5} min={0.0} max={1.0} dots = {true}
            onChange = {this.onDanceChange} />
        </div>
        <div style={slider_style}>
          <p>Energy</p>
          <Slider step={0.1} defaultValue={0.5} min={0.0} max={1.0} dots = {true}
            onChange = {this.onEnChange} />
        </div>
        <div style={slider_style}>
          <p>Popularity</p>
          <Slider step={0.1} defaultValue={0.5} min={0.0} max={1.0} dots = {true}
            onChange = {this.onPopChange} />
        </div>
        <div style={slider_style}>
          <p>Valence</p>
          <Slider step={0.1} defaultValue={0.5} min={0.0} max={1.0} dots = {true}
            onChange = {this.onValChange} />
        </div>
	      <Form getRec={this.getRec}/>
        <div>
          <iframe src= { this.state.recs[0] && this.getPlayURL() } width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
      </div>
    );
  }
}


export default App;
