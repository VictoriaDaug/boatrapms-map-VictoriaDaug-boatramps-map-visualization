export interface IGeoJsonFeature  {
    type: string;
    id: string;
    geometry: object ;
    geometry_name: string;
    properties: {
        material: string;
        area_: number;
        // TODO: add the rest of properties geoJson
    }
}

export interface IBoatRampsGeoJson {
    boatRamps: {
        features: IGeoJsonFeature[]
    };
}
