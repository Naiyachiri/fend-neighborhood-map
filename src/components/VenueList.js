import React from 'react';
import PropTypes from 'prop-types';

/* global google */

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
    
    return( 
      <div id="venue-list">
        {locations.map((location, index) => (
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