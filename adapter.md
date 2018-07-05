
> I think specify fastify or express explicitly helps to understand loon and inside of loon
> This will speed up everything for people with express or fastify background
> All the handler/middleware/error handler needs related knowledge 
> Also it's easier to check express/fastify document than loon document


> in the controller action, I want to build something like


### Fastify Example

```js
@RestController('/')
class ApplicationController {

  @Get('/')
  indexAction(
    @Path('ff') ff: string, 
    @Query('ss') ss: string, 
    @Req() req: fastify.FastifyRequest, 
    @Res() res: fastify.FastifyReply) {
    
      // here, you know exactly you're using fastify request and response object
  }
}
```

### Express Example

```js
@RestController('/')
class ApplicationController {

  @Get('/')
  indexAction(
    @Path('ff') ff: string, 
    @Query('ss') ss: string, 
    @Req() req: express.Request, 
    @Res() res: express.Response) {

      // here, you know it's express

  }
}
```

