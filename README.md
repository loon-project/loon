> I'm working hard to test this against production, once it's ready, I will release the 1.0.0, please stay tuned.


[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]
[![Coverage Status][coveralls-image]][coveralls-url]


<h1 align="center">Loon</h1>

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
@Head
@Options
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

> <h3>Type convert in parameters</h3>

```typescript

class User {

    // decorate the property you want to convert
    @Property()
    public name: string;

    // if it is an array or an map, you need to provide the baseType
    @Property({baseType: Number})
    public ids: number[];

    // provide an alias name, or pass in {name: "created_at"} is also valid
    @Property("created_at")
    public createdAt: Date;

}


@RestController()
export class UserController {

    @Post("/users")
    public createAction(@BodyParam("user") user: User) {
        user instanceof User // true
        ...
    }
}
```

Support @BodyParam, @PathParam, @QueryParam, based on the type you provided, <br>
the converter service will automatic convert the data from user to the type. <br>
!! Must use @Property to decorate the property you want to convert


> <h3>Use convert service</h3>

```typescript
const userObj = {
    name: "tester",
    ids: [1, 2, 3],
    created_at: "2017-04-17T00:59:56.729Z"
}

class UserService {
    constructor(private converter: ConverterService) {}

    public findUser() {

        // first parameter is the data need to convert
        // second parameter is the target type
        // if second parameter is Array or Map, you need provide the baseType in the third parameter
        const user = this.converter.convert(userObj, User);

        user instanceof User // true
    }
}
```

<h2 align="center">Quick start</h2>

Quick start example: [link](https://github.com/loon-project/loon/tree/master/wikis/start.md)

Full feature example: [link](https://github.com/loon-project/example)


<h2 align="center">Roadmap</h2>

for 2.0, please go to [2.0 Roadmap](https://github.com/loon-project/loon/projects/1)

| Version Code |  Target Date   |  Release Date  | Description                            |
| :----------: | :------------: | :------------: | -------------------------------------- |
|    0.1.0     |  2017-02-17    |  2017-02-17    | controller/server/service api          |
|    0.2.0     |  2017-03-05    |  2017-03-12    | middleware/plugin system               |
|    0.3.0     |  2017-03-12    |  2017-03-13    | enrich controller api                  |
|    0.4.0     |  2017-03-19    |  2017-03-14    | global and error middleware            |
|    0.5.0     |  2017-03-26    |  2017-03-14    | stable api/pre-production version      |
|  **1.0.0**   |**2017-04-01**  |                | enrich document                        |


<h2 align="center">Release note</h2>

### v0.8.0 (2017-04-18)
* add test solution: use bootstrap function
* add PropertyInherited decorator

### v0.7.0 (2017-04-17)
* add type convert in controller parameters
* add ConverterService to convert data
* add Property decorator

### v0.6.0 (2017-03-17)
* add required parameter options
* add @Head, @Options http request


### v0.5.0 (2017-03-14)
* add logger config


### v0.4.0 (2017-03-14)
* @Middleware and @ErrorMiddleware support
* middleware order and base url support


### v0.3.0 (2017-03-13)
* Support @Filter decorator to decorate a class as a Filter 
* Support @BeforeFilter, @AfterFilter to filter for a controller, add options: only, except
* Support @Data param type to inject data for the controller and filters


### v0.2.0 (2017-03-12)
* Support @Middleware decorator to inject for controllers
* Support Middleware, Controller parameter injections, now your middleware have the same ability as Controller to inject not only Req, Res, and BodyParam, PathParam and so on.
* Support new @ApplicationSettings and ApplicationLoader for new start up application way
* Support convert class to object and object to class by Converter, and provide template ability


### v0.1.0 (2017-02-17)
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
