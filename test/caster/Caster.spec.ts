import "../TestHelper";
import {Caster} from "../../src/caster/Caster";

describe("Caster", () => {

    it('should cast string to number', () => {
        const expect = 123;
        const result: any = Caster.cast("123", expect.constructor);
        result.should.be.equal(expect);
    });

    it('should cast true string to boolean', () => {
        const expect = true;
        const result: any = Caster.cast("true", expect.constructor);
        result.should.be.equal(expect);
    });

    it('should cast false string to boolean', () => {
        const expect = false;
        const result: any = Caster.cast("false", expect.constructor);
        result.should.be.equal(expect);
    });

    it('should cast string to string', () => {
        const expect = "test";
        const result: any = Caster.cast("test", expect.constructor);
        result.should.be.equal(expect);
    });

    it('should cast object to object', () => {
        const expect = {name: "Test"};
        const result: any = Caster.cast(expect, expect.constructor);
        result.should.be.deep.equal(expect);
    });

});