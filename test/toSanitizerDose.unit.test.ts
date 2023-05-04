import { testUtils } from "./testUtils";
import { toBleachFluidOunces, toDichlorFluidOunces, toDichlorOunces } from "../src/toSanitizerDose";

const { test, assert } = testUtils();

test("Precision test", () => {
    const params = {
        fcIncreasePPM: 16,
        tubGals: 285,
        toNearest: 0.001 as const
    };

    assert(toBleachFluidOunces({ ...params, chlorinePercent: 7.5 }), 7.565);
    assert(toDichlorFluidOunces({ ...params, chlorinePercent: 55.45 }), 1.028);
    assert(toDichlorOunces({ ...params, chlorinePercent: 55.45 }), 1.099);
});

test(`${toBleachFluidOunces.name}: calculator values`, () => {
    const params = {
        tubGals: 285,
        chlorinePercent: 7.5 as const,
        fcIncreasePPM: 0.5,
        toNearest: 0.1 as const
    };

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 0.5 }), 0.2); // 0.2 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 1.0 }), 0.5); // 0.5 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 1.5 }), 0.7); // 0.7 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 2.0 }), 0.9); // 0.9 fl oz (from calc)

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 3.5 }), 1.7); // 1.7 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 4.0 }), 1.9); // 1.9 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 4.5 }), 2.1); // 2.1 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 5.0 }), 2.4); // 2.4 fl oz (from calc)

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 6.0 }), 2.8); // 2.8 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 8.0 }), 3.8); // 3.8 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 16.0 }), 7.6); // 7.6 fl oz (from calc)

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 25.0, toNearest: 1 }), 12); // 12 fl oz (calc rounds to int above 10)
});

test(`${toBleachFluidOunces.name}: 0.25 fl oz increments`, () => {
    const params = {
        tubGals: 285,
        chlorinePercent: 7.5 as const,
        fcIncreasePPM: 0.5
    };

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 0.5 }), 0.25); // 0.2 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 1.0 }), 0.5); // 0.5 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 1.5 }), 0.75); // 0.7 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 2.0 }), 1.0); // 0.9 fl oz (from calc)

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 3.5 }), 1.75); // 1.7 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 4.0 }), 2.0); // 1.9 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 4.5 }), 2.25); // 2.1 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 5.0 }), 2.5); // 2.4 fl oz (from calc)

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 6.0 }), 3.0); // 2.8 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 8.0 }), 4.0); // 3.8 fl oz (from calc)
    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 16.0 }), 7.75); // 7.6 fl oz (from calc)

    assert(toBleachFluidOunces({ ...params, fcIncreasePPM: 25.0 }), 12); // 12 fl oz (calc rounds to int above 10)
});
