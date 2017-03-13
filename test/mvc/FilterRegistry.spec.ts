import "../TestHelper";
import {Filter} from "../../src/mvc/decorator/Filter";
import {IMiddleware} from "../../src/mvc/interface/IMiddleware";
import {FilterRegistry} from "../../src/mvc/FilterRegistry";

describe("FilterRegistry", () => {

    @Filter()
    class CurrentUserFilter implements IMiddleware {

        public use() {
        }
    }

    it('should successfully register a filter', () => {

        const filterMetadata: any = FilterRegistry.filters.get(CurrentUserFilter);

        filterMetadata.should.not.be.undefined;
        filterMetadata.type.should.be.equal(CurrentUserFilter);
        filterMetadata.handler.should.not.undefined;
    });
});
