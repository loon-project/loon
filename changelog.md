
### 2.0

* `fastify` adapter
* add `files` to ApplicationSettings, remove `srcDir, publicDir, logDir, configDir, dbDir`, `rootDir` is not required
* use `SettingOptions` in `ApplicationLoader` constructor
* use `start()` return server inside LOON
* remove `@Service()` decorator
* remove `@Controller()` decorator
* remove `@On() @Subscriber` decorator
* add `loon` bin script
* `$beforeLoadRoutes` rename to `$beforeLoadControllers`, `$afterLoadRoutes` rename to `$afterLoadControllers`
* add `$onClose` lifecycle hook
* add debug support

