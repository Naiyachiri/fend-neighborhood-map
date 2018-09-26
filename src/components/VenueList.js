import React from 'react';
import PropTypes from 'prop-types';

import Search from './Search';

let previousButton; // initialize variable to track the button 

class VenueList extends React.Component {
  static propTypes = {
    locations: PropTypes.array.isRequired, // must have passed the venue array
    openInfoWindow: PropTypes.func.isRequired
  }

  // note the prop this.prop.handleVenueClick needs to be passed in in order to trigger the infoWindow to be opened
    

  handleVenueClick = (event) => {
    this.props.openInfoWindow(this.props.venueMarkers[event.target.id]);
    this.props.changeMarkerIndex(event.target.id); // updates state to reflect selected venue item index
      //simple onclick based css modifications in response to onClick events
      if (previousButton !== undefined) { // if the previousButton exists
        previousButton.classList.remove('active'); // toggle the active class on the previous button
      }
      //note since the ids are also used to as an index value they must be escaped  to be used as css id selectors with '\3', note \ must be escaped as well
      // after further research the CSS.escape(string) method can be used instead
      previousButton = document.querySelector('#'+CSS.escape(event.target.id)); // set previous button to current button
      previousButton.classList.add('active'); // toggle the active class on the button
  }

  render() {
    const { locations } = this.props;
    
    // function that takes prop.locations and filters it according to our filter array
    let filterResults = locations.filter((FilteredVenue) => {
      let name = FilteredVenue.name.toLowerCase(); // convert it to lowercase so we can use regex to match against venue names
      let regex = new RegExp(this.props.query);
      //construct a regular expression based on query and compare it against the name
      if (name.match(regex)) {
        return true;
      } else {
        return false;
      }
    })
    

    return( 
      <div className="venue-list">
        <Search 
          locations={filterResults}
          updateQuery={this.props.updateQuery}
          query={this.props.query}
        />
          {filterResults.map((location, index) => (
            <button className="venue-container" id={index} key={location.id} onClick={this.handleVenueClick}>
              {location.name} <br></br>
              Distance: {location.location.distance/1000} km <br></br>
              {location.location.formattedAddress.join(", ")} <br></br>
            </button>
          ))}
      </div>
    )
  }
}

export default VenueList