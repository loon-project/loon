
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
