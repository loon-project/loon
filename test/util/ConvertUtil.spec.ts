import "../TestHelper";
import {ConvertUtil} from "../../src/util/ConvertUtil";
import {expect} from 'chai';


describe('ConvertUtil', () => {
    it('should convert Array to a Map', () => {
        const original = ['a', 'b', 'c'];
        const result = ConvertUtil.convertArrayToMap(original);
        result.forEach((item, index) => {
            expect(original[index] === item).to.be.true;
        });
    });
});
