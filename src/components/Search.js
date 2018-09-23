import React from 'react';

class Search extends React.Component {
  state = {
    query: this.props.query,
    results: [],
  }

  handleInputChange = () => {
    this.props.updateQuery(this.search.value);    
  }

  handleQuerySubmit = (event) => {
    event.preventDefault(); // prevent page from refreshing
    // filter results
  }


  render() {
    return (
      <form id="filter-form" onSubmit={this.handleQuerySubmit}>
        <input
          placeholder="filter by Name"
          ref={input => this.search = input}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
      </form>
    )
  }
}

export default Search