import { Table } from "@mantine/core";
import { BlockMath, InlineMath } from "react-katex";
import { padic, valuationToPrettyFraction } from "../lib/padic";
import { useAppSelector } from "../store/hooks";
import { selector } from "../store/state-slice";

export function BasicInfo() {
    const a = useAppSelector(selector.a);
    const b = useAppSelector(selector.b);
    const p = useAppSelector(selector.base);
    const va = a.valuation();
    const vb = padic.valuation(b, p);
    const dba = 0;//padic.dist(a,b,p);

    return (
        <Table>
            <tbody>
                <tr>
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
                            math={`|a-b|_{${p}} = ${valuationToPrettyFraction(
                                dba,
                                p
                            )}`}
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}
