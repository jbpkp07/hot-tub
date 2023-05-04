import { toBleachFluidOunces, ToBleachOuncesParams } from "./toSanitizerDose";

interface CalcPostSoakSanitizerDoseParams extends ToBleachOuncesParams {
    bathers: number;
    fcDailyLossPPM: number;
    fcBeforeSoakPPM: number;
    fcAfterSoakPPM: number;
    sanitizer: "bleach" | "dichlor";
}

export function calcPostSoakSanitizerDose(fcDailyPPM = 1, bathers = 0, fcBeforePPM = 0, fcAfterPPM = 0) {
    const fcSoakLossPPM = fcBeforePPM - fcAfterPPM;
    const areParamsValid = bathers > 0 && fcSoakLossPPM > 0;
    const fcIncreasePPM = areParamsValid ? (bathers + 1) * fcSoakLossPPM + fcDailyPPM - 0.5 : fcDailyPPM;

    return toBleachFluidOunces({ fcIncreasePPM, chlorinePercent: 7.5, tubGals: 285 }, 0.25)
}