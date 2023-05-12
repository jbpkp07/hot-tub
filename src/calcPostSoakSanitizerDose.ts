import { calcSanitizerDose, CalcBleachOuncesParams, CalcDichlorOuncesParams } from "./calcSanitizerDose";
import { mCeil, mRound } from "./mathUtils";

interface BaseParams {
    readonly bathers: number;
    readonly fcDailyLossPPM: number;
    readonly fcPreSoakPPM: number;
    readonly fcPostSoakPPM: number;
}

type CalcPostSoakSanitizerDoseParams = BaseParams &
    (Omit<CalcBleachOuncesParams, "fcIncreasePPM"> | Omit<CalcDichlorOuncesParams, "fcIncreasePPM">);

export function calcPostSoakSanitizerDose(params: CalcPostSoakSanitizerDoseParams): number {
    const fcIncreasePPM = calcFcIncreasePPM(params);

    return calcSanitizerDose({ ...params, fcIncreasePPM });
}

function calcFcIncreasePPM(params: BaseParams): number {
    const { bathers, fcDailyLossPPM, fcPreSoakPPM, fcPostSoakPPM } = params;
    const fcLossPPM = fcPreSoakPPM - fcPostSoakPPM;

    if (bathers > 0 && fcLossPPM > 0) {
        const fcTargetIncreasePPM = bathers ** 0.8 * calcMultFactor(fcLossPPM) + fcDailyLossPPM;
        const fcMinIncreasePPM = calcFcMinIncreasePPM(bathers, fcDailyLossPPM);

        return Math.max(fcTargetIncreasePPM, fcMinIncreasePPM);
    }

    return fcDailyLossPPM;
}

function calcMultFactor(quantity: number): number {
    const nonNegligible = Math.max(quantity - 0.5, 0);

    return Math.sqrt(nonNegligible) * 2.225;
}

function calcFcMinIncreasePPM(bathers: number, fcDailyLossPPM: number): number {
    return bathers * 0.5 + fcDailyLossPPM;
}
