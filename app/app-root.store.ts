import {RootStore, Store} from "../store";

export class AppRootStore extends RootStore{
    constructor() {
        super(new Store(), true);
    }

}