export function mCeil(num: number, toNearest = 1): number {
    return roundToNearest({ method: "ceil", num, toNearest });
}

export function mFloor(num: number, toNearest = 1): number {
    return roundToNearest({ method: "floor", num, toNearest });
}

export function mRound(num: number, toNearest = 1): number {
    return roundToNearest({ method: "round", num, toNearest });
}

export function mMax(num1: number, num2: number, toNearest = 1): number {
    return Math.max(mRound(num1, toNearest), mRound(num2, toNearest));
}

type RoundToNearestParams = {
    readonly method: "ceil" | "floor" | "round";
    readonly num: number;
    readonly toNearest: number;
};

function roundToNearest(params: RoundToNearestParams): number {
    const { method, num, toNearest } = params;
    const { abs, [method]: round } = Math;

    const roundedNum = toNearest ? round(num / abs(toNearest)) * abs(toNearest) : round(num);
    const fractionDigits = countFractionDigits(toNearest);

    return toFixed(roundedNum, fractionDigits);
}

function countFractionDigits(num: number): number {
    return String(num).split(".")[1]?.length ?? 0;
}

function toFixed(num: number, fractionDigits: number): number {
    return Number(num.toFixed(fractionDigits));
}
