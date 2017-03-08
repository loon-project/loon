import "../TestHelper";
import {ConvertUtil} from "../../src/util/ConvertUtil";


describe('ConvertUtil', () => {

    it('should convert Array to a Map', () => {

        const original = ['a', 'b', 'c'];
        const result = ConvertUtil.convertArrayToMap(original);

        result.forEach((item, index) => {
            (original[index] === item).should.be.true;
        });
    });

});
