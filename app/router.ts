import createRouter, {Options, Route, RouteNode, Router as Router5} from 'router5';
import * as browserPlugin from 'router5-plugin-browser/dist';
import {Observable, startWith, tap} from "@hypertype/core";

export class IRouterOptions {
    routes: Route[] | RouteNode;
    options: Options;
}

export class Router {
    private router: Router5;

    constructor(routerInit: IRouterOptions){
        this.router = createRouter(routerInit.routes, routerInit.options);
        this.router.usePlugin(browserPlugin());
        this.router.start();
    }

    public State$ = new Observable(subscr => {
        this.router.subscribe(change => subscr.next(change.route))
    }).pipe(
        startWith(this.router.getState()),
        tap(console.warn)
    );

    public Actions: {
        [K in keyof IRouteActions]: (...args: any[]) => void;
    } = {
        navigate(route: string) {
            console.log(route)
            this.router.navigate(route);
        }
    }
}

export interface IRouteActions {
    navigate(route: string);
}