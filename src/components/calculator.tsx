import { Container, Table, Title } from "@mantine/core";
import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import { valuationToPrettyFraction, diff, solve, prod } from "../lib/padic";
import { PAdicPrimitive } from "../lib/padic/padic-array/padic-array-primitive";
import { PAdicInterface } from "../lib/padic/types";
import { useAppSelector } from "../store/hooks";
import { selector } from "../store/state-slice";

const MAX_DISPLAY_DIGITS = 20;

function prettyPAdic(
    x: PAdicInterface,
    maxDigits = MAX_DISPLAY_DIGITS
): string {
    let repr = x.toString(maxDigits);
    if (repr.length >= maxDigits - 2) {
        repr = "\\cdots " + repr;
    }
    return repr;
}

export function Calculator() {
    const a = useAppSelector(selector.a);
    const b = useAppSelector(selector.b);
    const p = useAppSelector(selector.base);

    const axEqBSolutions = solve(p, (x: PAdicInterface) => diff(prod(a, x), b));
    axEqBSolutions.computeDigits(MAX_DISPLAY_DIGITS);
    const axEqBSolutionSet = axEqBSolutions.getPossibleSolutions();

    const xSquaredSolutions = solve(p, (x: PAdicInterface) =>
        diff(prod(x, x), a)
    );
    xSquaredSolutions.computeDigits(MAX_DISPLAY_DIGITS);
    const xSquaredSolutionSet = xSquaredSolutions.getPossibleSolutions();

    return (
        <Container>
            <Title order={4}>Linear Equation</Title>
            <p>
                The equation <InlineMath math="ax=b" />, i.e.
            </p>
            <BlockMath math={`${prettyPAdic(a)}x=${prettyPAdic(b)}`} />
            <p>
                has{" "}
                {axEqBSolutionSet.length === 0 ? (
                    <React.Fragment>
                        <b>no solutions</b>.
                    </React.Fragment>
                ) : (
                    "solutions"
                )}
            </p>
            {axEqBSolutionSet.map((digits, i) => (
                <React.Fragment key={i}>
                    <BlockMath
                        math={`x=${prettyPAdic(new PAdicPrimitive(digits))}`}
                    />
                </React.Fragment>
            ))}
            <Title order={4}>Quadratic Equation</Title>
            <p>
                The equation <InlineMath math="x^2=a" />, i.e.
            </p>
            <BlockMath math={`x^2=${prettyPAdic(a)}`} />
            <p>
                has{" "}
                {xSquaredSolutionSet.length === 0 ? (
                    <React.Fragment>
                        <b>no solutions</b>.
                    </React.Fragment>
                ) : (
                    "solutions"
                )}
            </p>
            {xSquaredSolutionSet.map((digits, i) => (
                <React.Fragment key={i}>
                    <BlockMath
                        math={`x=${prettyPAdic(new PAdicPrimitive(digits))}`}
                    />
                </React.Fragment>
            ))}
        </Container>
    );
}
