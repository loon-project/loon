<h1 align="center">CORE API</h1>

<br>

## Dependency Injection

Class: <b>`DependencyRegistry`</b>

1. use `@Component` decorate a class
2. use `register(nameOrKlass: string|Klass, instance: any)` to register a component
3. use `unregister(nameOrKlass: string|Klass)` to unregister a component

<br>

## Application

Class: <b>`TypedApplication`</b>

1. use `initialize() => any` to initialize a component
2. use `use(middleware: (req, res, next) => any)` to use an express middleware
2. use `run(application: Klass)` to start application

initialize runs before middleware and routes

<br>

## Path

Class: <b>`TypedPath`</b>

1. `rootDir` returns project root folder path
2. `srcDir` returns source code folder path
3. `publicDir` returns public folder path
4. `logDir` returns log folder path
5. `configDir` returns configuration file folder path
6. `dbDir` return database related folder path

<br>

## Configuration

Class: <b>`TypedConfig`</b>

1. use `get(expression: string) => any` to get configuration object
2. use `has(expression: string) => any` to check configuration existing
3. use `register(path: string) => void` to register a configuration file
4. use `require(path: string) => void` to require configuration file 

if path is relative, it relative to `${configDir}`
if path is absolute, use it directly





