interface TestUtils {
    test: (desc: string, testFn: () => void) => void;
    assert: (actual: unknown, expected: unknown) => void;
}

export function testUtils(): TestUtils {
    let testFailed: boolean;

    function test(desc: string, testFn: () => void) {
        testFailed = false;

        logTestDesc(desc);
        testFn();
        logTestResult(testFailed);
    }

    function assert(actual: unknown, expected: unknown) {
        const assertionFailed = actual !== expected;

        logAssertion(actual, expected, assertionFailed);

        if (assertionFailed) {
            testFailed = true;
            process.exitCode = 1;
        }
    }

    return { test, assert };
}

function logTestDesc(desc: string): void {
    console.log(`  Running test:  "${desc}"`, "\n");
}

function logTestResult(hasFailed: boolean): void {
    console.log(`\n  ${hasFailed ? red("━━━━━ FAILED ━━━━━") : green("━━━━━ PASSED ━━━━━")}\n`);
}

function logAssertion(actual: unknown, expected: unknown, hasFailed: boolean): void {
    const act = String(actual).padEnd(8, " ");
    const exp = String(expected).padEnd(8, " ");
    const res = hasFailed ? "FAIL" : "PASS";

    const labledAct = `Actual:  ${hasFailed ? red(act) : act}`;
    const labledExp = `Expected:  ${hasFailed ? red(exp) : exp}`;
    const labledRes = `Result:  ${hasFailed ? red(res) : green(res)}`;
    const pad = "  ";

    console.log(pad + labledAct + pad + labledExp + pad + labledRes);
}

function red(txt: unknown): string {
    return "\x1b[1;31m" + String(txt) + resetColor();
}

function green(txt: unknown): string {
    return "\x1b[1;32m" + String(txt) + resetColor();
}

function resetColor(): string {
    return "\x1b[0m";
}
