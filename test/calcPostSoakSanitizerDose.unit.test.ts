import { testUtils } from "./testUtils";
import { calcPostSoakSanitizerDose } from "../src/calcPostSoakSanitizerDose";

const { test, assert } = testUtils();

test("Hours bleach estimate", () => {
    const params = {
        fcDailyLossPPM: 1.0,
        tubGals: 285,
        sanitizer: "bleach_floz" as const,
        sanitizerChlorinePercent: 7.5 as const,
        toNearest: 0.25 as const
    };

    // 0 Bathers and/or 0 Hours
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 0, hours: 0 }), 0.5);
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 0, hours: 1 }), 0.5);
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 0 }), 0.5);

    // 1 Bather
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 0.25 }), 0.75); // real data point: 1b x 0.25h = [0.75]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 0.75 }), 1.0); // real data point: 1b x 0.75h = [1.00/1.25]

    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 1.0 }), 1.25); // real data point: 1b x 1.00h = [1.25, 1.25]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 1.25 }), 1.5); // real data point: 1b x 1.25h = [1.50, 1.25]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 1.5 }), 1.75); // real data point: 1b x 1.5h = [1.50]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 1.75 }), 2.0); // real data point: 1b x 1.75h = [1.75, 2.00, 2.00, 2.00]

    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 2.0 }), 2.0); // real data point: 1b x 2.0h = [2.25, 2.00/2.25]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 2.5 }), 2.25); // real data point: 1b x 2.5h = [2.00]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, hours: 3.0 }), 2.5); // real data point: 1b x 3h = [2.25]

    // 2 Bathers
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 2, hours: 1.0 }), 2.75); // real data point: 2b x 1h = [2.50/2.75]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 2, hours: 1.75 }), 3.75); // real data point: 2b x 1.75h = [3.50/3.75] (chris + jeremy, dubious results)

    // Various Bathers
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1.667, hours: 1.5 }), 3.00); // real data point: 2b x 1h + 1b x 0.5h = [2.75/3.00]
    assert(calcPostSoakSanitizerDose({ ...params, bathers: 1.5, hours: 1.0 }), 2.0); // real data point: 1.5b x 1h = [1.75/2.00] (kelsey + jeremy, dubious results)

    // Different tub size
    assert(calcPostSoakSanitizerDose({ ...params, fcDailyLossPPM: 0.1, tubGals: 2850, bathers: 1, hours: 1.0 }), 1.25);
});

// test("FC loss bleach estimate", () => {
//     const params = {
//         fcDailyLossPPM: 1.0,
//         chlorinePercent: 7.5 as const,
//         tubGals: 285,
//         sanitizer: "bleach_floz" as const
//     };

//     // 0 Bathers and/or 0 Hours
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 0, fcPreSoakPPM: 4.0, fcPostSoakPPM: 4.0 }), 0.5);
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 0, fcPreSoakPPM: 4.0, fcPostSoakPPM: 3.0 }), 0.5);
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 4.0, fcPostSoakPPM: 4.0 }), 0.75);

//     // 1 Bather
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.5 }), 0.75); // real data point: 1b x 0.25h = 0.75
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.25 }), 1.0); // real data point: 1b x 0.75h = [1.00/1.25, 1.25]

//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 4.0 }), 1.25); // real data point: 1b x 1.00h = [1.25, 1.25]
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.75 }), 1.5); // real data point: 1b x 1.25h = 1.50
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.5, fcPostSoakPPM: 4.25 }), 1.5); // real data point: 1b x 1.50h = 1.50
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.25 }), 1.75); // real data point: 1b x 1.75h = 1.75/2.00

//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.0 }), 2.0); // real data point: 1b x 2.0h = [2.25, 2.00/2.25]
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 6.5, fcPostSoakPPM: 4.5 }), 2.0); // real data point: 1b x 2.5h = 2.00
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1, fcPreSoakPPM: 4.5, fcPostSoakPPM: 1.75 }), 2.25); // real data point: 1b x 3.00h = 2.25

//     // 2 Bathers
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 2, fcPreSoakPPM: 5.0, fcPostSoakPPM: 3.5 }), 2.5); // real data point: 2b x 1h = 2.50/2.75

//     // Various Bathers
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1.667, fcPreSoakPPM: 6.0, fcPostSoakPPM: 3.5 }), 2.75); // real data point: 2b x 1h + 1b x 0.5h = 2.75/3.00
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 1.5, fcPreSoakPPM: 3.75, fcPostSoakPPM: 2.25 }), 2.0); // real data point: 1.5b x 1h = 1.75/2.00 (kelsey + jeremy, dubious results)
//     assert(calcPostSoakSanitizerDose({ ...params, bathers: 2.333, fcPreSoakPPM: 5.0, fcPostSoakPPM: 2.50 }), 3.5); // real data point: 2.333b x 1h = ???? (whole family) --------------------------

//     assert(calcPostSoakSanitizerDose({ ...params, fcDailyLossPPM: 0.1, tubGals: 2850, bathers: 1, fcPreSoakPPM: 5.0, fcPostSoakPPM: 5.0 }), 1.25);
// });
