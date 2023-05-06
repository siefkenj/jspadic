import {
    AppShell,
    Navbar,
    Header,
    Container,
    TextInput,
    Divider,
    Tabs,
    ScrollArea,
} from "@mantine/core";
import { BasicInfo } from "./components/basic-info";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { actions, selector } from "./store/state-slice";
import "katex/dist/katex.min.css";
import { AboutPadics } from "./components/about-padics";
import { InlineMath } from "react-katex";
import { Calculator } from "./components/calculator";

function App() {
    const base = useAppSelector(selector.base);
    const aText = useAppSelector(selector.aText);
    const aInBaseText = useAppSelector(selector.aInBaseText);
    const bText = useAppSelector(selector.bText);
    const bInBaseText = useAppSelector(selector.bInBaseText);
    const dispatch = useAppDispatch();

    return (
        <AppShell
            padding={0}
            mah={"100vh"}
            navbar={
                <Navbar width={{ base: 300 }} p="xs">
                    <Navbar.Section>
                        <TextInput
                            icon={"p = "}
                            label="Base"
                            value={base > 0 ? String(base) : ""}
                            onChange={(e) => {
                                dispatch(actions.setBase(e.target.value));
                            }}
                        />
                        <Divider mt="sm" variant="dashed" />
                        <TextInput
                            icon={"a = "}
                            label="a in base 10"
                            value={aText}
                            onChange={(e) => {
                                dispatch(actions.setAText(e.target.value));
                            }}
                        />
                        <TextInput
                            icon={"a = "}
                            label={`a in base ${base}`}
                            value={aInBaseText}
                            onChange={(e) => {
                                dispatch(
                                    actions.setAInBaseText(e.target.value)
                                );
                            }}
                        />
                        <Divider mt="sm" variant="dashed" />
                        <TextInput
                            icon={"b = "}
                            label="b"
                            value={bText}
                            onChange={(e) => {
                                dispatch(actions.setBText(e.target.value));
                            }}
                        />
                        <TextInput
                            icon={"b = "}
                            label={`b in base ${base}`}
                            value={bInBaseText}
                            onChange={(e) => {
                                dispatch(
                                    actions.setBInBaseText(e.target.value)
                                );
                            }}
                        />
                        <Divider mt="sm" variant="dashed" />
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={50} p="xs">
                    <Container>
                        <b>p-adic Calculator</b>
                    </Container>
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            })}
        >
            <Tabs color="teal" defaultValue="basic-info">
                <Tabs.List>
                    <Tabs.Tab value="basic-info">Basic Info</Tabs.Tab>
                    <Tabs.Tab value="calculator">Calculator</Tabs.Tab>
                    <Tabs.Tab value="about-padics">
                        About <InlineMath>p</InlineMath>-adics
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="basic-info">
                    <Container p="sm">
                        <BasicInfo />
                    </Container>
                </Tabs.Panel>
                <Tabs.Panel value="calculator">
                    <ScrollArea.Autosize>
                        <Container p="sm">
                            <Calculator />
                        </Container>
                    </ScrollArea.Autosize>
                </Tabs.Panel>
                <Tabs.Panel value="about-padics">
                    <ScrollArea>
                        <Container p="sm">
                            <AboutPadics />
                        </Container>
                    </ScrollArea>
                </Tabs.Panel>
            </Tabs>
            {/*       <Tabs color="teal" defaultValue="basic-info">
                    <Tabs.List>
                        <Tabs.Tab value="basic-info">Basic Info</Tabs.Tab>
                        <Tabs.Tab value="calculator">Calculator</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
                <Tabs.Panel value="basic-info">
                    <BasicInfo />
                </Tabs.Panel>
          <Tabs.Panel value="calculator">Calculator</Tabs.Panel>*/}
        </AppShell>
        /*
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>*/
    );
}

export default App;
