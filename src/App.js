import React, { Component } from 'react';

import './App.css';
import './responsive.css'

import VenueList from './components/VenueList';

const switchIcon = require('./icons/switch-screen-icon.svg');

// https://developers.google.com/maps/documentation/javascript/tutorial converted to react below
class App extends Component {

  state = {
    map: {}, // once this is set to the global google map it can be passed to children who need access to the google map for methods/ references
    infoWindow: {}, // reference to the infowindow for outside access
    venues: [], // contain our current fetched venues
    markerArray: [], // container for markers
    currentMarkerIndex: -1, // state management to determine which marker is selected from list
    previouslySelectedMarker: {}, // initialize the state to track markers
    filteredMarkerRefs: [], // stores the filtered marker references
    query: "",
  }

  previouslySelectedMarker = undefined; // initialze marker tracking for the animation (could be converted to a state if it needs to be passed, but not necessary)

  componentDidMount() {
    this.getVenues(); // fetch foursquare data, note it is asynchronous
  }

  //method which will add css classes that act like hamburger menus
  toggleMapMenu = () => {
    let venueList = document.querySelector('.venue-list');
    let mapContainer = document.querySelector('.map-container');
    let menuIcon = document.querySelector('.menu');
    venueList.classList.toggle('close-filter');
    mapContainer.classList.toggle('open-map');
    menuIcon.classList.toggle('map-open-menu');
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDyiFC-chvpMddIZBmKhH1t2Bvf--OYkes&callback=initMap");
    window.initMap = this.initMap; // set the global variable initMap to our initMap method (for callback access)
  }

  /// FOURSQUARE API RELATED FUNCTIONS/// FOURSQUARE API RELATED FUNCTIONS/// FOURSQUARE API 
  updateQuery = (query) => {
    this.setState({
      query: query
    },(this.filterMarkers)
    )
  }

  filterVenueArray = (query) => { // filters the list of items on the left hand of app
    let filterResults = this.state.venues.filter((FilteredVenue) => {
      let name = FilteredVenue.name.toLowerCase(); // convert it to lowercase so we can use regex to match against venue names
      let regex = new RegExp(query);
      //construct a regular expression based on query and compare it against the name
      if (name.match(regex)) {
        return true;
      } else {
        return false;
      }
    })
    this.setState({
      filteredVenues : this.state.venues,
      venues: filterResults
    },(()=> console.log(filterResults)))
  }

  getVenues = () => {
    const endPoint = 'https://api.foursquare.com/v2'; //the api url
    const parameters = {
      client_id: "NRGQG3Z25DSMLYUKPTODJY1ZOQTI0NVONSZICDVVOLXTQ1MK",
      client_secret: "J35TCWD20UY10TYUR0RS2V5XQ0MJLFPBT02TJRK33425RVPP",
      query: "coffee", //can be changed depending on if we add a query component to our app
      ll: "38.7916449,-77.119759", // just a locale near myself, but also can be customized
      intent: "browse", //  browse, match
      radius: 10000, // in meters
      limit: 20, // limit of 50
      v: "20180323" // this is the version given under 'getting started' of docs
    }

    fetch(`${endPoint}/venues/search?ll=${parameters.ll}&intent=${parameters.intent}&radius=${parameters.radius}&limit=${parameters.limit}&query=${parameters.query}&client_id=${parameters.client_id}&client_secret=${parameters.client_secret}&v=${parameters.v}`)
    .then(res => res.json())
    .then(data => {
      //NOTE: SetState can take in a 2nd parameter, which is a callback that is run after the state has been set
      this.setState({
        venues: data.response.venues, // pull data and store it in the app state
      },this.loadMap()) // note loadmap must wait until venues are loaded so that the markers can be made
    })
    .catch(error => {
      console.log("Error: "+ error);
    })
  }

  // using similar endpoint as getVenues we will now change intent to match instead
  searchVenues = (query) => {
    const endPoint = 'https://api.foursquare.com/v2'; //the api url
    const parameters = {
      client_id: "NRGQG3Z25DSMLYUKPTODJY1ZOQTI0NVONSZICDVVOLXTQ1MK",
      client_secret: "J35TCWD20UY10TYUR0RS2V5XQ0MJLFPBT02TJRK33425RVPP",
      query: query, //can be changed depending on if we add a query component to our app
      ll: "38.7916449,-77.119759", // just a locale near myself, but also can be customized
      intent: "match", //  browse, match
      radius: 10000, // in meters
      limit: 20, // limit of 50
      v: "20180323" // this is the version given under 'getting started' of docs
    }
    
//https://api.foursquare.com/v2/venues/search?ll=38.7916449,-77.119759&intent=search&radius=10000&limit=20&client_id=NRGQG3Z25DSMLYUKPTODJY1ZOQTI0NVONSZICDVVOLXTQ1MK&client_secret=J35TCWD20UY10TYUR0RS2V5XQ0MJLFPBT02TJRK33425RVPP&v=20180323&query=food

    fetch(`${endPoint}/venues/search?ll=${parameters.ll}&intent=${parameters.intent}&radius=${parameters.radius}&limit=${parameters.limit}&query=${parameters.query}&client_id=${parameters.client_id}&client_secret=${parameters.client_secret}&v=${parameters.v}`)
    .then(res => res.json())
    .then(data => {
      //NOTE: SetState can take in a 2nd parameter, which is a callback that is run after the state has been set
      this.setState({
        queryVenueArray: data.response.venues // pull data and store it in the app state
      },this.loadMap()) // note loadmap must wait until venues are loaded so that the markers can be made
    })
    .catch(error => {
      console.log("Error: "+ error);
    })
  }


/// GOOGLE MAPS RELATED FUNCTIONS /// GOOGLE MAPS RELATED FUNCTIONS ////// GOOGLE 

  //MARKER RELATED FUNCTIONS
  //method allows us to determine which marker to use in our marker array for opening the info window
  setCurrentMarker = (index) => {
    this.setState({
      currentMarkerIndex : index
    })
  }

  //show infoWindow and populate its contents
  showInfoWindow(marker) { // takes a marker ref object
    this.setContent(marker.contentString);
    this.open(marker.map, marker);
  }

  //remove marker from map
  removeMarker = (Marker) => {
    Marker.setMap(null);
    //map is the refernce to window google maps
  }

  //add marker to map
  showMarker = (Marker) => {
    Marker.setMap(this.state.map); // note all markers reference their map through marker.map
  }

// TODO: ADD ANIMATION TO selected marker
  // toggleBounce = () => { // take marker run animation method
  //   // if previous marker does not exist, animate current marker
  //   //if previous marker does exist, deanimate, animate current
  //   //this.state.filteredMarkerRefs[this.state.currentMarkerIndex] this is the selected marker's ref
  //   // previouslySelectedMarker is the state tracking the previous filtered marker's ref
  //   // method to animate marker .setAnimation(window.google.maps.Animation.BOUNCE) // deactiv: .setAnimation(null)
  //   console.log(this);
  //   console.log(this.state.filteredMarkerRefs[this.state.currentMarkerIndex]);
  //   if (this.previouslySelectedMarker === {}) { // if there is not a previous marker// its an empty object
  //     this.state.filteredMarkerRefs[this.state.currentMarkerIndex].setAnimation(window.google.maps.Animation.BOUNCE);
  //     this.previouslySelectedMarker = this.state.filteredMarkerRefs[this.state.currentMarkerIndex]  // store marker for next call 
  //   } else {
  //     this.previouslySelectedMarker.setAnimation(null); // stop previous marker's animation
  //     this.state.filteredMarkerRefs[this.state.currentMarkerIndex].setAnimation(window.google.maps.Animation.BOUNCE); // animate current marker
  //     this.previouslySelectedMarker = this.state.filteredMarkerRefs[this.state.currentMarkerIndex] // store marker for next method call
  //   }
//  }
// method works but when put into the marker's click listener or the filter list item on click it fails

  filterMarkers = () => { // filters actual map markers to hide/show
    let filteredMarkerArray = this.state.markerArray.filter((FilteredMarker) => {
      let name = FilteredMarker.filterProperty.toLowerCase(); // convert it to lowercase so we can use regex to match against venue names
      let regex = new RegExp(this.state.query);
      //construct a regular expression based on query and compare it against the name
      if (name.match(regex)) {
        return true;
      } else {
        return false;
      }
    })

    // use the filteredMarkerArray to iterate over markers to be shown, use the markerArray to set all the markers to null
    this.state.markerArray.map((marker) => {
      this.removeMarker(marker); // removes all markers from map
      return true;
    })

    filteredMarkerArray.map((marker) => {
      this.showMarker(marker); // reveals filtered markers
      return true;
    })
    this.setState({filteredMarkerRefs:filteredMarkerArray})
    return filteredMarkerArray;
  }

  initMap = () => {
    // note that window.google is used here because it is necessary to generate it from the global environment
    //initialize our map object
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.7916449, lng: -77.119759},
      zoom: 10
    });
    this.setState({map:map}) // set reference to map in the app state
    let bounds = new window.google.maps.LatLngBounds(); 

    //generate a single infoWindow
    let infowindow = new window.google.maps.InfoWindow({
    });

    //this function below generates our markers and infoWindows based off of the loaded venues' data
    let markers = []; // initialize an array to reference all generated markers
    this.state.venues.map((targetVenue) => {
      //dynamically change the contentString based on venue
      let contentString= `<div class="info-window"><h5>${targetVenue.name}</h5>
      <p>${targetVenue.location.formattedAddress.join(', ')}</p></div>
      `;
      
      //generate dynamic markers
      let marker = new window.google.maps.Marker({
        position: {lat: targetVenue.location.lat, lng: targetVenue.location.lng},
        map: map,
        title: targetVenue.name,
        contentString: contentString,
        filterProperty: targetVenue.name // this property allows us to filter the marker references for management
      });

       //add a listener to our marker
       
      marker.addListener('click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map, marker); 
      });
      // add marker to temporary array to store in state at a later time
      markers.push(marker);
      bounds.extend(marker.getPosition());
      return true;
    })

    // update the app state to include marker references
    this.setState({
      markerArray: markers,
      infoWindow: infowindow,
      filteredMarkerRefs: markers
    })
    map.fitBounds(bounds); // fit map to markers
  }


  render() {
    // filter the array based on our query before passing it down to our child componenents
    let filteredMarkerArray = this.state.markerArray.filter((FilteredMarker) => {
      let name = FilteredMarker.filterProperty.toLowerCase(); // convert it to lowercase so we can use regex to match against venue names
      let regex = new RegExp(this.state.query);
      //construct a regular expression based on query and compare it against the name
      if (name.match(regex)) {
        return true;
      } else {
        return false;
      }
    })

    return (
      <main>
        <span className="menu" onClick={this.toggleMapMenu}> <img src={switchIcon} alt="button to swap between google map and venues menu"/> </span>
        <VenueList locations={this.state.venues} 
          venueMarkers={filteredMarkerArray}
          changeMarkerIndex={this.setCurrentMarker}
          openInfoWindow={this.showInfoWindow.bind(this.state.infoWindow)} // binding the infoWindow reference allows us to trigger the proper object methods
          toggleBounce={this.toggleBounce}
          updateQuery={this.updateQuery}
          query={this.state.query}
          />
        <div className="map-container">
          <div id="map"></div>
        </div>
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
