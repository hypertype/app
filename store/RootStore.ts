import {ObservableStore} from './ObservableStore';
import {Action, applyMiddleware, Middleware, StoreEnhancer} from 'redux';
import {ActionsObservable, createEpicMiddleware} from './redux-observable';
import {
    catchError,
    filter,
    Fn,
    map,
    mergeMap,
    NEVER,
    Observable, shareReplay,
    Subject
} from "@hypertype/core"
import {BaseStore} from './BaseStore';
import {Store} from "./store";
import {composeWithDevTools} from "redux-devtools-extension";

/**
 * Created by xamidylin on 20.06.2017.
 */
export class RootStore extends ObservableStore<any> {
    protected store: Store<any>;
    private compose: any;

    constructor(store: Store<any>, useDevTools = false) {
        super(null, null);
        this.store = store;
        this.compose = useDevTools ? composeWithDevTools : Fn.I;
    }

    private _epicRegistrator;

    protected get epicRegistrator() {
        return this._epicRegistrator;
    }

    public selector = x => x;

    public initStore(state?: any): Store<any> {
        if (state)
            this.dispatch({
                type: 'newState',
                payload: state
            });
        return this.store;
    }

    public createStore(state?: any): Store<any> {
        // if (this.store) {
        //     if (state)
        //         this.dispatch({
        //             type: 'newState',
        //             payload: state
        //         });
        //     return this.store;
        // }
        console.log('store');
        const epicMiddleware = createEpicMiddleware();
        this.store.provide(this.combinedReducer,
            state,
            this.compose(applyMiddleware(
                epicMiddleware,
                this.getLogMiddleware(),
                ...this.getOtherMiddlewares()))
        );
        epicMiddleware.run(this.epic$);
        // state && state.History && state.History.forEach(this.ngRedux.dispatch);
        return this.store;
    }

    public dispatch<A extends Action>(a: A) {
        return this.store.dispatch(a);
    }

    public getState() {
        return this.store.getState();
    }

    public getLogMiddleware() {
        return store => next => action => {
            // global['actions'] = [action, ...(global['actions'] || [])];
            // global['state'] = store.getState();
            return next(action);
        };
    }

    public getOtherMiddlewares(): Middleware[] {
        return [];
    }

    //to convert actions deep-out hierarchy of stores
    private upgradeActions(action$: Observable<Action>, path) {
        return action$.pipe(
            map(a => Object.assign({}, a, {
                type: `${path}.${a.type}`
            }))
        );
    }

    //to convert actions deep-into hierarchy of stores
    private downgradeActions(action$: Observable<Action>, path) {
        return action$.pipe(
            filter(a => a.type.startsWith(path)),
            map(a => Object.assign({}, a, {
                type: a.type.substr((path.length || -1) + 1)
            }))
        );
    }

    private epic$ = (action$: ActionsObservable<any>) => {
        const actionSubject = new Subject<Observable<any>>();
        //replay actions for epics dynamically loaded in future
        const replayActions$ = action$.pipe(shareReplay());
        replayActions$.subscribe();
        this._epicRegistrator = (epic, store: BaseStore<any>) => {
            const path = store.path.join('.');
            const downgraded = this.downgradeActions(replayActions$, path);
            const result = epic(downgraded, store);
            const upgraded = this.upgradeActions(result, path);
            const catched = upgraded.pipe(
                catchError(e => {
                    console.log(e);
                    return NEVER;
                }));
            return actionSubject.next(catched);
        };
        for (let key in this.StoresMap) {
            this.epicRegistrator(this.StoresMap[key].epic.epic$, this.StoresMap[key]);
        }
        this.epicRegistrator(this.epic.epic$, this);
        return actionSubject.asObservable().pipe(mergeMap(x => x));
    };
}
