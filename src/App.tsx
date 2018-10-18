import * as React from 'react';
import './App.css';
import { connect } from "react-redux"
import {  SitkaInstance } from "./index"

import { AppState, TestState, sitka, Sitka, SitkaModules } from "./sitka"

class ChildComponent extends React.Component<TestState, {}> {
    constructor(props: TestState) {
        super(props)
    }
    public render() {
        return (
            <div>
                <div>{JSON.stringify(this.props, null, 4)}</div>
                <button onClick={() => {
                    SitkaInstance.getModules().test.handleIncrementCount()}
                }>Click</button>
            </div>
        )
    }
}

interface AppProps {}

class App extends React.Component<AppProps> {
  public render() {
    return (
        <ChildComponent />
    );
  }
}

// export default App
const mapStateToProps = (
    state: AppState,
): AppState => {
    return state
}


export default connect(mapStateToProps, null)(App);
