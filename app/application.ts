import {Container} from "@hypertype/core";
import {init} from "@hypertype/ui";
import {RootStore} from "../store";

export class Application {

    constructor(private container: Container, rootStore: RootStore) {
        init(container);
        rootStore.createStore()
    }


    public get<T>(type){
        return this.container.get<T>(type);
    }
}
