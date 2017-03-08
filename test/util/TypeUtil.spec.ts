import "../TestHelper";
import {TypeUtil} from "../../src/util/TypeUtil";


describe('TypeUtil', () => {

    it('should check is simple type or not', () => {

        class ATestComplexClass {}

        TypeUtil.isSimpleType(String).should.be.true;
        TypeUtil.isSimpleType(Number).should.be.true;
        TypeUtil.isSimpleType(Boolean).should.be.true;
        TypeUtil.isSimpleType(Object).should.be.true;
        TypeUtil.isSimpleType(ATestComplexClass).should.be.false;
    });
});