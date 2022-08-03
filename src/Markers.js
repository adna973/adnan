import React from "react";
import { Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from 'react-dom/server';
import { typeIconMapper } from './Mapping.js'

class Markers extends React.Component {

    constructor(props) {
        super(props);
        this.getIconForType = this.getIconForType.bind(this);
    }

    getIconForType(type) {
        return L.divIcon({//TODO: set iconAnchor
            className: 'custom-icon',
            html: ReactDOMServer.renderToString(typeIconMapper(type))
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.props.osmData
                    .map((entry, idx) => (
                        <Marker key={`marker-${idx}`} position={[entry.lat, entry.lon]} icon={this.getIconForType(entry.type)}>
                            <Popup>
                                <span>{entry.type}</span>:
                                <span>{entry.name}</span>
                            </Popup>
                        </Marker>
                    ))}
                <Circle
                    center={{ lat: this.props.searchCenter[0], lng: this.props.searchCenter[1] }}
                    fillColor="blue"
                    radius={this.props.radius} />
                <Marker key={`marker-searchCenter`} position={[this.props.searchCenter[0], this.props.searchCenter[1]]} icon={this.getIconForType("position")} />
                <Marker key={`marker-mapCenter`} position={[this.props.mapCenter[0], this.props.mapCenter[1]]} icon={this.getIconForType("center")} />
            </React.Fragment>
        );
    }
}
export default Markers;