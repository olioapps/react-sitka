import * as React from "react"
import ChildComponent from "./child_component"

class App extends React.Component<{}, {}> {
    public render() {
        return <ChildComponent />
    }
}

export default App