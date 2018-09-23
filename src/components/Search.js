import React from 'react';

let invalidKeyPressState = false;
class Search extends React.Component {
  state = {
    query: this.props.query,
    results: [],
  }

  handleInputChange = (event) => {
// need to prevent input of \ or the application crashes because it generates an invalid regular expression
    if (!invalidKeyPressState) {
      this.props.updateQuery(this.search.value);
    }    
  }

  handleKeyPress = (event) => {
    if (event.key === '\\' || event.which === 220) {
      invalidKeyPressState = true;
    } else {
      invalidKeyPressState = false;
    }
  }

  handleQuerySubmit = (event) => {
    event.preventDefault(); // prevent page from refreshing
    // filter results
  }


  render() {
    return (
      <form id="filter-form" onSubmit={this.handleQuerySubmit}>
        <input
          placeholder="Filter by Location Name"
          ref={input => this.search = input}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
      </form>
    )
  }
}

export default Search