import "../TestHelper";
import {ApplicationRegistry} from "../../src/server/ApplicationRegistry";
import {SettingOptions} from "../../src/server/interface/SettingOptions";
import {ApplicationLoader} from "../../src/server/ApplicationLoader";

describe("ApplicationLoader", () => {

    it("should after construct, set default settings", () => {

        const options = <SettingOptions>{rootDir: 'value'};
        ApplicationRegistry.registerWithOptions(options);

        const applicationLoader = new ApplicationLoader();

        options.rootDir = applicationLoader.rootDir;

        applicationLoader.rootDir.should.be.equal(options.rootDir);
    });

});

