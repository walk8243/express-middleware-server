import { fake, stub, SinonStub } from 'sinon';
import * as assert from 'assert';
import express from 'express';
import cluster from 'cluster';
import path from 'path';
import os from 'os';
import master from '../src/master';

describe('master', () => {
  let stubClusterFork!: SinonStub;
  let stubClusterIsMaster!: SinonStub;
  let stubOsCpus!: SinonStub;
  const appPath = path.resolve(__dirname, '../src/app.ts');
  const dummyCpu = { model: 'Intel(R) Core(TM) i7 CPU', speed: 2926, times: {} };
  const dummyCpus = [ dummyCpu, dummyCpu, dummyCpu, dummyCpu ];
  let master!: () => {};
  before(() => {
    process.env.ROUTER = 'false';
    require('../src/app');
    require.cache[appPath].exports.default = express();
    master = require('../src/master').default;
  });
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
    master();
    assert.equal(stubClusterFork.callCount, 2);
  });
  it('process.env.npm_package_config_cluster', () => {
    process.env.npm_package_config_cluster = '3';
    master();
    assert.equal(stubClusterFork.callCount, 3);
  });
  it('CLUSTERもnpm_package_config_clusterも設定されていない', () => {
    master();
    assert.equal(stubClusterFork.callCount, dummyCpus.length);
  });
  it('process.env.CLUSTERに文字を指定', () => {
    process.env.CLUSTER = 'xxx';
    master();
    assert.equal(stubClusterFork.callCount, dummyCpus.length);
  });

  it('clusterの終了', (done) => {
    stubClusterFork.reset();
    stubClusterFork.callThrough();
    process.env.CLUSTER = '1';
    master();
    const worker = stubClusterFork.firstCall.returnValue;
    worker.process.kill();
    cluster.on('exit', (worker, code, signal) => {
      done();
    });
  });
});
