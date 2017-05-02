import "../TestHelper";
import {Filter} from "../../src/mvc/decorator/Filter";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {FilterRegistry} from "../../src/mvc/FilterRegistry";
import {expect} from 'chai';

describe("FilterRegistry", () => {

    @Filter()
    class CurrentUserFilter implements IMiddleware {

        public use() {
        }
    }

    it('should successfully register a filter', () => {

        const filterMetadata: any = FilterRegistry.filters.get(CurrentUserFilter);

        expect(filterMetadata.type).to.be.equal(CurrentUserFilter);
        expect(filterMetadata.handler).to.not.be.undefined;
    });
});
