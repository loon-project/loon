import "../TestHelper";
import {expect} from 'chai';
import {ConverterService} from "../../src/converter/ConverterService";
import {ObjectProperty} from "../../src/converter/decorator/ObjectProperty";


describe('ConverterService', () => {

    const converter = new ConverterService();

    class ATestConverterClassTarget {

        @ObjectProperty()
        private name: string;

        @ObjectProperty("created_at")
        private createdAt: String;

        @ObjectProperty("updated_at")
        private updatedAt: Date;
    }


    it('should convert data to String', () => {

        assertAlot(String, [
            'aaa',
            [111, '111']
        ]);

    });

    it('should convert data to Number', () => {

        assertAlot(Number, [
            111
        ]);

    });

    it('should convert data to Boolean', () => {

        assertAlot(Boolean, [
            ['true', true],
            ['false', false],
            true, false,
            [1, true],
            [0, false]
        ]);

    });

    it('should convert data to Date', () => {

        const now = new Date();
        const nowString = now.toISOString();
        const nowNumber = now.getTime();

        assertAlot(Date, [
            now,
            [nowString, now],
            [nowNumber, now]
        ]);

    });

    it('should convert an object to a class instance', () => {

        const now = new Date();

        const obj = {
            name: "aName",
            created_at: now.toISOString(),
            updated_at: now.toISOString()
        };

        const ins = converter.convert(obj, ATestConverterClassTarget);

        expect(ins instanceof ATestConverterClassTarget).to.be.true;
        expect(ins.name).to.be.equal('aName');
        expect(ins.createdAt).to.be.equal(now.toISOString());
        expect(ins.updatedAt.getTime()).to.be.equal(now.getTime());
    });


    function assertAlot(type: Function, data: any[]) {

        data.forEach(item => {

            if (item instanceof Array) {
                const [input, output] = item;
                assertSerializeAndDeserialize(input, type, output);
            } else {
                assertSerializeAndDeserialize(item, type, item);
            }

        });
    }


    function assertSerializeAndDeserialize(input: any, type: Function, expectOutput: any) {

        if (type.name === 'Date') {
            expect(converter.convert(input, type).getTime()).to.be.equal(expectOutput.getTime());
        } else {
            expect(converter.convert(input, type)).to.be.equal(expectOutput);
        }


    }
});