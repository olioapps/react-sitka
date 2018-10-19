import * as React from "react"
import { connect } from "react-redux"
import * as redux from "redux"
import { SitkaInstance, actions } from "./index"
import { OtherState } from "./sitka"

import { AppState, TestState } from "./sitka"

interface ReduxActions {
    readonly setColor: (color: string) => void
}
interface ComponentState {
    test: TestState,
    other: OtherState,
}

class ChildComponent extends React.Component<ComponentState & ReduxActions, {}> {
    public render() {
        return (
            <React.Fragment>
                <div>Count: {this.props.test.count}</div>
                <div>Food: {this.props.test.food}</div>
                <div>Color: {this.props.other.color}</div>
                <div>Beer: {this.props.other.beer}</div>
                <button
                    onClick={() => {
                        SitkaInstance.getModules().test.handleIncrementCount()
                    }}>
                    Increment
                </button>
                <button
                    onClick={() => {
                        this.props.setColor(`red - ${new Date().getTime()}`)
                    }}>
                    Set Color
                </button>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<{}>): ReduxActions => ({
    setColor: (color: string) => dispatch( actions.setColor(color) ),
})

const ConnectedApp: React.ComponentClass<{}> = connect(
    (state: AppState): ComponentState => {
        return {
            test: state.test,
            other: state.other,
        }
    },
    mapDispatchToProps,
)(ChildComponent)

export default ConnectedApp