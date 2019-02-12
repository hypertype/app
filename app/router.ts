import createRouter, {Options, Route, RouteNode, Router as Router5, State as RouterState} from 'router5';
import * as browserPlugin from 'router5-plugin-browser/dist';
import {Observable, startWith, tap} from "@hypertype/core";

export class IRouterOptions {
    routes: Route[] | RouteNode;
    options: Options;
}

export class Router {
    public State$: Observable<RouterState>;
    private router: Router5;
    public Actions: {
        [K in keyof IRouteActions]: (...args: any[]) => void;
    } = {
        navigate(route: string) {
            console.log(route)
            this.router.navigate(route);
        }
    };

    constructor(routerInit: IRouterOptions) {
        this.router = createRouter(routerInit.routes, routerInit.options);
        this.router.usePlugin(browserPlugin());
        this.router.start();
        this.State$ = new Observable(subscr => {
            this.router.subscribe(change => subscr.next(change.route))
        }).pipe(
            startWith(this.router.getState()),
            tap(console.warn)
        );
    }
}

export interface IRouteActions {
    navigate(route: string);
}