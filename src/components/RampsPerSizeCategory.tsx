import * as React from "react";
import { IBoatRampsGeoJson, IGeoJsonFeature } from "../types";

const RampsPerSizeCategory = (props: IBoatRampsGeoJson) => {
    const countedSizeCategories = sizeCategoriesCalculator(props.boatRamps.features);

    function sizeCategoriesCalculator(boatRamps: IGeoJsonFeature[]) {
        const sizeCategories = {
            small: 0,
            medium: 0,
            large: 0,
        }

        boatRamps.forEach(ramp => {
            const size = ramp.properties.area_;
            if (size <= 50) {
                sizeCategories.small += 1;
            } else if (size > 50 && size <= 200) {
                sizeCategories.medium += 1;
            } else if (size > 200 && size <= 526) {
                sizeCategories.large += 1;
            }
        });

        return sizeCategories;
    };

    const sizeCategoriesDivs = Object
        .keys(countedSizeCategories)
        .map((key: string, index: number) =>
            <div key={index}>{key}: {countedSizeCategories[key]}</div>
        );
    // TODO: Change the key from index

    return (
        <div>
            <h3>Ramps by size</h3>
            {sizeCategoriesDivs}
        </div>
    )
}

export default RampsPerSizeCategory;
