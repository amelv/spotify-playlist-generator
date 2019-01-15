import React from 'react';

const Form = props => (
  <form onSubmit={props.getRec}>
    <input type="text" name="song" placeholder="Enter Spotify URI code..."/>
    <button>Get New Playlist</button>
  </form>
);

export default Form;
