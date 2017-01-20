import "../../TestHelper";
import * as Path from "path";
import {Config} from "../../../src/config/decorator/Config";
import {Value} from "../../../src/config/decorator/Value";
import {DIContainer} from "../../../src/di/DIContainer";


describe("Config", () => {

    const path = Path.resolve(process.cwd(), "example/application.json");

    @Config(path)
    class BaseConfig {

        @Value("db")
        public db: string;
    }


    it('should load value from config file to config class', () => {

        const baseConfig = DIContainer.get(BaseConfig);

        baseConfig.db.should.be.equal("mysql");
    });
});