import { fake, stub, SinonStub } from 'sinon';
import * as assert from 'assert';
import express from 'express';
import path from 'path';

describe('worker', () => {
  const appPath = path.resolve(__dirname, '../src/app.ts');
  const dummyApp = express();
  let workerObj!: { default: any, listenCallback: any };
  before(() => {
    process.env.ROUTER = 'false';
    require('../src/app');
    require.cache[appPath].exports.default = dummyApp;
    workerObj = require('../src/worker');
  });
  describe('default', () => {
    let stubAppListen!: SinonStub;
    let stubAppGet!: SinonStub;
    let worker!: () => {};
    before(() => {
      worker = workerObj.default;
      stubAppListen = stub(dummyApp, 'listen');
      stubAppGet = stub(dummyApp, 'get');
    });
    beforeEach(() => {
      stubAppListen.reset();
      stubAppGet.reset();
      stubAppListen.callsFake(fake());
      stubAppGet.callsFake(fake());
      stubAppGet.withArgs('port').returns(3000);
    });
    after(() => {
      stubAppListen.restore();
      stubAppGet.restore();
    });
    it('正常系', () => {
      worker();
      assert.ok(stubAppListen.calledOnce);
      assert.ok(stubAppGet.calledOnce);
    });
  });
  describe('listenCallback', () => {
    let stubAppGet!: SinonStub;
    let listenCallback!: () => {};
    before(() => {
      listenCallback = workerObj.listenCallback;
      stubAppGet = stub(dummyApp, 'get');
    });
    beforeEach(() => {
      stubAppGet.reset();
      stubAppGet.callsFake(fake());
      stubAppGet.withArgs('port').returns(3000);
    });
    after(() => {
      stubAppGet.restore();
    });
    it('正常系', () => {
      listenCallback();
      assert.ok(stubAppGet.calledOnce);
    });
  });
  describe('統合', () => {
    let stubListenCallback!: SinonStub;
    let stubAppGet!: SinonStub;
    let worker!: any;
    before(() => {
      worker = workerObj.default;
    });
    before(() => {
      stubListenCallback = stub(workerObj, 'listenCallback');
      stubAppGet = stub(dummyApp, 'get');
    });
    beforeEach(() => {
      stubListenCallback.reset();
      stubAppGet.reset();
      stubListenCallback.callsFake(fake());
      stubAppGet.callsFake(fake());
      stubAppGet.withArgs('port').returns(3000);
    });
    after(() => {
      stubListenCallback.restore();
      stubAppGet.restore();
    });
    it('正常系', (done) => {
      const server = worker();
      server.on('listening', () => {
        server.close(done);
      });
    });
  });
});
