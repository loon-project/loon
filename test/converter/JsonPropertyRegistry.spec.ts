import "../TestHelper";
import {JsonPropertyRegistry} from "../../src/converter/JsonPropertyRegistry";
import {JsonProperty} from "../../src/converter/decorator/JsonProperty";
import {expect} from 'chai';

describe("JsonPropertyRegistry", () => {

    class JsonPropertyRegistryTestClass {

        @JsonProperty()
        private name: string;

        @JsonProperty("created_at")
        private createdAt: Date;

        @JsonProperty({name: "updated_at"})
        private updatedAt: Date;

        @JsonProperty({name: "is_flag", returnType: String})
        private isFlag: boolean;

    }

    it('should register json property', () => {

        const jsonSource: any = JsonPropertyRegistry.jsonSources.get(JsonPropertyRegistryTestClass);

        expect(jsonSource).not.be.undefined;
        expect(jsonSource.properties).not.be.undefined;

        const jsonProperty: any = jsonSource.properties.get('name');

        expect(jsonProperty).not.be.undefined;
        expect(jsonProperty.type).to.equal(JsonPropertyRegistryTestClass);
        expect(jsonProperty.name).to.equal('name');
        expect(jsonProperty.returnType).to.equal(String);
    });

});

