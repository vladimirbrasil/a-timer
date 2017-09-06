// Import chai.
let chai = require('chai'),
path = require('path');

// Tell chai that we'll be using the "should" style assertions.
chai.should();

// Import the Rectangle class.
let Rectangle = require(path.join(__dirname, '..', 'rectangle'));