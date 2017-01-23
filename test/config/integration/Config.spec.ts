import "../../TestHelper";
import * as Path from "path";
import {Config, Value} from '../../../src/index';
import {DIContainer} from "../../../src/di/DIContainer";
import {ConfigException} from "../../../src/config/error/ConfigException";


describe("Config", () => {

    const path = Path.resolve(process.cwd(), "test/fixture/application.json");

    @Config(path)
    class BaseConfig {

        @Value("db")
        public db: string;

        @Value("db", {env: false})
        public testDb: string;
    }

    it('should load value from config file to config class with env', () => {
        const baseConfig = DIContainer.get(BaseConfig);
        baseConfig.db.should.be.equal("mysql");
    });

    it('should load value from config file to config class without env', () => {
        const baseConfig = DIContainer.get(BaseConfig);
        baseConfig.testDb.should.be.equal("redis");
    });

    it('should throw ConfigException when property should return a non-basic type', () => {
        (() => {

            class ATypeClass {
            }

            @Config(path)
            class AErrorConfig {

                @Value("db")
                public newType: ATypeClass;
            }
        }).should.throw(ConfigException);
    });
});