import {TypedApplicationOption} from "./server/TypedApplicationOption";
import {TypedApplication} from "./server/TypedApplication";

export function bootstrap<T extends TypedApplication>(T, options: TypedApplicationOption) {
     const app = new T(__dirname, options);
     app.start();
}

