const BASE_URL = 'http://127.0.0.1:8000/';
var map;



//var geojson;
function load_map(){
    map = L.map('map').setView([25, 41], 5);
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
}

// loading map data ...
function load_map_data(){
    var features = JSON.parse(featureCollection);
    
    for(var feature in features["features"]){
        feature = features["features"][feature];
        var checked = feature.properties.checked;
        var mp_id = feature.properties.id;
        var icon = icon_create(checked);
        var geojson = new L.geoJSON(feature, {
            pointToLayer: function(feature,latlng){
                return L.marker(latlng,{icon: icon});
            },
            onEachFeature: function (feature, layer) {
                if (checked){
                    layer.bindPopup('<h1>'+feature.properties.code+'</h1><p>checked by: '+feature.properties.checked_by+'</p>' + `<div class="col text-right"><a target="_blank" href="minipillar/${mp_id}/" class="btn btn-sm btn-primary">View</a></div>`);
                } else{
                    layer.bindPopup('<h3>Unchecked</h3>');
                }
                
              }
          });
        geojson.addTo(map);
        console.log("feature added");
    };

    
    
};

load_map();
load_map_data();
