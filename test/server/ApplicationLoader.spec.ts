import "../TestHelper";
import {ApplicationRegistry} from "../../src/server/ApplicationRegistry";
import {SettingOptions} from "../../src/server/SettingOptions";
import {ApplicationLoader} from "../../src/server/ApplicationLoader";
import {IApplicationLifecycle} from "../../src/server/interface/IApplicationLifecycle";

describe("ApplicationLoader", () => {

    class TestApplication extends ApplicationLoader implements IApplicationLifecycle {

        private _initProperty: number;

        get initProperty() {
            return this._initProperty;
        }

        public $onInit(): any {
            this._initProperty = 1;
        }
    }

    it("should return the rootDir value", () => {

        const options = <SettingOptions>{rootDir: 'value1'};
        ApplicationRegistry.registerWithOptions(TestApplication, options);

        const applicationLoader = new ApplicationLoader();

        applicationLoader.rootDir.should.be.equal(options.rootDir);
    });

    it('should set default value', () => {

        const options = <SettingOptions>{rootDir: 'value2'};
        ApplicationRegistry.registerWithOptions(TestApplication, options);

        const applicationLoader = new ApplicationLoader();

        applicationLoader.rootDir.should.be.equal(options.rootDir);
        applicationLoader.srcDir.should.be.equal(`${options.rootDir}/src`);
        applicationLoader.publicDir.should.be.equal(`${options.rootDir}/public`);
        applicationLoader.logDir.should.be.equal(`${options.rootDir}/log`);
        applicationLoader.configDir.should.be.equal(`${options.rootDir}/config`);
        applicationLoader.dbDir.should.be.equal(`${options.rootDir}/db`);

        applicationLoader.port.should.be.equal(9000);

        applicationLoader.routes.should.be.deep.equal({});
        applicationLoader.components.should.be.deep.equal([]);

    });

    it('should call $onInit method', () => {

        const options = <SettingOptions>{rootDir: 'value2'};
        ApplicationRegistry.registerWithOptions(TestApplication, options);

        const application = new TestApplication();
        application
            .start()
            .then(() => {
                application.initProperty.should.be.equal(1);
            });
    });
});

