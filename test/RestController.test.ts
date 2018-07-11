import test from 'ava'
import './fixtures/RestController'
import { bootstrapServer } from './util'

bootstrapServer(({getAxios}) => {

    test('RestController get', async t => {
        const response = await getAxios().get(`/rest/get`)
        t.is(response.status, 200)
        t.is(response.data, 'rest get')
    })

    test('RestController post', async t => {
        const response = await getAxios().post(`/rest/post`)
        t.is(response.status, 200)
        t.is(response.data, 'rest post')
    })

})


