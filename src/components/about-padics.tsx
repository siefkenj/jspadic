import { Container, Table, Title } from "@mantine/core";
import React from "react";
import { BlockMath, InlineMath } from "react-katex";

function TypesetPadic() {
    return (
        <React.Fragment>
            <InlineMath>p</InlineMath>-adic
        </React.Fragment>
    );
}

export function AboutPadics() {
    return (
        <Container>
            <Title order={3}>
                The <TypesetPadic /> Numbers
            </Title>
            <p>
                The <TypesetPadic /> numbers are an alternative number system
                based off of a different <em>absolute value</em> (called the{" "}
                <em>
                    <TypesetPadic /> valuation
                </em>
                ). Instead of two numbers being close if their digits agree from
                left-to-right, two <TypesetPadic /> numbers are considered close
                if their digits agree from right-to-left.
            </p>
            <p>For example, consider</p>
            <Container size={"xs"}>
                <Table>
                    <tbody>
                        <tr>
                            <td>100</td>
                        </tr>
                        <tr>
                            <td>101</td>
                        </tr>
                        <tr>
                            <td>1000</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
            <p>
                In the usual number system, 100 and 101 are closer than 100 and
                1000. However, in the <TypesetPadic />
                100 and 1000 share two digits in common (counting from the
                right) whereas 100 and 101 share no digits in common (again,
                counting the longest run of common digits starting from the
                right). Thus, in the <TypesetPadic /> numbers, 100 and 1000 are
                closer than 100 and 101.
            </p>
        </Container>
    );
}
