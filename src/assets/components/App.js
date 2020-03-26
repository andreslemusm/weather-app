import React from 'react';
import '../styles/App.css';

const API_KEY = '8c23032f9b714c0585a2f4716b16faa8';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      location: '',
      data: {}
    };
    this.fetchData = this.fetchData.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
  }

  fetchData(evt) {
    evt.preventDefault();

    if (!API_KEY) {
      console.log('Enter your API_KEY and the enter location');
      return;
    }

    let location = encodeURIComponent(this.state.location);
    let urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    let urlSuffix = '&APPID=' + API_KEY + '&units=metric';
    let url = urlPrefix + location + urlSuffix;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({ data: data });
      });
  }

  changeLocation(evt) {
    this.setState({
      location: evt.target.value
    });
  }

  render() {
    let currentTemp = '20';
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>
            I want to know the weather for
            <input
              placeholder={'City, Country'}
              type="text"
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        <p className="temp-wrapper">
          <span className="temp">{currentTemp}</span>
          <span className="temp-symbol">°C</span>
        </p>
      </div>
    );
  }
}
