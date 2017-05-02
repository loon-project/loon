import "../TestHelper";
import {expect} from 'chai';
import {ApplicationSettings} from "../../src/server/decorator/ApplicationSettings";
import {ApplicationRegistry} from "../../src/server/ApplicationRegistry";


describe("ApplicationSettings", () => {


    it("init application with ApplicationSettings", () => {

        const options = {rootDir: ".."};

        @ApplicationSettings(options)
        class TestApplication {
        }

        expect(ApplicationRegistry.settings).to.be.deep.equal(options);
    });
});

