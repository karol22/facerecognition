import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin'
import Navigation from './components/Navigation/Navigation'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: '46dea97010374adb9df8f6514ef64df2'
});

const particlesOptions={
  particles: {
    number:{
      value:30,
      density:{
        enable:true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageURL: '',
      box: {},
      route: 'signin',

    }
  }
  calculateFaceLocation = (data) =>{
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width -(clarifaiFace.right_col * width),
      bottomRow: height -(clarifaiFace.bottom_row * height),
    }
  }
  displayBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models
    .predict(
      "a403429f2ddf4b49b307e318f00e528b",
      this.state.input)
      .then(response =>this.displayBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err)
    )
  }
  onRouteChange = () =>{
    this.setState({route: 'home'});
  }
  render() {
    return (
      <div className="App">
      <Particles className='particles' params={particlesOptions}/>
        <Navigation/>
        {
          this.state.route === 'signin' ?
            <Signin onRouteChange={this.onRouteChange}/>
          :
            <div>
              <Logo/>
              <Rank/>
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
            </div>
        }
      </div>
    );
  }
}

export default App;
