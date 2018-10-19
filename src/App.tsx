import * as React from "react"
import "./App.css"
import { connect } from "react-redux"
import { SitkaInstance } from "./index"

import { AppState, TestState, sitka, Sitka, SitkaModules } from "./sitka"

class ChildComponent extends React.Component<AppState, {}> {
    public render() {
        /* tslint:disable */
        debugger
        /* tslint:enable */
        return (
            <div>
                <div>{JSON.stringify(this.props, null, 4)}</div>
                <button
                    onClick={() => {
                        SitkaInstance.getModules().test.handleIncrementCount()
                    }}>
                    Click
                </button>
            </div>
        )
    }
}


// export type ReduxProps = {
//     readonly test: TestState
//     readonly test2: Test2State
//     readonly test3: Test3State
//     // readonly dispatch: {}
// }

interface AppProps {
    // readonly sitka: Sitka
    // readonly test: TestState
}

class App extends React.Component<{}, {}> {
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