import { fake, stub, SinonStub } from 'sinon';
import assert from 'assert';
import cluster from 'cluster';
import * as master from '../src/master';
import * as worker from '../src/worker';

describe('server', () => {
  let stubClusterIsMaster!: SinonStub;
  let stubMaster!: SinonStub;
  let stubWorker!: SinonStub;
  const serverPath = require.resolve('../src/server.ts');
  beforeEach(() => {
    delete require.cache[serverPath];
  });
  before(() => {
    stubClusterIsMaster = stub(cluster, 'isMaster');
    stubMaster = stub(master, 'default');
    stubWorker = stub(worker, 'default');
  });
  beforeEach(() => {
    stubClusterIsMaster.reset();
    stubMaster.reset();
    stubWorker.reset();
    stubClusterIsMaster.callsFake(fake());
    stubMaster.callsFake(fake());
    stubWorker.callsFake(fake());
  });
  after(() => {
    stubClusterIsMaster.restore();
    stubMaster.restore();
    stubWorker.restore();
  });
  it('master', () => {
    stubClusterIsMaster.value(true);
    require('../src/server');
    assert.ok(stubMaster.calledOnce);
    assert.ok(stubWorker.notCalled);
  });
  it('worker', () => {
    stubClusterIsMaster.value(undefined);
    require('../src/server');
    assert.ok(stubMaster.notCalled);
    assert.ok(stubWorker.calledOnce);
  });
});
