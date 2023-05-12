import { mCeil, mRound } from "./mathUtils";

interface CalcSanitizerOuncesParams {
    readonly chlorinePercent: number;
    readonly fcIncreasePPM: number;
    readonly tubGals: number;
    readonly toNearest?: 0.001 | 0.01 | 0.1 | 0.25 | 0.5 | 1.0;
}

export interface CalcBleachOuncesParams extends CalcSanitizerOuncesParams {
    readonly chlorinePercent: 5.25 | 6.0 | 7.5 | 8.25 | 10.0 | 12.5;
    readonly sanitizer: "bleach_floz";
}

export interface CalcDichlorOuncesParams extends CalcSanitizerOuncesParams {
    readonly chlorinePercent: 55.45;
    readonly sanitizer: "dichlor_floz" | "dichlor_oz";
}

export function calcSanitizerDose(params: CalcBleachOuncesParams | CalcDichlorOuncesParams): number {
    switch (params.sanitizer) {
        case "bleach_floz":
            return calcBleachFluidOunces(params);
        case "dichlor_floz":
            return calcDichlorFluidOunces(params);
        case "dichlor_oz":
            return calcDichlorOunces(params);
    }
}

function calcBleachFluidOunces(params: CalcBleachOuncesParams): number {
    const { toNearest = 0.25 } = params;
    const ounces = calcSanitizerOunces(params);
    const fluidOunces = toFluidOunces(ounces, 1.0731);

    return round(fluidOunces, toNearest);
}

function calcDichlorFluidOunces(params: CalcDichlorOuncesParams): number {
    const { toNearest = 0.01 } = params;
    const ounces = calcSanitizerOunces(params);
    const fluidOunces = toFluidOunces(ounces, 1.0685);

    return round(fluidOunces, toNearest);
}

function calcDichlorOunces(params: CalcDichlorOuncesParams): number {
    const { toNearest = 0.01 } = params;
    const ounces = calcSanitizerOunces(params);

    return round(ounces, toNearest);
}

function calcSanitizerOunces(params: CalcSanitizerOuncesParams): number {
    const { chlorinePercent, fcIncreasePPM, tubGals } = params;

    return toMultInverse(chlorinePercent / 100) * toPercent(fcIncreasePPM) * toWaterOunces(tubGals);
}

function toMultInverse(x: number): number {
    return 1 / x;
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

function round(num: number, toNearest: number): number {
    return toNearest <= 0.1 ? mRound(num, toNearest) : mCeil(num, toNearest);
}
