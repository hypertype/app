import {Container, Injectable} from "@hypertype/core";
import {init} from "@hypertype/ui";

@Injectable()
export class Application {

    constructor(private container: Container) {
        init(container);
    }


    public get<T>(type){
        return this.container.get<T>(type);
    }
}
