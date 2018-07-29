[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]
[![Coverage Status][coveralls-image]][coveralls-url]


<h1 align="center">LOON(气球)</h1>

> Now it's time to celebrate, LOON 2.0! <br />
> Enterprise ready spring like framework build on Typescript and Express

<h2 align="center">Changelog</h2>

### 2.0
* `fastify` adapter
* add `files` to ApplicationSettings, remove `srcDir, publicDir, logDir, configDir, dbDir`, `rootDir` is not required
* use `SettingOptions` in `ApplicationLoader` constructor
* use `start()` return raw node http server
* remove `@Service()` decorator
* remove `@RestController()` decorator
* remove `@On() @Subscriber` decorator
* add `create-loon-app` script
* `$beforeLoadRoutes` rename to `$beforeLoadControllers`, `$afterLoadRoutes` rename to `$afterLoadControllers`
* add `$onClose` lifecycle hook
* add graceful shutdown by default
* add debug support

<h2 align="center">Quick Start</h2>

```
$ npm install -g create-loon-app
$ create-loon-app <appName>
$ cd <appName>
$ npm start
```
Open your browser, and go to http://localhost:9000, you will get hello world response


<h2 align="center">Features</h2>

* Dependency Injection
* Controller
* Middleware
* Filter
* Model
* Converter
* Initializer

Please refer to the [documentation](https://loon-project.github.io) for more details.
[中文文档](https://loon-project.github.io/#/zh-cn/)

<h2 align="center">Core Team</h2>
<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <img width="150" height="150" src="https://github.com/vincent178.png?s=150">
        <br>
        <a href="https://github.com/vincent178">Vincent</a>
        <p>Founder of loon</p>
      </td>
     </tr>
  </tbody>
</table>





[npm-url]: https://npmjs.org/package/loon
[downloads-image]: http://img.shields.io/npm/dm/loon.svg
[npm-image]: http://img.shields.io/npm/v/loon.svg
[travis-url]: https://travis-ci.org/loon-project/loon
[travis-image]: http://img.shields.io/travis/loon-project/loon.svg
[david-dm-url]:https://david-dm.org/loon-project/loon
[david-dm-image]:https://david-dm.org/loon-project/loon.svg
[david-dm-dev-url]:https://david-dm.org/loon-project/loon#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/loon-project/loon/dev-status.svg
[coveralls-url]: https://coveralls.io/github/loon-project/loon
[coveralls-image]:https://coveralls.io/repos/loon-project/loon/badge.svg
