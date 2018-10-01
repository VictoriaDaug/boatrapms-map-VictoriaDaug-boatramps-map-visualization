import * as React from "react";
import ReactMapGL, { NavigationControl } from "react-map-gl";
// TODO hook redux and server
import * as BoatRampsGeoJson from "../data/boat_ramps.json";
import RampsByMaterial from "./RampsByMaterial";
import RampsPerSizeCategory from "./RampsPerSizeCategory";

let MAPBOX_TOKEN: string
if (process.env.REACT_APP_MAPBOX_TOKEN) {
    MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
} else {
    throw new Error("Mapbox API Key missing");
}

const initialState = {
    boatRamps: BoatRampsGeoJson,
    viewport: {
        height: 400,
        latitude: -28.0167,
        longitude: 153.4000,
        width: 400,
        zoom: 10,
    },
};

type State = typeof initialState;
type Viewport = typeof initialState.viewport;

export default class Map extends React.Component<{}, State> {
    public mapRef: any = React.createRef();
    public state: State = initialState;

    public componentDidMount() {
        window.addEventListener("resize", this.resize);
        this.resize();
        this.addLayers();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    public updateViewport = (viewport: Viewport) => {
        this.setState(prevState => ({
            viewport: { ...prevState.viewport, ...viewport },
        }));
        this.boatRampsVisibility();
    }

    public resize = () => {
        this.setState(prevState => ({
            viewport: {
                ...prevState.viewport,
                height: window.innerHeight,
                width: window.innerWidth,
            },
        }));
    }

    public boatRampsVisibility() {
        const map: any = this.mapRef.getMap();
        const { _ne, _sw } = map.getBounds();
        const features = BoatRampsGeoJson.features;

        const featuresWithinCurrentViewport = features.filter(({ geometry }) => {
            // we only care about the first item becuase it's the outer polygon of the mutipolygon
           const coordinatesArray = geometry.coordinates[0][0];
           return this.isAnyCoordinatesWithinBounds(_ne.lat, _sw.lat, _ne.lng, _sw.lng, coordinatesArray)
        })

        this.boatRampsWithinViewPort(featuresWithinCurrentViewport);
    }

    public boatRampsWithinViewPort(featuresWithinCurrentViewport: any) {
        this.setState({
            boatRamps: { ...this.state.boatRamps, features: featuresWithinCurrentViewport }
        });
    }

    public addLayers() {
        const map: any = this.mapRef.getMap();
        map.on("load", () => {

            map.addLayer({
                id: "maine",
                type: "fill",
                source: {
                    type: "geojson",
                    data: BoatRampsGeoJson,
                },
                layout: {},
                paint: {
                    "fill-color": "#088",
                    "fill-opacity": 0.8,
                }
            });
        });
    }

    public render() {
        const { viewport } = this.state;
        return (
            <ReactMapGL
                {...viewport}
                ref={ map => this.mapRef = map as any }
                mapboxApiAccessToken={MAPBOX_TOKEN}
                onViewportChange={(v: Viewport) => this.updateViewport(v)}
            >
                <div style={{ position: "absolute", right: 30, bottom: 30 }}>
                    <NavigationControl
                        onViewportChange={this.updateViewport}
                        onViewStateChange={() => {return; }}
                    />
                </div>
                <div style={{ position: "absolute", right: 250, top: 30 }}>
                    <RampsPerSizeCategory boatRamps={this.state.boatRamps}/>
                </div>
                <div style={{ position: "absolute", right: 30, top: 30 }}>
                    <RampsByMaterial boatRamps={this.state.boatRamps}/>
                </div>
            </ReactMapGL>
        );
    }

    // TODO: transfer to utils
    private isAnyCoordinatesWithinBounds(nLat: number,
                                         sLat: number,
                                         eLng: number,
                                         wLng: number,
                                         coordinates: number[][]) {
    // if any of the coordinates falls within the bounds return true
    return coordinates
        .some(([longhitude, latitude]) =>
            latitude < nLat
            && latitude > sLat
            && longhitude < eLng
            && longhitude > wLng
        )
    }
}
