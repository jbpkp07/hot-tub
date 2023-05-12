import { testUtils } from "../test/testUtils";
import { mCeil, mRound } from "./mathUtils";
import { calcSanitizerDose } from "./calcSanitizerDose";
import { calcPostSoakSanitizerDose } from "./calcPostSoakSanitizerDose";

const { test, assert } = testUtils();

console.clear();

function estimateBleach1(bathers: number, hours: number) {
    const maintDosage = 1.0;

    if (bathers * hours > 0) {
        const { abs, sqrt, max, pow } = Math;
        const batherHours = bathers ** 1.35 * sqrt(max(hours - 0.5, 0)) * 2.225 + maintDosage;
        const batherShock = bathers * 0.5 + maintDosage;

        // return mMax(batherHours, batherShock, 0.25);
        const fcIncreasePPM = Math.max(batherHours, batherShock);

        return calcSanitizerDose({ fcIncreasePPM, chlorinePercent: 7.5, tubGals: 285, sanitizer: "bleach_floz" });
    }

    return calcSanitizerDose({ fcIncreasePPM: maintDosage, chlorinePercent: 7.5, tubGals: 285, sanitizer: "bleach_floz" });
}

test("Bathers/Hours bleach estimate", () => {
    // 0 Bathers and/or 0 Hours
    assert(estimateBleach1(0, 0.0), 0.5);
    assert(estimateBleach1(1, 0.0), 0.5);
    assert(estimateBleach1(0, 1.0), 0.5);

    // 1 Bather
    assert(estimateBleach1(1, 0.1), 0.75);
    assert(estimateBleach1(1, 0.25), 0.75); // real data point: 1b x 0.25h = 0.75
    assert(estimateBleach1(1, 0.75), 1.0); // real data point: 1b x 0.75h = 1.00/1.25

    assert(estimateBleach1(1, 1.0), 1.25); // real data point: 1b x 1h = 1.25; 1b x 1h = 1.25
    assert(estimateBleach1(1, 1.25), 1.5); // real data point: 1b x 1.25h = 1.50
    assert(estimateBleach1(1, 1.75), 1.75); // real data point: 1b x 1.75h = 1.75/2.00

    assert(estimateBleach1(1, 2.0), 2.0); // real data point: 1b x 2h = 2.25; 1b x 2h = 2.00/2.25
    assert(estimateBleach1(1, 3.0), 2.25); // real data point: 1b x 3h = 2.25

    // 2 Bathers
    assert(estimateBleach1(2, 0.1), 1.0);
    assert(estimateBleach1(2, 1.0), 2.5); // real data point: 2b x 1h = 2.50/2.75
    assert(estimateBleach1(2, 1.75), 3.5); // real data point: 2b x 1.75h = 3.50/3.75 (chris + jeremy, dubious results)

    // Various Bathers
    assert(estimateBleach1(1.667, 1.5), 2.75); // real data point: 2b x 1h + 1b x 0.5h = 2.75/3.00
    assert(estimateBleach1(1.5, 1.00), 2.00); // real data point: 1.5b x 1h = 1.75/2.00 (kelsey + jeremy, dubious results)
});

test("Bathers/FC-drop bleach estimate", () => {
    const params = {
        fcDailyLossPPM: 1.0,
        chlorinePercent: 7.5 as const,
        tubGals: 285,
        sanitizer: "bleach_floz" as const
    };

    // 0 Bathers and/or 0 Hours
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 0, fcPreSoakPPM: 4.0, fcPostSoakPPM: 4.0 }), 0.5);
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 0, fcPreSoakPPM: 4.0, fcPostSoakPPM: 3.0 }), 0.5);
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 4.0, fcPostSoakPPM: 4.0 }), 0.5);

    // 1 Bather
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.9 }), 0.75);
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.5 }), 0.75); // real data point: 1b x 0.25h = 0.75
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.25 }), 1.0); // real data point: 1b x 0.75h = 1.00/1.25
    
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.0 }), 1.25); // real data point: 1b x 1.00h = [1.25, 1.25]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.75 }), 1.5); // real data point: 1b x 1.25h = 1.50
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.25 }), 1.75); // real data point: 1b x 1.75h = 1.75/2.00

    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.0 }), 2.0); // real data point: 1b x 2.00h = [2.25, 2/2.25]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 4.5, fcPostSoakPPM: 1.75 }), 2.25); // real data point: 1b x 3.00h = 2.25

    // // 2 Bathers
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 2, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.9 }), 1.0);
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 2, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.5 }), 2.50); // real data point: 2b x 1h = 2.50/2.75

    // // Various Bathers
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1.667, fcPreSoakPPM: 6.0, fcPostSoakPPM: 3.5 }), 2.75); // real data point: 2b x 1h + 1b x 0.5h = 2.75/3.00
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1.5, fcPreSoakPPM: 3.75, fcPostSoakPPM: 2.25 }), 2.00); // real data point: 1.5b x 1h = 1.75/2.00 (kelsey + jeremy, dubious results)
});
