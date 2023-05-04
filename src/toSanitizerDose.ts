import { mCeil, mRound } from "./mathUtils";

interface BaseParams {
    readonly chlorinePercent: number;
    readonly fcIncreasePPM: number;
    readonly tubGals: number;
    readonly toNearest?: 0.001 | 0.01 | 0.1 | 0.25 | 0.5 | 1.0;
}

interface ToBleachOuncesParams extends BaseParams {
    readonly chlorinePercent: 5.25 | 6.0 | 7.5 | 8.25 | 10.0 | 12.5;
}

interface ToDichlorOuncesParams extends BaseParams {
    readonly chlorinePercent: 55.45;
}

export function toBleachFluidOunces(params: ToBleachOuncesParams): number {
    const { toNearest = 0.25 } = params;
    const ounces = toSanitizerOunces(params);
    const fluidOunces = toFluidOunces(ounces, 1.0731);

    return toNearest <= 0.1 ? mRound(fluidOunces, toNearest) : mCeil(fluidOunces, toNearest);
}

export function toDichlorFluidOunces(params: ToDichlorOuncesParams): number {
    const { toNearest = 0.1 } = params;
    const ounces = toSanitizerOunces(params);
    const fluidOunces = toFluidOunces(ounces, 1.069);

    return mCeil(fluidOunces, toNearest);
}

export function toDichlorOunces(params: ToDichlorOuncesParams): number {
    const { toNearest = 0.01 } = params;
    const ounces = toSanitizerOunces(params);

    return mCeil(ounces, toNearest);
}

function toSanitizerOunces(params: BaseParams): number {
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
