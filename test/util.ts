import test from 'ava'
import axios from 'axios'
import { ApplicationLoader } from '../src'

export const bootstrapServer = (cb) => {

   const serverType = process.env.SERVER

    const opts = {
        server: null,
        getAxios: () => {
            return axios.create({
                baseURL: `http://localhost:${(opts.server as any).address().port}`
            })
        },
        isExpress: () => serverType === 'express',
        isFastify: () => serverType === 'fastify'
    }

    test.before.cb(t => {
        const app = new ApplicationLoader(serverType as string).init()
        app.then((server: any) => {
            if (serverType === 'fastify') {
                server.listen(0, t.end)
                opts.server = server.server
            } else if (serverType === 'express') {
                opts.server = server.listen(0, t.end)
            } else {
                throw `${serverType} not support, should be express or fastify`
            }
        })
    })
    
    test.after.cb(t => {
        (opts.server as any).close(t.end)
    })

    cb(opts)
}