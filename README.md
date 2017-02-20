[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]
[![Coverage Status][coveralls-image]][coveralls-url]


<h1 align="center">Typed Framework</h1>

> Enterprise ready spring like framework build on Typescript and Express

<h2 align="center">Features</h2>

* Dependency Injection (constructor injection and property injection)
* Service class
* Rest route and controller, param data injection support
* Log support


<h2 align="center">Install</h2>
```
npm install --save typed-framework
```

<h2 align="center">Quick Start</h2>

* install `typescript` and `ts-node`
```bash
npm install -g typescript ts-node
```

* create `tsconfig.json` file

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["dom", "es7"],
    "types": ["reflect-metadata"],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators":true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": false
  },
  "exclude": [
    "node_modules",
    "build"
  ]
}
```

* create `src`, and create a `Application.ts` file inside it
```bash
$ mkdir src
$ cd src
$ touch Application.ts
```

```typescript
import {TypedApplicationLoader, TypedApplication, Inject} from "typed-framework";

@TypedApplicationLoader({rootDir: `${__dirname}/../`})
class Application {

    public static start() {
        TypedApplication.run();
    }

}

Application.start();
```

* create first controller `HomeController.ts` and return json result
```typescript
import {RestController, Get} from "typed-framework";

@RestController("")
export class HomeController {

    @Get("/")
    public indexAction() {

        return {
            framework: 'typed-framework'
        }

    }

}
```
* run the code
```typescript
$ ts-node src/Application.ts
```

* open browser, and go to http://localhost:9000

The code of quick start guide: [code](https://github.com/typed-project/example/tree/master/basic)


<h2 align="center">Roadmap</h2>


| Version Code |  Target Date   |  Release Date  | Description                            |
| :----------: | :------------: | :------------: | -------------------------------------- |
|    0.1.0     |  2017-02-17    |  2017-02-17    | controller/server/service api          |
|    0.2.0     |  2017-03-05    |                | middleware/plugin system               |
|    0.3.0     |  2017-03-12    |                | enrich controller api                  |
|    0.4.0     |  2017-03-19    |                | add event emit/listen api              |
|    0.5.0     |  2017-03-26    |                | stable api/pre-production version      |
|  **1.0.0**   |**2017-04-01**  |                | enrich document                        |


<h2 align="center">Release note</h2>

### v0.1.0

* Spring like routes and controller support based on [express](https://github.com/expressjs/expressjs.com)
* Build in support for log based on [winston](https://github.com/winstonjs/winston)
* Build in support for query builder based on [knex](https://github.com/tgriesser/knex)
* Best practice middlewares preinstalled
* Best practice project structure
* Easy server initialization
* Dependency Injection

<h2 align="center">Core Team</h2>
<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <img width="150" height="150" src="https://github.com/vincent178.png?s=150">
        <br>
        <a href="https://github.com/vincent178">Vincent</a>
        <p>Founder of typed-framework</p>
      </td>
     </tr>
  </tbody>
</table>





[npm-url]: https://npmjs.org/package/typed-framework
[downloads-image]: http://img.shields.io/npm/dm/typed-framework.svg
[npm-image]: http://img.shields.io/npm/v/typed-framework.svg
[travis-url]: https://travis-ci.org/typed-project/typed-framework
[travis-image]: http://img.shields.io/travis/typed-project/typed-framework.svg
[david-dm-url]:https://david-dm.org/typed-project/typed-framework
[david-dm-image]:https://david-dm.org/typed-project/typed-framework.svg
[david-dm-dev-url]:https://david-dm.org/typed-project/typed-framework#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/typed-project/typed-framework/dev-status.svg
[coveralls-url]:https://coveralls.io/r/typed-project/typed-framework
[coveralls-image]:https://coveralls.io/repos/typed-project/typed-framework/badge.svg
