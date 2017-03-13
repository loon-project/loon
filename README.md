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

Core API details: [link](https://github.com/typed-project/typed-framework/tree/master/wikis/api.md)


<h2 align="center">Quick start</h2>
Quick start example: [link](https://github.com/typed-project/typed-framework/tree/master/wikis/start.md)


<h2 align="center">Roadmap</h2>


| Version Code |  Target Date   |  Release Date  | Description                            |
| :----------: | :------------: | :------------: | -------------------------------------- |
|    0.1.0     |  2017-02-17    |  2017-02-17    | controller/server/service api          |
|    0.2.0     |  2017-03-05    |  2017-03-12    | middleware/plugin system               |
|    0.3.0     |  2017-03-12    |  2017-03-13    | enrich controller api                  |
|    0.4.0     |  2017-03-19    |                | add event emit/listen api              |
|    0.5.0     |  2017-03-26    |                | stable api/pre-production version      |
|  **1.0.0**   |**2017-04-01**  |                | enrich document                        |


<h2 align="center">Release note</h2>

### v0.3.0
* Support @Filter decorator to decorate a class as a Filter 
* Support @BeforeFilter, @AfterFilter to filter for a controller, add options: only, except
* Support @Data param type to inject data for the controller and filters


### v0.2.0
* Support @Middleware decorator to inject for controllers
* Support Middleware, Controller parameter injections, now your middleware have the same ability as Controller to inject not only Req, Res, and BodyParam, PathParam and so on.
* Support new @ApplicationSettings and ApplicationLoader for new start up application way
* Support convert class to object and object to class by Converter, and provide template ability


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
