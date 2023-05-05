import { Table } from "@mantine/core";
import { BlockMath, InlineMath } from "react-katex";
import { valuationToPrettyFraction, diff } from "../lib/padic";
import { useAppSelector } from "../store/hooks";
import { selector } from "../store/state-slice";

const MAX_DISPLAY_DIGITS = 20;

export function BasicInfo() {
    const a = useAppSelector(selector.a);
    const b = useAppSelector(selector.b);
    const p = useAppSelector(selector.base);
    const va = a.valuation();
    const vb = b.valuation();
    const dab = diff(a, b);
    const diffAbv = dab.valuation();
    const aRepr = a.toString(MAX_DISPLAY_DIGITS);
    const aIsTruncated = aRepr.length >= MAX_DISPLAY_DIGITS;
    const bRepr = b.toString(MAX_DISPLAY_DIGITS);
    const bIsTruncated = bRepr.length >= MAX_DISPLAY_DIGITS;
    const dabRepr = dab.toString(MAX_DISPLAY_DIGITS);
    const dabIsTruncated = dabRepr.length >= MAX_DISPLAY_DIGITS;

    return (
        <Table>
            <tbody>
                <tr>
                    <td>
                        <BlockMath
                            math={`a = ${
                                aIsTruncated ? "\\cdots" : ""
                            }${aRepr}`}
                        />
                    </td>
                    <td>
                        <BlockMath
                            math={`|a|_{${p}} = ${valuationToPrettyFraction(
                                va,
                                p
                            )}`}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <BlockMath
                            math={`b = ${
                                bIsTruncated ? "\\cdots" : ""
                            }${bRepr}`}
                        />
                    </td>
                    <td>
                        <BlockMath
                            math={`|b|_{${p}} = ${valuationToPrettyFraction(
                                vb,
                                p
                            )}`}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <BlockMath
                            math={`a-b = ${
                                dabIsTruncated ? "\\cdots" : ""
                            }${dabRepr}`}
                        />
                    </td>
                    <td>
                        <BlockMath
                            math={`|a-b|_{${p}} = ${valuationToPrettyFraction(
                                diffAbv,
                                p
                            )}`}
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}
