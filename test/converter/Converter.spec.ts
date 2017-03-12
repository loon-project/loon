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
        const converter = new Converter(data1, {returnType: User});
        const user = converter.convert();

        user.id.should.be.equal(1);
        user.name.should.be.equal('Jack');
        user.isAdmin.should.be.true;
    });

    it('should successfully convert js object to class with template', () => {
        const converter = new Converter(data2, {
            returnType: User,
            template: template
        });

        const user = converter.convert();

        user.id.should.be.equal(1);
        user.name.should.be.equal('Jack');
        user.isAdmin.should.be.true;
    });

    it('should successfully convert class to js object', () => {
        const converter = new Converter(user);

        const ret = converter.convert();

        ret.id.should.be.equal(1);
        ret.name.should.be.equal('Jack');
        ret.isAdmin.should.be.true;
    });

    it('should successfully convert class to js object with template', () => {
        const converter = new Converter(user, {
            template: classTemplate
        });

        const ret = converter.convert();

        ret.uuid.should.be.equal(1);
        ret.name.should.be.equal('Jack');
        ret.is_admin.should.be.true;
    });

});