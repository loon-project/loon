<h1 align="center">Quick Start</h1>

<br>

* install `typescript` and `ts-node`
```bash
npm install -g typescript ts-node
```

* Install typed-framework
```
npm install --save typed-framework
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
@ApplicationSettings({rootDir: `${__dirname}/../`})

class Application extends ApplicationLoader {

    public static initialize() {
        return new Application().start();
    }
}

Application.initialize();

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
