import {Container} from "@hypertype/core";
import {AppRootStore} from "./app-root.store";
import {Application} from "./application";
import {Logger} from "./logger";
import {RootStore} from "../store";

export const AppContainer = new Container();

AppContainer.provide([
    // {provide: AppRoot, multiple: true},
    {provide: RootStore, useClass: AppRootStore},
    {provide: Application, deps: [Container, RootStore]},
    {provide: Logger}
]);
