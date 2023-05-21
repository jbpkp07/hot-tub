import { calcSanitizerDose, SanitizerParams } from "./calcSanitizerDose";
import { max, mRound, pow } from "./mathUtils";

interface CalcPostSoakSanitizerDoseParams extends SanitizerParams {
    readonly bathers: number;
    readonly hours: number;
    readonly fcDailyLossPPM: number;
    readonly tubGals: number;
}

export function calcPostSoakSanitizerDose(params: CalcPostSoakSanitizerDoseParams): number {
    const { bathers, hours, tubGals, fcDailyLossPPM, toNearest } = params;

    const sanitizerParams = extractSanitizerParams(params);
    const chlorineOunces = calcBatherLoadChlorineOunces(bathers, hours);

    const batherLoadDose = calcBatherLoadDose(sanitizerParams, chlorineOunces);
    const fcDailyLossDose = calcFcDailyLossDose(sanitizerParams, tubGals, fcDailyLossPPM);

    return mRound(batherLoadDose + fcDailyLossDose, toNearest);
}

function extractSanitizerParams(fromParams: CalcPostSoakSanitizerDoseParams): SanitizerParams {
    const { sanitizer, sanitizerChlorinePercent, toNearest } = fromParams;

    return { sanitizer, sanitizerChlorinePercent, toNearest };
}

function calcBatherLoadChlorineOunces(bathers: number, hours: number): number {
    if (bathers <= 0 || hours <= 0) {
        return 0;
    }

    const b = bathers;
    const h = max(hours - 0.5, 0);

    const min = b * 0.025;
    const tar = pow(b, 1.375) * pow(h, 0.5) * 0.0905;

    return max(min, tar);
}

function calcBatherLoadDose(sanitizerParams: SanitizerParams, chlorineOunces: number): number {
    return calcSanitizerDose({ ...sanitizerParams, chlorineOunces });
}

function calcFcDailyLossDose(sanitizerParams: SanitizerParams, tubGals: number, fcDailyLossPPM: number): number {
    const fcIncreasePPM = fcDailyLossPPM;

    return calcSanitizerDose({ ...sanitizerParams, tubGals, fcIncreasePPM });
}
