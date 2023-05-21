import { mRound } from "./mathUtils";

export interface SanitizerParams {
    readonly sanitizer: "bleach_floz" | "dichlor_floz" | "dichlor_oz";
    readonly sanitizerChlorinePercent: 5.25 | 6.0 | 7.5 | 8.25 | 10.0 | 12.5 | 55.45;
    readonly toNearest?: 0.001 | 0.01 | 0.1 | 0.125 | 0.25 | 0.5 | 1.0 | undefined;
}

interface CalcChlorineOuncesParams extends SanitizerParams {
    readonly fcIncreasePPM: number;
    readonly tubGals: number;
    readonly chlorineOunces?: never;
}

interface HaveChlorineOuncesParams extends SanitizerParams {
    readonly fcIncreasePPM?: never;
    readonly tubGals?: never;
    readonly chlorineOunces: number;
}

type CalcSanitizerDoseParams = CalcChlorineOuncesParams | HaveChlorineOuncesParams;

export function calcSanitizerDose(params: CalcSanitizerDoseParams): number {
    const { sanitizer, sanitizerChlorinePercent, toNearest = 0.01 } = params;

    const chlorineOunces = params.chlorineOunces ?? toChlorineOunces(params.fcIncreasePPM, params.tubGals);
    const sanitizerOunces = toSanitizerOunces(chlorineOunces, sanitizerChlorinePercent);

    switch (sanitizer) {
        case "bleach_floz":
            return mRound(toFluidOunces(sanitizerOunces, 1.0731), toNearest);
        case "dichlor_floz":
            return mRound(toFluidOunces(sanitizerOunces, 1.0685), toNearest);
        case "dichlor_oz":
            return mRound(sanitizerOunces, toNearest);
    }
}

function toChlorineOunces(fcIncreasePPM: number, tubGals: number): number {
    return toPercent(fcIncreasePPM) * toWaterOunces(tubGals);
}

function toSanitizerOunces(chlorineOunces: number, sanitizerChlorinePercent: number): number {
    return chlorineOunces * (100 / sanitizerChlorinePercent);
}

function toPercent(ppm: number): number {
    return ppm / 1000000;
}

function toWaterOunces(waterGals: number): number {
    return waterGals * 8.345 * 16;
}

function toFluidOunces(ounces: number, densityGpML: number): number {
    return ounces / densityGpML;
}
