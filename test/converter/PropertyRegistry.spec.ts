import "../TestHelper";
import {expect} from "chai";
import {Property} from "../../src/converter/decorator/Property";
import {PropertyRegistry} from "../../src/converter/PropertyRegistry";
import {IConverter} from "../../src/converter/interface/IConverter";
import {Service} from "../../src/mvc/decorator/Service";
import {DependencyRegistry} from "../../src/di/DependencyRegistry";


describe("PropertyRegistry", () => {

    @Service()
    class ATestConverter {

    }

    const converter = DependencyRegistry.get(ATestConverter);

    class JsonPropertyRegistryTestClass {

        @Property()
        private name: string;

        @Property("created_at")
        private createdAt: Date;

        @Property({name: "updated_at"})
        private updatedAt: Date;

        @Property({converter: ATestConverter})
        private converter: string;

        @Property({name: "is_flag", converter: ATestConverter})
        private isFlag: boolean;

        @Property({serialize: false})
        private serializeFalse: boolean;

        @Property({deserialize: false})
        private deserializeFalse: boolean;
    }

    it('should register json property', () => {

        assertProperty({
            klassProperty: 'name',
            objectProperty: 'name',
            propertyType: String,
            serialize: true,
            deserialize: true
        });
    });

    it('should register json property with different name', () => {

        assertProperty({
            klassProperty: 'createdAt',
            objectProperty: 'created_at',
            propertyType: Date,
            serialize: true,
            deserialize: true
        });
    });

    it('should register json property with name options', () => {

        assertProperty({
            klassProperty: 'updatedAt',
            objectProperty: 'updated_at',
            propertyType: Date,
            serialize: true,
            deserialize: true
        });
    });

    it('should register property with converter options', () => {

        assertProperty({
            klassProperty: 'converter',
            objectProperty: 'converter',
            propertyType: String,
            converter: converter,
            serialize: true,
            deserialize: true
        });
    });

    it('should register property with name and converter options', () => {

        assertProperty({
            klassProperty: 'isFlag',
            objectProperty: 'is_flag',
            propertyType: Boolean,
            converter: converter,
            serialize: true,
            deserialize: true
        });
    });

    it('should register property with serialize options', () => {

        assertProperty({
            klassProperty: 'serializeFalse',
            objectProperty: 'serializeFalse',
            propertyType: Boolean,
            serialize: false,
            deserialize: true
        });
    });

    it('should register property with deserialize options', () => {

        assertProperty({
            klassProperty: 'deserializeFalse',
            objectProperty: 'deserializeFalse',
            propertyType: Boolean,
            serialize: true,
            deserialize: false
        });
    });


    interface PropertyAssertResult {
        klassProperty: string;
        objectProperty: string;
        propertyType: Function;
        serialize: boolean;
        deserialize: boolean;
        converter?: IConverter;
    }

    function assertProperty(result: PropertyAssertResult) {

        const properties: any = PropertyRegistry.properties.get(JsonPropertyRegistryTestClass);

        expect(properties).not.to.be.undefined;

        const metadata = properties.find(metadata => metadata.klassProperty === result.klassProperty);

        expect(metadata).not.to.be.undefined;

        expect(metadata.klassProperty).to.be.equal(result.klassProperty);
        expect(metadata.objectProperty).to.be.equal(result.objectProperty);
        expect(metadata.propertyType).to.be.equal(result.propertyType);
        expect(metadata.serialize).to.be.equal(result.serialize);
        expect(metadata.deserialize).to.be.equal(result.deserialize);

        if (typeof result.converter !== 'undefined') {
            expect(metadata.converter).to.be.equal(result.converter);
        }
    }
});

