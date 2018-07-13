
### 2.0

* `fastify` adapter
* add `files` to ApplicationSettings, remove `srcDir, publicDir, logDir, configDir, dbDir`, `rootDir` is not required
* use `SettingOptions` in `ApplicationLoader` constructor
* use `start()` return server inside LOON
* remove `@Service()` decorator
* remove `@Controller()` decorator
* remove `@On() @Subscriber` decorator
* add `loon` bin script

