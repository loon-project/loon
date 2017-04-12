import "../TestHelper";
import {JsonProperty} from "../../src/converter/decorator/JsonProperty";
import {Convert} from "../../src/converter/decorator/Convert";
import {IConverter} from "../../src/converter/interface/IConverter";
import {ConverterService} from "../../src/converter/ConverterService";


describe('ConverterService', () => {

    const converterService = new ConverterService();

    @Convert(String)
    class StringConvertTestClass implements IConverter {

    }

    class Member {

    }


    class ConverterServiceTargetTestClass {

        @JsonProperty()
        private a: number;

        @JsonProperty("created_at")
        private createdAt: Date;


        @JsonProperty({name: "updated_at", returnType: String})
        private updatedAt: Date;


        @JsonProperty()
        private members: Member[];

    }

    it('should successfully convert class to target class', () => {

        const data = {
            "created_at": new Date()
        };

        const result: any = converterService.deserialize(data, ConverterServiceTargetTestClass);

        (result instanceof ConverterServiceTargetTestClass).should.be.true;

        (result.a instanceof Number).should.be.true;
        (result.createdAt instanceof Date).should.be.true;
        (result.updatedAt instanceof String).should.be.true;
        (result.members instanceof Array).should.be.true;

    });




});