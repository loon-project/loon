import {Controller} from "./Controller";
import * as Koa from "koa";

export class Action {

    public controller: Controller;
    public httpMethod: string;
    public route: string|RegExp;

}