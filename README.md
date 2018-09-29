# FEND Neighborhood Map Project 8

## Setting up the application

1. download and navigate to repository directory
2. run `npm install`
3. run `npm start`
4. navigate to http://localhost:3000/
5. If map fails to load check console in case apiKey is no longer valid and replace apiKey under app.js's ComponentWillMount() lifecycle method

### References

[Google Maps JS API](https://developers.google.com/maps/documentation/javascript/tutorial) : Used to generate the map, markers, and infowindows

[FourSquare API](https://foursquare.com/developers/apps) : Used to load the venue array

### TODO

add animations for selected map markers
give info window contents more style
break down application into smaller components