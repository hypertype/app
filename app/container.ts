import {Container} from "@hypertype/core";
import {Application} from "./application";
import {Logger} from "./logger";
import {RootStore} from "../store";

export const AppContainer = new Container();

AppContainer.provide([
    // {provide: AppRoot, multiple: true},
    {provide: Application, deps: [Container, RootStore]},
    {provide: Logger}
]);
