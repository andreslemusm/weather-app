import React from 'react';
import '../styles/App.css';
import Plot from 'react-plotly.js';

// This is my key, you should use the one OpenWeather gave you.
const API_KEY = '8c23032f9b714c0585a2f4716b16faa8';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      location: '',
      data: {},
      dates: [],
      temps: [],
      selected: {
        date: '',
        temp: null
      }
    };
    this.fetchData = this.fetchData.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
    this.onPlotClick = this.onPlotClick.bind(this);
  }

  fetchData(e) {
    e.preventDefault();

    let location = encodeURIComponent(this.state.location);
    let urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    let urlSuffix = '&APPID=' + API_KEY + '&units=metric';
    let url = urlPrefix + location + urlSuffix;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const list = data.list;
        const dates = list.map((item) => {
          return item.dt_txt;
        });
        let temps = list.map((item) => {
          return item.main.temp;
        });
        this.setState({ data: data, dates: dates, temps: temps });
      });
  }

  changeLocation(e) {
    this.setState({
      location: e.target.value
    });
  }

  // The eventData is special, it is returned by the use of plotly_click from plotly.js
  onPlotClick(eventData) {
    this.setState({
      selected: {
        date: eventData.points[0].x,
        temp: eventData.points[0].y
      }
    });
  }

  render() {
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
        {/* Render the the forecast graph when the data is fetch */}
        {this.state.data.list ? (
          <div className="wrapper">
            {/* Render 'Enter a location' if no specific location is set, else render the current or selected temp*/}
            <p className="temp-wrapper">
              <span className="temp">
                {this.state.selected.temp
                  ? this.state.selected.temp
                  : this.state.data.list
                  ? this.state.data.list[0].main.temp
                  : 'Enter a location'}
              </span>
              <span className="temp-symbol">°C</span>
              <span className="temp-date">
                {this.state.selected.temp ? this.state.selected.date : ''}
              </span>
            </p>
            <h2>Forecast</h2>
            {/* Use the Plot component from react-plotly.js */}
            <Plot
              data={[
                {
                  x: this.state.dates,
                  y: this.state.temps,
                  type: 'scatter'
                }
              ]}
              layout={{
                margin: {
                  t: 0,
                  r: 0,
                  l: 30
                },
                xaxis: {
                  gridcolor: 'transparent'
                }
              }}
              config={{
                displayModeBar: false
              }}
              style={{ display: 'block' }}
              onClick={this.onPlotClick}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
