import React from 'react';
import PropTypes from 'prop-types';

class VenueList extends React.Component {
  static propTypes = {
    locations: PropTypes.array.isRequired // must have passed the venue array
  }

  render() {
    const { locations } = this.props;
    return( 
      <div id="venue-list">
        {locations.map((location, index) => (
        <button className="venue-container" id={location.id} key={index}>
          <h3 className="venue-name">{location.name}</h3>
          <p className="venue-distance">Distance: {location.location.distance/1000} km</p>
          <p className="venue-address">{location.location.formattedAddress.join(", ")}</p>
          <hr></hr>
        </button>
    ))}
      </div>
    )
  }
}

export default VenueList