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
        }
    }

    test.before(async t => {
        const server = await new ApplicationLoader(serverType as string, {port: '0'}).start()
        opts.server = server as any
    })
    
    test.after.cb(t => {
        (opts.server as any).close(t.end)
    })

    cb(opts)
}

export const isExpress = () => process.env.SERVER === 'express'
export const isFastify = () => process.env.SERVER === 'fastify'
