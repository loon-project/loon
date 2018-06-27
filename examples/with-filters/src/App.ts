import {ApplicationLoader, ApplicationSettings} from "../../../src/index";
import * as fastify from 'fastify'

@ApplicationSettings({
    rootDir: `${__dirname}/../`
})
class Application extends ApplicationLoader {
}

new Application().start().then().catch(err => {
    console.log(err)
})

