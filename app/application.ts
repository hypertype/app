import {Container} from "@hypertype/core";
import {init} from "@hypertype/ui";
import {RootStore} from "../store";

export class Application {

    constructor(container: Container, rootStore: RootStore) {
        init(container);
        rootStore.createStore()
    }

}