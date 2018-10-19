import * as React from "react"
import "./App.css"
import { connect } from "react-redux"
import { SitkaInstance } from "./index"

import { AppState, TestState, Test2State, Test3State, sitka, Sitka, SitkaModules } from "./sitka"

class ChildComponent extends React.Component<AppState, {}> {
    public render() {
        return (
            <React.Fragment>
                <div>{JSON.stringify(this.props, null, 4)}</div>,
                <button
                    onClick={() => {
                        SitkaInstance.getModules().test.handleIncrementCount()
                    }}>
                    Click
                </button>,
            </React.Fragment>
        )
    }
}


// export type ReduxProps = {
//     readonly test: TestState
//     readonly test2: Test2State
//     readonly test3: Test3State
//     // readonly dispatch: {}
// }

interface AppProps {}
type ComponentProps = AppProps & AppState

class App extends React.Component<ComponentProps, {}> {
    public render() {
        return <ChildComponent {...this.props} />
    }
}

// export default App
const mapStateToProps = (state: AppState): AppState => {
    return state
}

// export default connect(
//     mapStateToProps,
//     null,
// )(App)
const ConnectedApp: React.ComponentClass<AppProps> = connect(
    mapStateToProps,
    null,
)(App)

export default ConnectedApp