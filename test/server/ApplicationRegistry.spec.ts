import "../TestHelper";
import {ApplicationRegistry} from "../../src/server/ApplicationRegistry";
import {SettingOptions} from "../../src/server/SettingOptions";
import {expect} from 'chai';

describe("ApplicationRegistry", () => {

    it('should register application with SettingOptions', () => {

        class Test1Application {

        }

        const options = <SettingOptions>{rootDir: 'value'};

        ApplicationRegistry.registerWithOptions(Test1Application, options);

        expect(ApplicationRegistry.settings).to.be.equal(options);
    });

});

