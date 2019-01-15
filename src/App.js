import React, { Component } from 'react';
import './App.css';
import Form from './components/Form';
import Spotify from 'spotify-web-api-js';


import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

const spotifyWebApi = new Spotify();
const SliderWithTooltip = createSliderWithTooltip(Slider);

const style = { width: 600, margin: 50 };

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
    const res = await spotifyWebApi.getRecommendations({ seed_tracks: [song] });
    this.setState({
      recs: res.tracks
    });
    //we could then have the user chose to keep or remove the song from the playlist
    //also the sliders for each track
  }
  
  
  onSliderChange = (value) => {
    this.setState({
      inputs: {
        valence: value
      }
    });  
    console.log(value);
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
      <div className="App">
        <a href = 'http://localhost:8888'>
          <button>Log in With Spotify</button>
        </a>
        <div> Now Playing: { this.state.nowPlaying.name}</div> 
        <div>
          <img src= {this.state.nowPlaying.image } style = {{ width: 100}}/>
        </div>
        <button onClick= {()=> this.getNowPlaying()}>
          Check Now Playing
        </button>
        <div>
          <p>Valence</p>
          <Slider step={0.1} defaultValue={0.5} min={0.0} max={1.0}
            onChange = {this.onSliderChange} />
        </div>
	      <Form getRec={this.getRec}/>
	      <div> Recommended Song: { this.state.recs[0] && this.state.recs[0].name } </div>
	      <div> Link : { this.state.recs[0] && this.state.recs[0].external_urls.spotify } 
          </div>
      </div>
    );
  }
}


export default App;
