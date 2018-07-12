import {ApplicationLoader, ApplicationSettings} from "../../../src/index";
import * as express from 'express'

@ApplicationSettings({
    rootDir: `${__dirname}/../`
})
class Application extends ApplicationLoader {
}

(async () => {
    const server = await new Application('express').init() as express.Application
    server.listen(8800, () => {
        console.log('server is up')
    })
})()

