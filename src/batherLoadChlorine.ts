import { testUtils } from "../test/testUtils";
import { mCeil, mMax, mRound } from "./mathUtils";
import { toBleachFluidOunces } from "./toSanitizerDose"

const { test, assert } = testUtils();

console.clear();

function estimateBleach1(bathers: number, hours: number) {
    const maintDosage = 1.0;

    if (bathers * hours > 0) {
        const { abs, sqrt, max } = Math;
        const batherHours = (bathers * 2) * sqrt(max(hours - 0.25, 0)) * 1.425;
        const batherShock = (bathers * 0.5) + maintDosage;

        // return mMax(batherHours, batherShock, 0.25);
        const fcIncreasePPM = Math.max(batherHours, batherShock);

        return toBleachFluidOunces({ fcIncreasePPM, chlorinePercent: 7.5, tubGals: 285 })
    }

    return toBleachFluidOunces({ fcIncreasePPM: maintDosage, chlorinePercent: 7.5, tubGals: 285 })
}

test("Bathers/Hours bleach estimate", () => {
    // 0 Bathers and/or 0 Hours
    assert(estimateBleach1(0, 0.00), 0.50);
    assert(estimateBleach1(1, 0.00), 0.50);
    assert(estimateBleach1(0, 1.00), 0.50);

    // 1 Bather
    assert(estimateBleach1(1, 0.10), 0.75);
    assert(estimateBleach1(1, 0.25), 0.75); // real data point: 1b x 0.25h = 0.75
    assert(estimateBleach1(1, 0.75), 1.00); // real data point: 1b x 0.75h = 1.00/1.25

    assert(estimateBleach1(1, 1.00), 1.25); // real data point: 1b x 1h = 1.25; 1b x 1h = 1.25
    assert(estimateBleach1(1, 1.25), 1.50); // real data point: 1b x 1.25h = 1.50
    assert(estimateBleach1(1, 1.75), 1.75); // real data point: 1b x 1.75h = 1.75/2.00

    assert(estimateBleach1(1, 2.00), 2.00); // real data point: 1b x 2h = 2.25; 1b x 2h = 2.00/2.25
    assert(estimateBleach1(1, 3.00), 2.25); // real data point: 1b x 3h = 2.25

    // 2 Bathers
    assert(estimateBleach1(2, 0.10), 1.00);
    assert(estimateBleach1(2, 1.00), 2.50); // real data point: 2b x 1h = 2.50/2.75

    // Various Bathers
    assert(estimateBleach1(1.667, 1.50), 2.75); // real data point: 2b x 1h + 1b x 0.5h = 2.75/3.00
});

function calcPostSoakSanitizerDose(fcDailyPPM = 1, bathers = 0, fcBeforePPM = 0, fcAfterPPM = 0) {
    const { abs, sqrt, max } = Math;
    const fcSoakLossPPM = fcBeforePPM - fcAfterPPM;
    const areParamsValid = bathers > 0 && fcSoakLossPPM > 0;
    let fcIncreasePPM = areParamsValid ? (bathers + 1) * sqrt(max(fcSoakLossPPM - 0.25, 0)) * 1.425 : fcDailyPPM;
    const maintDosage = 1.0;
    const batherShock = (bathers * 0.5) + maintDosage;

    fcIncreasePPM = max(fcIncreasePPM, batherShock);


    return toBleachFluidOunces({ fcIncreasePPM, chlorinePercent: 7.5, tubGals: 285 })
}
// start ---------------------
test("Bathers/FC-drop bleach estimate", () => {
    // 0 Bathers and/or <= 0 Hours
    assert(calcPostSoakSanitizerDose(1.0, 0, 4, 4), 0.50);
    assert(calcPostSoakSanitizerDose(1.0, 0, 4, 3), 0.50);
    assert(calcPostSoakSanitizerDose(1.0, 0, 3, 4), 0.50);

    // 1 Bather
    assert(calcPostSoakSanitizerDose(1.0, 1, 5.0, 4.9), 0.75);
    assert(calcPostSoakSanitizerDose(1.0, 1, 5.0, 4.5), 0.75); // real data point: 1b x 0.25h = 0.75 (fcDrop = 0.50)
    assert(calcPostSoakSanitizerDose(1.0, 1, 5.0, 4.25), 1.00); // real data point: 1b x 0.75h = 1.00/1.25 (fcDrop = 0.75)
    
    assert(calcPostSoakSanitizerDose(1.0, 1, 5.0, 4.0), 1.25); // real data point: 1b x 1.00h = 1.25; 1b x 1h = 1.25 (fcDrop = 1.00)
    assert(calcPostSoakSanitizerDose(1.0, 1, 5.0, 3.75), 1.50); // real data point: 1b x 1.25h = 1.50 (fcDrop = 1.25)
    assert(calcPostSoakSanitizerDose(1.0, 1, 5.0, 3.25), 1.75); // real data point: 1b x 1.75h = 1.75/2.00 (fcDrop = 1.75)
    
    assert(calcPostSoakSanitizerDose(1.0, 1, 5.0, 3.0), 2.00); // real data point: 1b x 2.00h = 2.25; 1b x 2h = 2/2.25 (fcDrop = 2.00)
    assert(calcPostSoakSanitizerDose(1.0, 1, 4.5, 2.0), 2.25); // real data point: 1b x 3h = 2.25

    // 2 Bathers
    assert(calcPostSoakSanitizerDose(1.0, 2, 5.0, 3.5), 2.50); // real data point: 2b x 1h = 2.50/2.75 (fcDrop = 1.50)

    // Various Bathers
    assert(calcPostSoakSanitizerDose(1.0, 1.667, 6.0, 3.5), 2.75); // real data point: 2b x 1h + 1b x 0.5h = 2.75/3.00
});
