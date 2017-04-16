import "../TestHelper";
import * as Path from "path";
import {Config} from "../../src/config/decorator/Config";
import {Value} from "../../src/config/decorator/Value";
import {DIContainer} from "../../src/di/DIContainer";
import {ConfigException} from "../../src/config/error/ConfigException";


describe("[Integration] Config", () => {

    const path = Path.resolve(process.cwd(), "test/fixture/application.json");

    @Config(path)
    class BaseConfig {

        @Value("application.db")
        public propertyDb: string;

        constructor(@Value("application.db") public paramDb: string) {
        }
    }

    it('should load value from config file to config class property', () => {
        const baseConfig = DIContainer.get(BaseConfig);
        baseConfig.propertyDb.should.be.equal("redis");
    });

    it('should load value from config file to config class parameter', () => {
        const baseConfig = DIContainer.get(BaseConfig);
        baseConfig.paramDb.should.be.equal("redis");
    });

    it('should throw ConfigException when property should return a non-basic type', () => {
        (() => {

            class ATypeClass {
            }

            @Config(path)
            class AErrorConfig {

                @Value("propertyDb")
                public newType: ATypeClass;
            }
        }).should.throw(ConfigException);
    });

    it('should throw ConfigException when Config receive a non-json file', () => {
        (() => {
            @Config("a.txt")
            class AError2Config {
            }
        }).should.throw(ConfigException);

    });
});