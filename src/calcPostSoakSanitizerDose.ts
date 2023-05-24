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

    const batherLoadDose = calcSanitizerDose({ ...sanitizerParams, chlorineOunces });
    const fcDailyLossDose = calcSanitizerDose({ ...sanitizerParams, tubGals, fcIncreasePPM: fcDailyLossPPM });

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
    const tar = pow(b, 1.29) * pow(h, 0.5) * 0.099;

    return max(min, tar);
}
