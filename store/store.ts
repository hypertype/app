import {createStore, Store as ReduxStore} from 'redux';
import {Observable} from "@hypertype/core";
import {StateLogger} from '@hypertype/infr';

export class Store<TState> {
    constructor(private stateLogger: StateLogger) {

    }

    private store: ReduxStore;

    dispatch(action) {
        this.store.dispatch(action);
        this.stateLogger.send(action, this.getState())
    }

    provide(reducer, initState, middlewares) {
        this.store = createStore(reducer, initState, middlewares)
    }

    getState(): TState {
        return this.store.getState() as TState;
    }

    select<RState>(selector: (state: TState) => RState): Observable<RState> {
        return new Observable(subscr =>{
            subscr.next(selector(this.getState()));
            this.store.subscribe(() => {
                subscr.next(selector(this.getState()));
            })
        })
    }
}
