import { testUtils } from "./testUtils";
import { mCeil, mFloor, mRound } from "../src/mathUtils";

const { test, assert } = testUtils();

test(`${mCeil.name}`, () => {
    assert(mCeil(0), 0);
    assert(mCeil(0, 0), 0);
    assert(mCeil(0, 1), 0);
    assert(mCeil(1, 0), 1);

    assert(mCeil(-1), -1);
    assert(mCeil(-1, -0.5), -1);
    assert(mCeil(-1, 0.5), -1);

    assert(mCeil(1), 1);
    assert(mCeil(1.2345), 2);
    assert(mCeil(1.2345, -0.1), 1.3);
    assert(mCeil(1.2345, 0.1), 1.3);

    assert(mCeil(1.2345, 0.321), 1.284);
    assert(mCeil(1.2345, 10), 10);
});

test(`${mFloor.name}`, () => {
    assert(mFloor(0), 0);
    assert(mFloor(0, 0), 0);
    assert(mFloor(0, 1), 0);
    assert(mFloor(1, 0), 1);

    assert(mFloor(-1), -1);
    assert(mFloor(-1, -0.5), -1);
    assert(mFloor(-1, 0.5), -1);

    assert(mFloor(1), 1);
    assert(mFloor(1.2345), 1);
    assert(mFloor(1.2345, -0.1), 1.2);
    assert(mFloor(1.2345, 0.1), 1.2);

    assert(mFloor(1.2345, 0.321), 0.963);
    assert(mFloor(1.2345, 10), 0);
});

test(`${mRound.name}`, () => {
    assert(mRound(0), 0);
    assert(mRound(0, 0), 0);
    assert(mRound(0, 1), 0);
    assert(mRound(1, 0), 1);

    assert(mRound(-1), -1);
    assert(mRound(-1, -0.5), -1);
    assert(mRound(-1, 0.5), -1);

    assert(mRound(1), 1);
    assert(mRound(1.2345), 1);
    assert(mRound(1.2345, -0.1), 1.2);
    assert(mRound(1.2345, 0.1), 1.2);

    assert(mRound(1.2345, 0.321), 1.284);
    assert(mRound(1.2345, 10), 0);
});
