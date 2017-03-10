import "../TestHelper";
import {ApplicationRegistry} from "../../src/server/ApplicationRegistry";
import {SettingOptions} from "../../src/server/SettingOptions";

describe("ApplicationRegistry", () => {

    it('should register application with SettingOptions', () => {

        const options = <SettingOptions>{rootDir: 'value'};

        ApplicationRegistry.registerWithOptions(options);

        ApplicationRegistry.settings.should.be.equal(options);
    });

});

