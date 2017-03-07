import {RouterMetadata} from "./RouterMetadata";
import * as Express from 'express';

export class RouterRegistry {

    private static _routes: RouterMetadata[];

    /**
     * load router into {RouterRegistry} for later convert to {Express.Router}
     * @param path
     */
    public static loadRoutesForPath(path: string) {
    }



}
