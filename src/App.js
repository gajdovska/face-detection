import React, { Component } from "react";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import environment from './environment';

const initialState={
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component { 
constructor(){
  super();
  this.state=initialState;
   
}
loadUser=(data)=>{
  this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
}

onInputChange=(event)=>{
  this.setState({input:event.target.value});
}
calculateFaceLocation=(data)=>{
   console.log(data);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return data.outputs[0].data.regions.map(region => {
      const clarifaiFace  = region.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    });
}
displayFaceBox=(boxes)=>{
  console.log(boxes);
  this.setState({boxes:boxes});
}
onRouteChange=(route)=>{
  if(route==='signout'){
    this.setState(initialState)
  }else if(route==='home'){
    this.setState({isSignedIn:'true'})
  }
  this.setState({route:route});
}
  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch(`${environment.apiURL}/imageurl`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    }).then(response=>response.json())
      .then(response => {
        if (response) {
          fetch(`${environment.apiURL}/image`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  render(){
  const { isSignedIn, imageUrl, route, boxes } = this.state;
  return (
    <div className="App">
      <Particles className='particles'
        params={{
          particles: {
            line_linked: {
              shadow: {
                enable: true,
                color: "#3CA9D1",
                blur: 5
              }
              }
            }
          }
        }
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      {route === 'home'
        ? <div>
          <Logo />
          <Rank
            name={this.state.user.name}
            entries={this.state.user.entries}
          />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onSubmit={this.onSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
        : (
          route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
      }
    </div>
  );
}
}

export default App;
