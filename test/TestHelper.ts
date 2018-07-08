import "reflect-metadata";
import "ts-node/register";
import * as sourceMapSupport from "source-map-support";
import * as express from 'express'
import * as fastify from 'fastify'
import { ApplicationLoader } from '../src'

sourceMapSupport.install();

export function testExpressServer(nodeServer) {

  before(done => {
      (<Promise<express.Application>>new ApplicationLoader('express', {files: '.'}).init()).then((server) => {
          nodeServer = server.listen(0, done)
      })
  })
  after(done => nodeServer.close(done))
}

export function testFastifyServer() {
  let nodeServer

  before(done => {
      (<Promise<express.Application>>new ApplicationLoader('express', {files: '.'}).init()).then((server) => {
          nodeServer = server.listen(0, done)
      })
  })
  after(done => nodeServer.close(done))

  return nodeServer
}
