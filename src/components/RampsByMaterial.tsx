import * as React from "react";
import { IBoatRampsGeoJson, IGeoJsonFeature } from "../types";

const RampsByMaterial = (props: IBoatRampsGeoJson) => {
    const countedMaterials = materialsCalculator(props.boatRamps.features);

    function materialsCalculator(boatRamps: IGeoJsonFeature[]) {
                const materialsCount = {};
                boatRamps.forEach(ramp => {
                    const material = ramp.properties.material;
                    materialsCount[material] = (materialsCount[material] || 0) + 1;
                });
                return materialsCount;
            };

    const countedMaterialsDivs = Object.keys(countedMaterials).map((key, index: number) => {
       return <div key={index}>{key}: {countedMaterials[key]}</div>;
    });
    // TODO: Change the key from index

    return (
        <div>
            <h3>Ramps by material</h3>
            {countedMaterialsDivs}
        </div>
    )
}

export default RampsByMaterial;
