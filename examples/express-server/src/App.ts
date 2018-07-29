import { ApplicationLoader } from "../../../src";

new ApplicationLoader('express', {rootDir: __dirname}).start().then((server: any) => {
    console.log(`server is up on ${server.address().port}`)
})

