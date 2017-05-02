import "../TestHelper";
import {TypeUtil} from "../../src/util/TypeUtil";
import {expect} from 'chai';


describe('TypeUtil', () => {

    it('should check is simple type or not', () => {

        class ATestComplexClass {}

        expect(TypeUtil.isSimpleType(String)).to.be.true;
        expect(TypeUtil.isSimpleType(Number)).to.be.true;
        expect(TypeUtil.isSimpleType(Boolean)).to.be.true;
        expect(TypeUtil.isSimpleType(Object)).to.be.true;
        expect(TypeUtil.isSimpleType(ATestComplexClass)).to.be.false;
    });
});