import React from "react";
import { Map, TileLayer, LayersControl, ZoomControl } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Markers from "./Markers"
import Bar from "./Bar"
import Control from 'react-leaflet-control';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import Fab from '@material-ui/core/Fab';
import RangeDialog from "./RangeDialog"
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { tagTypeMapper, overpassQuery, getAllTypes } from './Mapping.js'

class App extends React.Component {
  leafletMap = null;

  constructor() {
    super();
    this.state = {
      defaultZoom: 13,
      defaultCenter: [0, 9],
      osmRequest: null,
      defaultRange: 1500,
      osmData: [],
      osmDataCounted: {},
      loading: false
    };
    this.loadOSMData = this.loadOSMData.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleOSMResponse = this.handleOSMResponse.bind(this);
  }

  setLeafletMapRef = (map) => (this.leafletMap = map && map.leafletElement);

  loadOSMData() {
    //clear old map   
    this.setState({
      loading: true,
      osmError: null
    });
    // get new data
    const queryOverpass = require("@derhuerst/query-overpass");
    var requestBody = this.state.osmRequest;
    requestBody = requestBody
      .replaceAll("<RANGE>", this.state.defaultRange)
      .replaceAll("<LAT>", this.leafletMap.getCenter().lat)
      .replaceAll("<LON>", this.leafletMap.getCenter().lng);
    console.log(
      "requesting OSM data for position",
      this.leafletMap.getCenter(),
      requestBody
    );
    queryOverpass(requestBody)
      .then((response) => {
        this.handleOSMResponse(response);
      })
      .catch((error) => {
        this.setState({
          loading: false,
          osmError: error
        });
      });
  }

  handleOSMResponse(response) {
    // enhance the osm Response
    const parsedEntries = [];
    const entryMapCount = {};
    response
      .filter((entry) => (entry.type === "node" || entry.type === "way") && entry.lat && entry.tags)
      .map((entry, idx) => {
        const tag = tagTypeMapper(entry.tags);
        parsedEntries.push({
          name: entry.tags.name,
          lat: (entry.type === "node") ? entry.lat : entry.center.lat,
          lon: (entry.type === "node") ? entry.lon : entry.center.lon,
          type: tag,
          address: {
            city: entry.tags["addr:city"],
            housenumber: entry.tags["addr:housenumber"],
            postcode: entry.tags["addr:postcode"],
            street: entry.tags["addr:street"]
          },
          openingHours: entry.tags["opening_hours"],
          website: entry.tags.website,
          phone: entry.tags.phone
        })
        if (entryMapCount.hasOwnProperty(tag)) {
          entryMapCount[tag] = entryMapCount[tag] + 1;
        } else {
          entryMapCount[tag] = 1;
        }
      });
    this.setState({
      osmData: parsedEntries,
      osmDataCounted: entryMapCount,
      loading: false,
      osmError: null,
      defaultCenter: [this.leafletMap.getCenter().lat, this.leafletMap.getCenter().lng]
    });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        defaultCenter: [position.coords.latitude, position.coords.longitude]
      });
    });
    /*fetch(process.env.PUBLIC_URL + "/data/overpassQL.txt", { mode: 'no-cors' }).then((res) =>
      res.text().then((text) => {
        console.log("request for osm", text);
        this.setState({ osmRequest: text });
      })
    );*/
    this.setState({
      osmRequest: overpassQuery(getAllTypes())
    });
    const searchControl = new SearchControl({
      provider: new OpenStreetMapProvider(),
      showMarker: false,
      autoClose: true
    });
    this.leafletMap.addControl(searchControl);
  }

  handleRangeChange(event, value) {
    this.setState({
      defaultRange: value
    });
  }

  handleMove(e) {
    this.setState({
      mapCenter: [e.target.getCenter().lat, e.target.getCenter().lng]
    });
  }

  render() {
    return (
      <div className="App">
        <Map
          ref={this.setLeafletMapRef}
          center={this.state.defaultCenter}
          zoom={this.state.defaultZoom}
          zoomControl={false}
          onMove={this.handleMove}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="CartoDB.VoyagerLabelsUnder">
              <TileLayer
                url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> | Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked name="CartoDB.Positron">
              <TileLayer
                url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> | Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
                subdomains='abcd'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap.BZH">
              <TileLayer
                url="https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a> | Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap.Mapnik">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Stamen.Toner">
              <TileLayer
                url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}"
                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
                subdomains='abcd'
                ext='png'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Stadia.AlidadeSmooth">
              <TileLayer
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Stadia.AlidadeSmoothDark">
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <ZoomControl position="topright" />
          <Markers osmData={this.state.osmData} searchCenter={this.state.defaultCenter} mapCenter={this.state.mapCenter ? this.state.mapCenter : this.state.defaultCenter} radius={this.state.defaultRange} />
          <Control position="topleft" >
            <div class="leaflet-bar">
              <a size="small" role="button" onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  this.leafletMap.setView([position.coords.latitude, position.coords.longitude]);
                });
              }}>
                <GpsNotFixedIcon size='small' style={{ paddingTop: "3px", paddingLeft: "2px" }} />
              </a></div>
          </Control>
          <Control position="topleft" >
            <div class="leaflet-bar">
              <RangeDialog defaultRange={this.state.defaultRange} handleRangeChange={this.handleRangeChange} loadOSMData={this.loadOSMData} />
            </div>
          </Control>
          <Control position="bottomleft" >
            <Bar osmDataCounted={this.state.osmDataCounted} osmData={this.state.osmData} loading={this.state.loading} osmError={this.state.osmError} range={this.state.defaultRange} />
          </Control>
        </Map>
      </div>
    );
  }
}

export default App;
