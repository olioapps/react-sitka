import { Store, createStore, Action, combineReducers, ReducersMapObject } from "redux"
import createSagaMiddleware from "redux-saga"
import { applyMiddleware, Dispatch } from "redux"
import { takeEvery, all, apply } from "redux-saga/effects"
import { createLogger } from "redux-logger"

export type BaseMap<T = any> = { [key: string]: T }

export type ConnectedClassAction<T> = Partial<T> & { type: string }

export abstract class ConnectedClass<T extends BaseMap, X extends Sitka> {

    sitka: X

    abstract moduleName(): string

    // by default, the redux key is same as the moduleName
    reduxKey(): string {
        return this.moduleName()
    }

    abstract defaultState(): T

    createAction(v: Partial<T>): ConnectedClassAction<T> {
        return Object.assign({type: this.reduxKey()}, v)
    }
}

interface SagaMeta {
    readonly handler: any
    readonly name: string
}

interface SitkaAction extends Action {
    _instance: string,
    _args: any,
}

export class SitkaMeta {
    readonly sagaRoot: () => IterableIterator<{}> 
    readonly reducersToCombine: ReducersMapObject
}

export class Sitka<T = {}, A = {}> {
    private store: Store
    private sagaMiddleware: any
    private sagas: SagaMeta[] = []
    private reducersToCombine: ReducersMapObject = {}
    protected registeredModules: T

    constructor() {
        this.doDispatch = this.doDispatch.bind(this)
        this.root = this.root.bind(this)
        this.createStore = this.createStore.bind(this)
        this.registeredModules = <T> {}
    }

    setStore(store: Store) {
        this.store = store
    }

    getModules(): T {
        return this.registeredModules
    }

    getStore(): Store {
        return this.store
    }

    private *root(): IterableIterator<{}> {
        const toYield = []
        const { registeredModules } = this
        for ( let i = 0; i < this.sagas.length; i++) {
            const s = this.sagas[i]
            const generator = function* (action: any): {} {
                const instance = registeredModules[action._instance]
                yield apply(instance, s.handler, action._args)
            }
            toYield.push(yield takeEvery(s.name, generator))
        }
    
        yield all(toYield)
    }

    createSitkaMeta(): SitkaMeta {
        return {
            sagaRoot: this.root,
            reducersToCombine: this.reducersToCombine,
        }
    }

    createStore(): Store {
        const logger = createLogger({
            stateTransformer: (state: A) => state,
        })

        this.sagaMiddleware = createSagaMiddleware()
        const middleware = [this.sagaMiddleware, logger]
        this.store = createStore(
            combineReducers(this.reducersToCombine),
            applyMiddleware(...middleware),
        )

        this.sagaMiddleware.run(this.root)

        return this.store
    }

    register<F extends BaseMap, T extends ConnectedClass<F, this>>(instance: T): T {
        const methodNames = Sitka.getInstanceMethodNames(instance, Object.prototype)
        const setters = methodNames.filter( m => m.indexOf("set") == 0)
        const handlers = methodNames.filter( m => m.indexOf("handle") == 0)
        const moduleName = instance.moduleName()
        const { sagas, reducersToCombine, doDispatch: dispatch } = this

        instance.sitka = this

        handlers.forEach( s => {
            const original: Function = instance[s]
    
            function patched() {
                const args = arguments
                const action: SitkaAction = {
                    type: s,
                    _instance: moduleName,
                    _args: args,
                }
                
                dispatch(action)
            }
    
            sagas.push({
                name: s,
                handler: original,
            })
    
            instance[s] = patched
        })
    
        // create reducers for setters
        setters.forEach(s => {
            const reduxKey: string = instance.reduxKey()
            const defaultState = instance.defaultState()
    
            const makeReducer = (reduxKey: string) => {
                const prevReducer: (state: F, action: Action) => F = reducersToCombine[reduxKey]
    
                const reducer = (state: F = defaultState, action: Action): F => {
                     
                    if (action.type !== reduxKey) {
                        return state                    
                    }
    
                    // there was a previous reducer
                    // evaluate it
                    const previousReducerExisted: boolean = !!prevReducer
                    if (previousReducerExisted) {
                        const result = prevReducer(state, action)
                        if (result === defaultState) {
                            return state
                        }
                    }
                    
                    const newState: F = <F> Object.keys(action).filter( k => k !== "type")
                    .reduce(
                        (acc, k) => Object.assign(acc, {
                            [k]: action[k],
                        }),
                        Object.assign({}, state),
                    )
        
                    return newState
                }
    
                return reducer
            }
            
            reducersToCombine[reduxKey] = makeReducer(reduxKey)
        })
    
        this.registeredModules[moduleName] = instance

        return instance
    }
    
    private static hasMethod = (obj: {}, name: string) => {
        const desc = Object.getOwnPropertyDescriptor (obj, name)
        return !!desc && typeof desc.value === "function"
    }
    
    private static getInstanceMethodNames = (obj: {}, stop: {}) => {
        const array: string[] = []
        let proto = Object.getPrototypeOf (obj)
        while (proto && proto !== stop) {
            Object.getOwnPropertyNames (proto)
            .forEach (name => {
                if (name !== "constructor") {
                    if (Sitka.hasMethod (proto, name)) {
                        array.push (name)
                    }
                }
            })
            proto = Object.getPrototypeOf(proto)
        }
        return array
    }

    private doDispatch(action: Action): void {
        const store: Store = this.getStore()
        if (!!store) {
            store.dispatch(action)
        }
    }
}