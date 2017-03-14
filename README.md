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
* Middleware 
* Filter
* Log support
* DB support


> <h3>Initialize Application</h3>



```typescript
@ApplicationSettings({rootDir: `${__dirname}/../`})
class Application extends ApplicationLoader {

    public static initialize() {
        return new Application().start();
    }
}

Application
    .initialize()
    .catch(e => {
        throw e
    });


```
Support ApplicationSettings options: 
```typescript
interface SettingOptions {
    // Required
    rootDir: string;

    srcDir?: string;

    publicDir?: string;

    logDir?: string;

    configDir?: string;

    dbDir?: string;

    env?: string;

    port?: string|number;
}

```

> <h3>Handle a request</h3>



```typescript
@RestController()
// RestController support baseUrl options, for example: @RestController("/users")
export class HomeController {

    @Get("/")
    public indexAction(@Data() data: any, @Res() res: Express.Response) {
        res.send(data);
    }

}

```

Support parameter types: 
```typescript
@PathParam
@QueryParam
@BodyParam
@HeaderParam
@CookieParam
@Req
@Res
@Next
@Err
@Data
```

Support Http request method: 
```typescript
@Get 
@Post
@Put
@Patch
@Delete
```

> <h3>Use a filter, pass data across filter and controller</h3>



```typescript
@Filter()
export class CurrentUser implements IMiddleware {

    constructor(private userService: UserService) {
    }

    public async use(@Data() data: any, @Next() next: Express.NextFunction) {

        data.user = await this.userService.findById(1);

        next();
    }
}

@RestController()
@BeforeFilter(CurrentUser) 
// also support options only and except, for example: 
// @BeforeFilter(CurrentUser, only: ['indexAction'])
// @BeforeFilter(CurrentUser, except: ['indexAction'])
// @AfterFilter(CurrentUser) only, except options as well
export class HomeController {

    @Get("/")
    public indexAction(@Data() data: any, @Res() res: Express.Response) {
        res.send(data);
    }

}

```

> <h3>Use global middleware</h3>


```typescript
@Middleware({order: 0}) 
// middleware support two options: order and baseUrl
export class Middleware1 implements IMiddleware {

    public use(@Data() data: any, @Next() next: Express.NextFunction) {
        data.message = "global middleware";
        next();
    }
}
```

> <h3>Use global error middleware</h3>


```typescript
@ErrorMiddleware()
// error middleware support two options: order and baseUrl
export class ErrMiddleware implements IMiddleware {

    public use(@Err() err: any, @Res() res: Express.Response) {
        res.send(err.message);
    }
}
```

> <h3>Use a service and inject into controller and middleware, filter</h3>



```typescript
@Service()
export class UserService {

    public findById(id: number) {

        const userFromDB = {
            uuid: "123",
            created_at: Date.now()
        };
        
        return userFromDB;
    }
}

@RestController()
export class HomeController {
    
    constructor(private userService: UserService) {
    }

}
```

> <h3>Use logger and db connection</h3>



```typescript
@RestController()
export class HomeController {
    
    private connection = ConnectionFactory.getConnection(); // Database connection is Knex instance 
    private logger = LogFactory.getLogger(); // Logger is winston instance

}
```



<h2 align="center">Quick start</h2>
Quick start example: [link](https://github.com/typed-project/typed-framework/tree/master/wikis/start.md)


<h2 align="center">Roadmap</h2>


| Version Code |  Target Date   |  Release Date  | Description                            |
| :----------: | :------------: | :------------: | -------------------------------------- |
|    0.1.0     |  2017-02-17    |  2017-02-17    | controller/server/service api          |
|    0.2.0     |  2017-03-05    |  2017-03-12    | middleware/plugin system               |
|    0.3.0     |  2017-03-12    |  2017-03-13    | enrich controller api                  |
|    0.4.0     |  2017-03-19    |  2017-03-14    | global and error middleware            |
|    0.5.0     |  2017-03-26    |  2017-03-14    | stable api/pre-production version      |
|  **1.0.0**   |**2017-04-01**  |                | enrich document                        |


<h2 align="center">Release note</h2>

### v0.5.0
* add logger config


### v0.4.0
* @Middleware and @ErrorMiddleware support
* middleware order and base url support


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
