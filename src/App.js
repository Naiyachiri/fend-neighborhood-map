import React, { Component } from 'react';

import './App.css';

import VenueList from './components/VenueList';

// https://developers.google.com/maps/documentation/javascript/tutorial converted to react below
class App extends Component {

  state = {
    venues: [], // contain our fetched venues
  }

  componentDidMount() {
    this.getVenues(); // fetch foursquare data, note it is asynchronous
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDyiFC-chvpMddIZBmKhH1t2Bvf--OYkes&callback=initMap");
    window.initMap = this.initMap; // set the global variable initMap to our initMap method (for callback access)
  }

  /// FOURSQUARE API RELATED FUNCTIONS/// FOURSQUARE API RELATED FUNCTIONS/// FOURSQUARE API 
  getVenues = () => {
    const endPoint = 'https://api.foursquare.com/v2'; //the api url
    const parameters = {
      client_id: "NRGQG3Z25DSMLYUKPTODJY1ZOQTI0NVONSZICDVVOLXTQ1MK",
      client_secret: "J35TCWD20UY10TYUR0RS2V5XQ0MJLFPBT02TJRK33425RVPP",
      query: "coffee", //can be changed depending on if we add a query component to our app
      ll: "38.7916449,-77.119759", // just a locale near myself, but also can be customized
      intent: "browse",
      radius: 10000, // in meters
      limit: 10, // set to 10, but can be changed as necessary
      v: "20180323" // this is the version given under 'getting started' of docs
    }
    //`${endPoint}client_id=${parameters.client_id}&client_secret=${parameters.client_secret}&query=${parameters.query}&ll=${parameters.ll.lng},${parameters.ll.lat}&v=${parameters.v}`
    fetch(`${endPoint}/venues/search?ll=${parameters.ll}&intent=${parameters.intent}&radius=${parameters.radius}&limit=${parameters.limit}&query=${parameters.query}&client_id=${parameters.client_id}&client_secret=${parameters.client_secret}&v=${parameters.v}`)
    .then(res => res.json())
    .then(data => {
      //NOTE: SetState can take in a 2nd parameter, which is a callback that is run after the state has been set
      this.setState({
        venues: data.response.venues // pull data and store it in the app state
      },this.loadMap()) // note loadmap must wait until venues are loaded so that the markers can be made
    })
    .catch(error => {
      console.log("Error: "+ error);
    })
  }
/// FOURSQUARE API RELATED FUNCTIONS /// FOURSQUARE API RELATED FUNCTIONS/// FOURSQUARE API 

  initMap = () => {
    // note that window.google is used here because it is necessary to generate it from the global environment
    //initialize our map object
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.7916449, lng: -77.119759},
      zoom: 10
    });
      
    //generate a single infoWindow
    let infowindow = new window.google.maps.InfoWindow({
    });

    //this function below generates our markers and infoWindows based off of the loaded venues' data
    this.state.venues.map((targetVenue => {
      //dynamically change the contentString based on venue
      let contentString= `<h5>${targetVenue.name}</h5>
      <p>${targetVenue.location.formattedAddress.join(', ')}</p>
      `;
      
      //generate dynamic markers
      let marker = new window.google.maps.Marker({
        position: {lat: targetVenue.location.lat, lng: targetVenue.location.lng},
        map: map,
        title: targetVenue.name
      });
      //add a listener to our marker
      marker.addListener('click', function() {
        //update infowindow contents to clicked marker
        infowindow.setContent(contentString)
        //opens an infoWindow on the clicked marker  
        infowindow.open(map, marker);
      });
    }))
  }

  render() {
    return (
      <main>
        <VenueList locations={this.state.venues} />
        <div id="map"></div>
      </main>
    );
  }
}


/*
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"async defer></script>
 */

function loadScript(url) {
  let index = window.document.getElementsByTagName('script')[0]; // target the first script tag
  let script = window.document.createElement('script'); // generate our script tag
  script.src = url; // set the url
  script.async = true;// give our script tag the async attr
  script.defer = true; // give our script tag the defer attr
  index.parentNode.insertBefore(script, index);
  // insert our script in front of all the scripts
}

export default App;
