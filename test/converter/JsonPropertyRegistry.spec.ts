import "../TestHelper";
import {expect} from "chai";
import {JsonPropertyRegistry} from "../../src/converter/JsonPropertyRegistry";
import {JsonProperty} from "../../src/converter/decorator/JsonProperty";
import {JsonPropertyMetadata} from "../../src/converter/JsonPropertyMetadata";


describe("JsonPropertyRegistry", () => {

    class ATestConverter {

    }

    class JsonPropertyRegistryTestClass {

        @JsonProperty()
        private name: string;

        @JsonProperty("created_at")
        private createdAt: Date;

        @JsonProperty({name: "updated_at"})
        private updatedAt: Date;

        @JsonProperty({name: "is_flag", type: String})
        private isFlag: boolean;

        @JsonProperty({converter: ATestConverter})
        private converter: string;
    }

    it('should register json property', () => {

        assertProperty({
            propertyName: 'name',
            propertyType: String,
            jsonName: 'name',
            jsonType: String
        });
    });

    it('should register json property with different name', () => {

        assertProperty({
            propertyName: 'createdAt',
            propertyType: Date,
            jsonName: 'created_at',
            jsonType: Date
        });
    });

    it('should register json property with name options', () => {

        assertProperty({
            propertyName: 'updatedAt',
            propertyType: Date,
            jsonName: 'updated_at',
            jsonType: Date
        });
    });

    it('should register json property with returnType options', () => {

        assertProperty({
            propertyName: 'isFlag',
            propertyType: Boolean,
            jsonName: 'is_flag',
            jsonType: String
        });
    });

    interface JsonPropertyAssertResult {
        propertyName: string;
        propertyType: Function;
        jsonName: string;
        jsonType: Function;
    }

    function assertProperty(result: JsonPropertyAssertResult) {

        const jsonProperties: any = JsonPropertyRegistry.jsonProperties.get(JsonPropertyRegistryTestClass);

        expect(jsonProperties).not.be.undefined;

        const jsonProperty: any = (<JsonPropertyMetadata[]> jsonProperties).find(item => item.propertyName === result.propertyName);

        expect(jsonProperty).not.be.undefined;
        expect(jsonProperty.type).to.equal(JsonPropertyRegistryTestClass);
        expect(jsonProperty.klassProperty).to.equal(result.propertyName);
        expect(jsonProperty.propertyType).to.equal(result.propertyType);
        expect(jsonProperty.objectProperty).to.equal(result.jsonName);
        expect(jsonProperty.jsonType).to.equal(result.jsonType);
    }
});

