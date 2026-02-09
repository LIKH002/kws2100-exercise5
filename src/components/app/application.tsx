import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import { useGeographic } from "ol/proj.js";
import { WMTS } from "ol/source.js";
import { optionsFromCapabilities } from "ol/source/WMTS.js";
import { WMTSCapabilities } from "ol/format.js";
// @ts-ignore
import "ol/ol.css";

useGeographic();

const parser = new WMTSCapabilities();
const kartverketLayer = new TileLayer();

fetch("https://cache.kartverket.no/v1/wmts/1.0.0/WMTSCapabilities.xml").then(
  async (response) => {
    const result = parser.read(await response.text());
    const options = optionsFromCapabilities(result, {
      layer: "toporaster",
      matrixSet: "webmercator",
    });
    kartverketLayer.setSource(new WMTS(options!));
  },
);

const map = new Map({
  view: new View({
    center: [10.75, 59.91],
    zoom: 10,
  }),
  layers: [kartverketLayer],
});

export function Application() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      map.setTarget(mapRef.current);
    }
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}
