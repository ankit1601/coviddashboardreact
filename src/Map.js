import React from 'react';
import './Map.css';
import {Map as LeafletMap, TileLayer }  from 'react-leaflet';
import { showDataOnMap } from './utils';

function Map({center, zoom, countries, casesType}) {
    return (
        <div className="map">
            {/* <h1>i am the map</h1> */}
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                    {/* Loop Through and Draw circles */}
                    {showDataOnMap(countries,casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
