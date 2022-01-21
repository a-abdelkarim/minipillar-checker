const BASE_URL = 'http://127.0.0.1:8000/';


//var geojson;
var map = L.map('hammad_map').setView([25, 41], 5);
var street_basemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYS1hYmRlbGthcmltIiwiYSI6ImNrandqbG5vMjA4YzYyb3AzcXU0d29sY3AifQ.uN6cJHcyyAZ82nA7rJ-fFg'
})

var sattelite_basemap = L.tileLayer('https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=2phIJ9MWTxoHn7BzLCQG', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYS1hYmRlbGthcmltIiwiYSI6ImNrandqbG5vMjA4YzYyb3AzcXU0d29sY3AifQ.uN6cJHcyyAZ82nA7rJ-fFg'
});

var baseMaps = {
    "Streets": street_basemap,
    "Satellite": sattelite_basemap
};

L.control.layers(baseMaps).addTo(map);

function load_data(){
    var features = JSON.parse(featureCollection);
    var geojson = new L.geoJSON(features);
    geojson.addTo(map)
};

load_data();
