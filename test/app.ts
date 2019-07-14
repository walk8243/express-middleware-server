import { fake, stub, SinonStub } from 'sinon';
import * as assert from 'assert';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import * as router from '../src/router';
import { notFoundErrorHandler, errorHandler } from '../src/middleware';

describe('app', () => {
  let stubRouterGetRouter!: SinonStub;
  const appPath = require.resolve('../src/app.ts');
  before(() => {
    require('../src/app');
    stubRouterGetRouter = stub(router, 'default');
  });
  beforeEach(() => {
    delete require.cache[appPath];
    stubRouterGetRouter.reset();
    stubRouterGetRouter.callsFake(fake()).returns(express.Router());
  });
  after(() => {
    stubRouterGetRouter.restore();
  });
  it('ミドルウェア', () => {
    const app = require('../src/app').default;
    const stackHandleNames = (app._router.stack as any[]).map((stack: any) => stack.handle.name);
    const stacksBeforeRouter = stackHandleNames.slice(2, stackHandleNames.indexOf('router'));
    const stacksAfterRouter = stackHandleNames.slice(stackHandleNames.indexOf('router')+1);

    assert.ok(stackHandleNames.includes('query'), '`query` がルーターの最初に呼ばれていません。');
    assert.ok(stackHandleNames.includes('expressInit'), '`expressInit` がルーターの最初に呼ばれていません。');
    assert.ok(stacksBeforeRouter.includes(bodyParser.json().name), '`bodyParser.json()` がルーター前に呼ばれていません。');
    assert.ok(stacksBeforeRouter.includes(bodyParser.urlencoded({ extended: true }).name), '`bodyParser.urlencoded({ extended: true })` がルーター前に呼ばれていません。');
    assert.ok(stacksAfterRouter.includes(notFoundErrorHandler.name), '`notFoundErrorHandler` がルーター後に呼ばれていません。');
    assert.ok(stacksAfterRouter.includes(errorHandler.name), '`errorHandler` がルーター後に呼ばれていません。');
  });
  describe('設定値', () => {
    beforeEach(() => {
      delete process.env.PORT;
      delete process.env.npm_package_config_port;
    });
    describe('ポート', () => {
      it('環境変数PORTを設定', () => {
        process.env.PORT = '1000';
        const app: Application = require('../src/app').default;
        assert.equal(app.settings.port, 1000);
      });
      it('環境変数npm_package_config_portを設定', () => {
        process.env.npm_package_config_port = '2000';
        const app: Application = require('../src/app').default;
        assert.equal(app.settings.port, 2000);
      });
      it('環境変数を設定していない', () => {
        const app: Application = require('../src/app').default;
        assert.equal(app.settings.port, 3000);
      });
      it('環境変数PORTと環境変数npm_package_config_portの両方に設定', () => {
        process.env.PORT = '1000';
        process.env.npm_package_config_port = '2000';
        const app: Application = require('../src/app').default;
        assert.equal(app.settings.port, 1000);
      });
      it('環境変数PORTに数字以外を設定', () => {
        process.env.PORT = 'aaa';
        const app: Application = require('../src/app').default;
        assert.equal(app.settings.port, 3000);
      });
      it('環境変数PORTに数字以外を、環境変数npm_package_config_portに数字を設定', () => {
        process.env.PORT = 'aaa';
        process.env.npm_package_config_port = '2000';
        const app: Application = require('../src/app').default;
        assert.equal(app.settings.port, 2000);
      });
    });
  });
});
