import { fake, stub, SinonStub } from 'sinon';
import * as assert from 'assert';
import express from 'express';
import cluster from 'cluster';
import path from 'path';
import os from 'os';

describe('server', () => {
  const serverPath = path.resolve(__dirname, '../src/server.ts');
  const appPath = path.resolve(__dirname, '../src/app.ts');
  before(() => {
    process.env.ROUTER = 'false';
    require('../src/app')
    require.cache[appPath].exports.default = express();
  });
  beforeEach(() => {
    delete require.cache[serverPath];
  });
  describe('cluster', () => {
    let stubClusterFork!: SinonStub;
    let stubClusterIsMaster!: SinonStub;
    let stubOsCpus!: SinonStub;
    const dummyCpu = { model: 'Intel(R) Core(TM) i7 CPU', speed: 2926, times: {} };
    const dummyCpus = [ dummyCpu, dummyCpu, dummyCpu, dummyCpu ]
    before(() => {
      stubClusterFork = stub(cluster, 'fork');
      stubClusterIsMaster = stub(cluster, 'isMaster');
      stubOsCpus = stub(os, 'cpus');
    });
    beforeEach(() => {
      stubClusterFork.reset();
      stubClusterIsMaster.reset();
      stubOsCpus.reset();
      stubClusterFork.callsFake(fake());
      stubClusterIsMaster.callsFake(fake()).value(true);
      stubOsCpus.callsFake(fake()).returns(dummyCpus);
    });
    after(() => {
      stubClusterFork.restore();
      stubClusterIsMaster.restore();
      stubOsCpus.restore();
    });
    beforeEach(() => {
      delete process.env.CLUSTER;
      delete process.env.npm_package_config_cluster;
    });
    it('process.env.CLUSTER', () => {
      process.env.CLUSTER = '2';
      require('../src/server');
      assert.equal(stubClusterFork.callCount, 2);
    });
    it('process.env.npm_package_config_cluster', () => {
      process.env.npm_package_config_cluster = '3';
      require('../src/server');
      assert.equal(stubClusterFork.callCount, 3);
    });
    it('CLUSTERもnpm_package_config_clusterも設定されていない', () => {
      require('../src/server');
      assert.equal(stubClusterFork.callCount, dummyCpus.length);
    });
    it('process.env.CLUSTERに文字を指定', () => {
      process.env.CLUSTER = 'xxx';
      require('../src/server');
      assert.equal(stubClusterFork.callCount, dummyCpus.length);
    });

    it('clusterの終了', (done) => {
      stubClusterFork.reset();
      stubClusterFork.callThrough();
      process.env.CLUSTER = '1';
      require('../src/server');
      const worker = stubClusterFork.firstCall.returnValue;
      worker.process.kill();
      cluster.on('exit', (worker, code, signal) => {
        done();
      });
    });
  });
  describe('worker', () => {
    let stubClusterIsMaster!: SinonStub;
    let stubAppListen!: SinonStub;
    let stubAppGet!: SinonStub;
    const dummyAppGet = 'dummy app get port';
    before(() => {
      stubClusterIsMaster = stub(cluster, 'isMaster');
      stubAppListen = stub(require.cache[appPath].exports.default, 'listen');
      stubAppGet = stub(require.cache[appPath].exports.default, 'get');
    });
    beforeEach(() => {
      stubClusterIsMaster.reset();
      stubAppListen.reset();
      stubAppGet.reset();
      stubClusterIsMaster.callsFake(fake());
      stubClusterIsMaster.value(false);
      stubAppListen.callsFake(fake());
      stubAppGet.callsFake(fake());
      stubAppGet.withArgs('port').returns(dummyAppGet);
    });
    after(() => {
      stubClusterIsMaster.restore();
      stubAppListen.restore();
      stubAppGet.restore();
    });
    it('サーバー起動', () => {
      require('../src/server');
      assert.ok(stubAppListen.calledOnce);
      assert.equal(stubAppListen.firstCall.args[0], dummyAppGet);
      stubAppListen.firstCall.args[1]();
    });
  });
});
