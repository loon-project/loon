import "../TestHelper";
import {Table} from "../../src/data/decorator/Table";
import {Column} from "../../src/data/decorator/Column";
import {EntityManager} from "../../src/data/EntityManager";

describe("EntityManager", () => {

    @Table("users")
    class User {

        @Column()
        id: number;

        @Column("created_at")
        createdAt: Date;
    }

    it('should successfully get the entity through EntityManager', () => {
        const userEntity: any = EntityManager.getEntity(User);

        userEntity.table().should.be.equal('users');
        userEntity.columns().should.be.deep.equal(['users.id AS users.id', 'users.created_at AS users.created_at']);
        userEntity.column('id').should.be.equal('users.id');
        userEntity.column('createdAt').should.be.equal('users.created_at');
    });

});