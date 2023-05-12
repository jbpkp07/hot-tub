import { testUtils } from "./testUtils";
import { calcSanitizerDose } from "../src/calcSanitizerDose";

const { test, assert } = testUtils();

test("Precision test", () => {
    const params = {
        fcIncreasePPM: 16,
        tubGals: 285,
        toNearest: 0.001 as const
    };

    assert(calcSanitizerDose({ ...params, chlorinePercent: 7.5, sanitizer: "bleach_floz" }), 7.565);
    assert(calcSanitizerDose({ ...params, chlorinePercent: 55.45, sanitizer: "dichlor_floz" }), 1.028);
    assert(calcSanitizerDose({ ...params, chlorinePercent: 55.45, sanitizer: "dichlor_oz" }), 1.098);
});

test("Bleach fl oz: calculator values", () => {
    const params = {
        tubGals: 285,
        fcIncreasePPM: 0.5,
        chlorinePercent: 7.5 as const,
        toNearest: 0.1 as const,
        sanitizer: "bleach_floz" as const
    };

    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 0.5 }), 0.2);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 1.0 }), 0.5);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 2.0 }), 0.9);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 4.0 }), 1.9);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 8.0 }), 3.8);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 16.0 }), 7.6);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 25.0, toNearest: 1 }), 12);
});

test("Bleach fl oz: 0.25 increments", () => {
    const params = {
        tubGals: 285,
        fcIncreasePPM: 0.5,
        chlorinePercent: 7.5 as const,
        sanitizer: "bleach_floz" as const
    };

    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 0.5 }), 0.25);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 1.0 }), 0.5);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 2.0 }), 1.0);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 4.0 }), 2.0);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 8.0 }), 4.0);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 16.0 }), 7.75);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 25.0 }), 12);
});

test("Dichlor fl oz: calculator values", () => {
    const params = {
        tubGals: 285,
        fcIncreasePPM: 0.5,
        chlorinePercent: 55.45 as const,
        sanitizer: "dichlor_floz" as const
    };

    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 0.5 }), 0.03);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 1.0 }), 0.06);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 2.0 }), 0.13);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 4.0 }), 0.26);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 8.0 }), 0.51);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 16.0 }), 1.03);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 25.0 }), 1.61);
});

test("Dichlor oz: calculator values", () => {
    const params = {
        tubGals: 285,
        fcIncreasePPM: 0.5,
        chlorinePercent: 55.45 as const,
        sanitizer: "dichlor_oz" as const
    };

    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 0.5 }), 0.03);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 1.0 }), 0.07);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 2.0 }), 0.14);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 4.0 }), 0.27);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 8.0 }), 0.55);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 16.0 }), 1.1);
    assert(calcSanitizerDose({ ...params, fcIncreasePPM: 25.0 }), 1.72);
});
