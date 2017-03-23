import "../TestHelper";
import {Converter} from "../../src/converter/Converter";

describe("Converter", () => {

    class User {

        id: number;

        name: string;

        isAdmin: boolean;
    }

    const data1 = {
        id: 1,
        name: 'Jack',
        isAdmin: true
    };

    const data2 = {
        uuid: 1,
        name: 'Jack',
        is_admin: true
    };

    const template = {
        uuid: 'id',
        is_admin: 'isAdmin'
    };

    const classTemplate = {
        id: 'uuid',
        isAdmin: 'is_admin'
    };

    const user = new User();
    user.id = 1;
    user.name = 'Jack';
    user.isAdmin = true;


    it('should successfully convert js object to class', () => {
        const converter = new Converter({returnType: User});
        const user = converter.convert(data1);

        user.id.should.be.equal(1);
        user.name.should.be.equal('Jack');
        user.isAdmin.should.be.true;
    });

    it('should successfully convert js object to class with template', () => {
        const converter = new Converter({
            returnType: User,
            template: template
        });

        const user = converter.convert(data2);

        user.id.should.be.equal(1);
        (typeof user.name === 'undefined').should.be.true;
        user.isAdmin.should.be.true;
    });

    it('should successfully convert class to js object', () => {
        const converter = new Converter();

        const ret = converter.convert(user);

        ret.id.should.be.equal(1);
        ret.name.should.be.equal('Jack');
        ret.isAdmin.should.be.true;
    });

    it('should successfully convert class to js object with template', () => {
        const converter = new Converter({
            template: classTemplate
        });

        const ret = converter.convert(user);

        ret.uuid.should.be.equal(1);
        (typeof ret.name === 'undefined').should.be.true;
        ret.is_admin.should.be.true;
    });

});