import React from 'react';
import PropTypes from 'prop-types';

import Search from './Search';

class VenueList extends React.Component {
  static propTypes = {
    locations: PropTypes.array.isRequired // must have passed the venue array
  }
  // note the prop this.prop.handleVenueClick needs to be passed in in order to trigger the infoWindow to be opened

  handleVenueClick = (event) => {
    this.props.openInfoWindow(this.props.venueMarkers[event.target.id])
    this.props.changeMarkerIndex(event.target.id); // updates state to reflect selected venue item index

  }

  

  render() {
    const { locations } = this.props;
    
    // function that takes prop.locations and filters it according to our filter array
      let filterResults = this.props.locations.filter((FilteredVenue) => {
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
      <div id="venue-list">
        <Search 
          locations={this.props.locations}
          updateQuery={this.props.updateQuery}
          filteredVenues={filterResults}
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