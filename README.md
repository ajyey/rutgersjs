
![Logo](https://i2.wp.com/stonybrookhockey.com/wp-content/uploads/2016/08/rutgerslogo.png?fit=128%2C128&ssl=1)
# rutgersjs
A Rutgers API wrapper based in node.js. In its current form, rutgersjs supports retrieving common
information about bus routes, stops, predictions and locations. Further releases will include methods
to interact with other facets of the Rutgers API such as Schedule of Classes and Events.

## Getting Started

### Prerequisites 
You should have Node.js installed on your system. The current version of rutgersjs was built using 
version 10.10.0 of Node.js

#### Installation
##### Mac
The easiest way to install Node for Mac would be to use [Homebrew](https://brew.sh/). From here the installation
process is as easy as running the following command in your terminal
````bash
brew install node
````

Otherwise, Node can be installed using the [installer](https://nodejs.org/en/).

##### Windows
For Windows, using the normal installer is most likely the easiest way to install Node and it 
can be found [here](https://nodejs.org/en/download/current/).
##### Debian and Ubuntu based Linux Distributions

A comprehensive guide can be found [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).

### Usage

To install rutgersjs for use in your Node project, navigate to your project's directory and install with npm
````bash
npm install --save rutgersjs
````

Using the module in your project is straightforward. Here's a simple example:
````javascript
const rutgersjs = require('rutgersjs')

rutgersjs.getRouteList().then(function(list){
	console.log(list)
}).catch(err => console.log(err))
````

## Documentation and Examples
Complete documentation and examples can be found on the projects [wiki](https://github.com/andrewleonard1693/rutgersjs/wiki).

## License
MIT

## Authors
- Andrew Leonard