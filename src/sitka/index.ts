// import { Store } from "redux"
import { call, put, select } from "redux-saga/effects"
import { ConnectedClass, ConnectedClassAction, Sitka } from "./sitka"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface TestState {
    readonly count: number
    readonly food: string
}

class Test extends ConnectedClass<TestState, Sitka<SitkaModules, AppState>> {

    moduleName = (): string => "test"

    defaultState = (): TestState => ({
        count: 0,
        food: "",
    })

    // reducer-facing actions should be private
    private setCount(a: number, b: number): ConnectedClassAction<TestState> {
        return this.createAction({
            count: a + b,
        })
    }

    private setBigCount(): ConnectedClassAction<TestState> {
        return this.createAction({
            count: 1000,
        })
    }

    private setFood(food: string): ConnectedClassAction<TestState> {
        return this.createAction({
            food,
        })
    }

    private getCount(state: AppState): number {
        return state.test.count
    }

    *handleCount(a: number, b: number): IterableIterator<{}> {
        yield put(this.setCount(a, b))
        yield put(this.setFood("sphagetti"))
    }

    *handleIncrementCount(): IterableIterator<{}> {
        const currentCount: number = yield select(this.getCount, this.reduxKey())
        yield put(this.setCount(currentCount, 1))

        // call another module's action creator directly
        yield put(this.sitka.getModules().test3.setDayClear())
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface Test2State {
    readonly pet: string
}

class Test2 extends ConnectedClass<Test2State, Sitka<SitkaModules, AppState>> {

    moduleName = (): string => "test2"

    defaultState = (): Test2State => ({
        pet: "",
    })

    private setPet(pet: string): ConnectedClassAction<Test2State> {
        return this.createAction({pet})
    }
    
    *handlePet(name: string): IterableIterator<{}> {
        yield put(this.setPet(name))

        // call another module's saga
        yield call(this.sitka.getModules().test3.handleDay, "MONDAY")
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface Test3State {
    readonly day: string
}

class Test3 extends ConnectedClass<Test3State, Sitka<SitkaModules, AppState>> {

    moduleName = (): string => "test3"

    defaultState = (): Test3State => ({
        day: "",
    })

    private setDay(day: string): ConnectedClassAction<Test3State> {
        return this.createAction({day})
    }

    setDayClear(): ConnectedClassAction<Test3State> {
        return this.createAction({day: this.defaultState().day})
    }
    
    *handleDay(day: string): IterableIterator<{}> {
        yield put(this.setDay(day))
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface SitkaModules {
    readonly test?: Test
    readonly test2?: Test2
    readonly test3?: Test3
}

export interface AppState {
    readonly test: TestState
    readonly test2: Test2State
    readonly test3: Test3State
}

const sitka = new Sitka<SitkaModules, AppState>()

sitka.register(new Test())
sitka.register(new Test2())
sitka.register(new Test3())

const store: any = sitka.createStore()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

console.log("BEFORE", store.getState())

const { test, test2 } = sitka.getModules()

test.handleCount(130, 120)
test2.handlePet("Marz")
console.log("AFTER", store.getState())

test2.handlePet("ZARBS")
console.log("AFTER", store.getState())

test2.handlePet("glorbs")
test.handleCount(2, 120)
console.log("AFTER", store.getState())

test.handleIncrementCount()
console.log("AFTER", store.getState())
test.handleIncrementCount()
console.log("AFTER", store.getState())
test.handleIncrementCount()
console.log("AFTER", store.getState())
test.handleIncrementCount()
console.log("AFTER", store.getState())
test.handleIncrementCount()
console.log("AFTER", store.getState())

const modules = sitka.getModules()
console.log(modules)

export {
    store,
    modules,
    sitka,
    SitkaModules,
    Sitka,
    TestState,
}