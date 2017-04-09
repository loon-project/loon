import "../TestHelper";
import {JsonProperty} from "../../src/converter/decorator/JsonProperty";


describe('ConverterService', () => {

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




});