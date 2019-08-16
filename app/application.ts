import {Container, Injectable, Provider} from "@hypertype/core";
import {init} from "@hypertype/ui";

@Injectable()
export class Application {

    constructor(private container: Container) {
    }


    public Init(){
        init(this.container);
    }

    public Provide(provider: Provider){
        this.container.provide(provider);
    }

    public get<T>(type){
        return this.container.get<T>(type);
    }
}
