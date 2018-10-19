import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, ReducersMapObject } from "redux"
import createSagaMiddleware from "redux-saga"
import { applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { call, takeEvery } from "redux-saga/effects"
import { createLogger } from "redux-logger"
import { sitka, SitkaMeta, OtherState, otherDefaultState } from "./sitka"

export const SitkaInstance = sitka

const meta: SitkaMeta = SitkaInstance.createSitkaMeta()
const logger = createLogger({
    stateTransformer: (state: any) => state,
})
const sagaMiddleware = createSagaMiddleware()
const middleware = [logger, sagaMiddleware]

/////////////////////////////////////////////////////////
// BESPOKE ACTIONS  

export interface ColorAction {
    readonly type: "SET_COLOR",
    readonly color: string,
}

export interface BeerAction {
    readonly type: "SET_BEER",
    readonly beer: string,
}

export const actions = {
    setColor: (color: string) => ({
        type: "SET_COLOR",
        color,
    }),
    setBeer: (beer: string) => ({
        type: "SET_BEER",
        beer,
    }),
    bootstrap: () => ({
        type: "BOOTSTRAP",
    }),
}

type Actions = ColorAction | BeerAction

/////////////////////////////////////////////////////////
// BESPOKE REDUCERS  

const otherReducers: ReducersMapObject = {
    other: (state: OtherState = otherDefaultState, action: Actions): OtherState => {
        switch (action.type) {
            case "SET_COLOR":
                return {
                    ...state,
                    color: action.color,
                }
            case "SET_BEER":
                return {
                    ...state,
                    beer: action.beer,
                }
        default:
            return state
        }
    }
}

export const store = createStore(
    combineReducers({...meta.reducersToCombine, ...otherReducers}),
    applyMiddleware(...middleware),
)

function* bootstrap(): IterableIterator<{}> {
    console.log("BOOTSTRAPPED!")
}

function* root(): IterableIterator<{}> {
    yield [
        takeEvery("BOOTSTRAP", bootstrap),
    ]
    yield call(meta.sagaRoot)
}
sagaMiddleware.run(root)

SitkaInstance.setStore(store)
// const store = SitkaInstance.createStore()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
