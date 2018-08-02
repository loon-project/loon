import { helper } from './helper';
import test from 'ava';
import { Property, Controller, Post, BodyParam, Res } from '../src';

const d = new Date();

const articleObj = {
    name: 'nice article',
    ids: [1, 2, 3],
    created_at: d,
    is_draft: false,
};

class Article {

    @Property()
    name: string;

    @Property({baseType: Number})
    ids: number[];

    @Property('created_at')
    createdAt: Date;

    @Property('is_draft')
    isDraft: boolean;
}

@Controller()
class ArticlesController {

    @Post("/bodyclass")
    classAction(@BodyParam() article: Article, @Res() res) {

        function assert(val: boolean, message: string) {
            if (!val) {
                res.send(message);
                return;
            }
        }

        assert(article instanceof Article, 'article is not Article instance');
        assert(article.name === articleObj.name, 'article name not match');
        article.ids.forEach((id, idx) => assert(id === articleObj.ids[idx], 'article ids not match'));
        assert(article.createdAt.toString() === articleObj.created_at.toString(), 'article created_at not match');
        assert(article.isDraft === articleObj.is_draft, 'article is_draft not match');

        res.send(true);
    }

    @Post('/bodybasic')
    basicAction(@BodyParam() id: number, @Res() res) {
        res.send(id === 1);
    }
}

test('should convert object to class', async t => {
    const response = await helper.getAxios().post('/bodyclass', articleObj);
    t.is(response.status, 200);
    t.is(response.data, true);
});

test('should convert basic type to another basic type', async t => {
    const response = await helper.getAxios().post('/bodybasic', "1", {
        headers: {
            'content-type': 'text/plain'
        }
    });
    t.is(response.status, 200);
    t.is(response.data, true);
});
