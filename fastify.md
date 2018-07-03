
Generic Handler
```js
(req, res, next) => {}
(err, req, res, next) => {}
```

Error Handler
```
(err, req, res) => {}
```

Not Found Handler
```
(req, res) => {}
```

Hook
```js
(req, res, next) => {} // onRequest
(req, res, next) => {} // preHandler
(req, res, payload, next) => {} // onSend
(res, next) => {}
```

Middleware 
```js
(req, res, next) => {}
```

Route
```js
(req, res) => {}
```
