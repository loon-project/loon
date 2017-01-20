"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
require("./test/TestHelper");
var Params_1 = require("./src/mvc/decorator/Params");
var Method_1 = require("./src/mvc/decorator/Method");
var Controller_1 = require("./src/mvc/decorator/Controller");
var ServerHelper_1 = require("./test/helper/ServerHelper");
var MVCContainer_1 = require("./src/mvc/MVCContainer");
var User2Controller = (function () {
    function User2Controller() {
    }
    User2Controller.prototype.indexAction = function (authorization) {
        return authorization;
    };
    User2Controller.prototype.showAction = function (id) {
        return id;
    };
    User2Controller.prototype.createAction = function (id) {
        return id;
    };
    return User2Controller;
}());
__decorate([
    Method_1.Get("/users"),
    __param(0, Params_1.HeaderParam("Authorization"))
], User2Controller.prototype, "indexAction", null);
__decorate([
    Method_1.Get("/users/:id"),
    __param(0, Params_1.PathParam("id"))
], User2Controller.prototype, "showAction", null);
__decorate([
    Method_1.Post("/users"),
    __param(0, Params_1.BodyParam("id"))
], User2Controller.prototype, "createAction", null);
User2Controller = __decorate([
    Controller_1.Controller("/")
], User2Controller);
var app = ServerHelper_1.ServerHelper.simpleServer();
var routes = MVCContainer_1.MVCContainer.getRoutes();
routes.forEach(function (item) { return app.use(item.baseRoute, item.router); });
app.listen(4444);
