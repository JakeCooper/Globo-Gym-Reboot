# Facility Object
The Facility object is created in the config file. 
It is used to generate almost all of the information on the calendar page

It takes a list of rooms, 

``` javascript
var rooms = [
    {
        name: String, // Name of the room 
        type: String  // type of room
        color: String // optional color
    },
    {
        name: "Example Room",
        type: "Type of room",
        color: "yellow"
    }
    ...
]

```

Using this list it generates an object 

```
var Facility = {
    type: {
        name:{
            color: String // color of calendar on client 
        }
    },
    "Type of room":{
        "Example Room": {
            color: "yellow"
        }
    }
}

```
The color will be decided using the following array, unless the color is explicitly stated in the room object from the rooms array

``` javascript

var colors = ["red", "blue", "green", "orange", "purple"]

```
