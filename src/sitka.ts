import { call, put, select } from "redux-saga/effects"
import { Aron2 } from "./aron"
import { ConnectedClass, Zitka as Sitka, SitkaMeta, Aron } from "./olio-sitka"

import { Action } from 'redux'

const aron = new Aron2()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface TestState {
    readonly count: number
    readonly food: string
}

export interface Test2State {
    readonly pet: string
}

export interface Test3State {
    readonly day: string
}

interface SitkaModules {
    readonly test: undefined
    // readonly test2: Test2
    // readonly test3: Test3
}

export interface AppState {
    readonly test: TestState
    readonly test2: Test2State
    readonly test3: Test3State
    readonly other: OtherState
}

// class Test extends ConnectedClass<TestState, Sitka<SitkaModules>> {

//     moduleName = (): string => "test"

//     defaultState = (): TestState => ({
//         count: 0,
//         food: "",
//     })

//     // reducer-facing actions should be private
//     private setCount(a: number, b: number): Action {
//         return this.createAction({
//             count: a + b,
//         })
//     }

//     private setBigCount(): Action {
//         return this.createAction({
//             count: 1000,
//         })
//     }

//     private setFood(food: string): Action {
//         return this.createAction({
//             food,
//         })
//     }

//     private getCount(state: AppState): number {
//         return state.test.count
//     }

//     *handleCount(a: number, b: number): IterableIterator<{}> {
//         yield put(this.setCount(a, b))
//         yield put(this.setFood("sphagetti"))
//     }

//     *handleIncrementCount(): IterableIterator<{}> {
//         const currentCount: number = yield select(this.getCount, this.reduxKey())
//         yield put(this.setCount(currentCount, 1))

//         // call another module's action creator directly
//         yield put(this.sitka.getModules().test3.setDayClear())
//     }
// }   

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// class Test2 extends ConnectedClass<Test2State, Sitka<SitkaModules>> {

//     moduleName = (): string => "test2"

//     defaultState = (): Test2State => ({
//         pet: "",
//     })

//     private setPet(pet: string): Action {
//         return this.createAction({pet})
//     }
    
//     *handlePet(name: string): IterableIterator<{}> {
//         yield put(this.setPet(name))

//         // call another module's saga
//         yield call(this.sitka.getModules().test3.handleDay, "MONDAY")
//     }
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// class Test3 extends ConnectedClass<Test3State, Sitka<SitkaModules>> {

//     moduleName = (): string => "test3"

//     defaultState = (): Test3State => ({
//         day: "",
//     })

//     private setDay(day: string): Action {
//         return this.createAction({day})
//     }

//     setDayClear(): Action {
//         return this.createAction({day: this.defaultState().day})
//     }
    
//     *handleDay(day: string): IterableIterator<{}> {
//         yield put(this.setDay(day))
//     }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface OtherState {
    readonly color: string
    readonly beer: string
}

export const otherDefaultState = {
    color: "",
    beer: "",
}

console.log("-->", Sitka)
const sitka = new Sitka<SitkaModules>()

// sitka.register(new Test())
// sitka.register(new Test2())
// sitka.register(new Test3())

// const modules = sitka.getModules()
// console.log(modules)

export {
    sitka,
    SitkaModules,
}