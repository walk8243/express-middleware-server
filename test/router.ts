import { fake, stub, SinonStub } from 'sinon';
import assert from 'assert';
import express from 'express';
import getRouter, { routerLib } from '../src/router';

describe('router', () => {
  let stubExpressRouter!: SinonStub;
  const dummyRouter = express.Router();
  before(() => {
    delete process.env.SERVER;
  });
  beforeEach(() => {
    delete process.env.SERVER;
    delete process.env.ROUTER;
    delete process.env.npm_package_config_router;
  });
  after(() => {
    process.env.SERVER = 'true';
  });
  before(() => {
    stubExpressRouter = stub(express, 'Router');
  });
  beforeEach(() => {
    stubExpressRouter.reset();
    stubExpressRouter.callsFake(fake()).returns(dummyRouter);
  });
  after(() => {
    stubExpressRouter.restore();
  });

  describe('getRouter', () => {
    let stubIsServer!: SinonStub;
    let stubGetRouterPath!: SinonStub;
    before(() => {
      stubIsServer = stub(routerLib, 'isServer');
      stubGetRouterPath = stub(routerLib, 'getRouterPath');
    });
    beforeEach(() => {
      stubIsServer.reset();
      stubGetRouterPath.reset();
      stubIsServer.callsFake(fake());
      stubGetRouterPath.callsFake(fake()).returns('D:\\Document\\git\\express-middleware-server\\test\\dummy\\router.ts');
    });
    after(() => {
      stubIsServer.restore();
      stubGetRouterPath.restore();
    });
    it('サーバー', () => {
      stubIsServer.returns(true);
      const router = getRouter();
      assert.deepEqual(router, dummyRouter);
    });
    it('アプリケーション', () => {
      stubIsServer.returns(false);
      const router = getRouter();
      assert.deepEqual(router, dummyRouter);
    });
    it('ディレクトリ以外を指定', () => {
      stubIsServer.returns(false);
      stubGetRouterPath.returns('../');
      try {
        getRouter();
        assert.fail();
      } catch(err) {
        assert.equal(err.message, '../ is not file!');
      }
    });
  });
  describe('isServer', () => {
    it('SERVER is true', () => {
      process.env.SERVER = 'true';
      const result = routerLib.isServer();
      assert.equal(result, true);
    });
    it('ROUTER is false', () => {
      process.env.ROUTER = 'false';
      const result = routerLib.isServer();
      assert.equal(result, true);
    });
    it('npm_package_config_router is false', () => {
      process.env.npm_package_config_router = 'false';
      const result = routerLib.isServer();
      assert.equal(result, true);
    });
    it('未指定', () => {
      const result = routerLib.isServer();
      assert.equal(result, false);
    });
  });
  describe('getRouterPath', () => {
    const dummyPath = 'dummyPath';
    it('ROUTER', () => {
      process.env.ROUTER = dummyPath;
      const path = routerLib.getRouterPath();
      console.log(path);
    });
    it('npm_package_config_router', () => {
      process.env.npm_package_config_router = dummyPath;
      const path = routerLib.getRouterPath();
      console.log(path);
    });
    it('dist/router.js', () => {
      const path = routerLib.getRouterPath();
      console.log(path);
    });
  });
});
