import * as React from "react"
import { connect } from "react-redux"
import { SitkaInstance } from "./index"

import { AppState, TestState } from "./sitka"

class ChildComponent extends React.Component<TestState, null> {
    public render() {
        return (
            <React.Fragment>
                <div>Count: {this.props.count}</div>
                <div>Food: {this.props.food}</div>
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

const ConnectedApp: React.ComponentClass<{}> = connect(
    (state: AppState): TestState => {
        return state.test
    },
    null,
)(ChildComponent)

export default ConnectedApp