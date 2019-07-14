import { fake, stub, SinonStub } from 'sinon';
import * as assert from 'assert';
import { Request, Response } from 'express';
import { mockReq, mockRes } from 'sinon-express-mock';
import { notFoundErrorHandler, errorHandler } from '../src/middleware';

describe('middleware', () => {
  let req!: Request;
  let res!: Response;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });
  describe('notFoundErrorHandler', () => {
    it('正常系', () => {
      notFoundErrorHandler(req, res, () => {});
      assert.ok((res['sendStatus'] as SinonStub).calledOnce);
      assert.deepEqual((res['sendStatus'] as SinonStub).firstCall.args, [ 404 ]);
    });
  });
  describe('errorHandler', () => {
    let stubConsoleError!: SinonStub;
    const dummyError = new Error('dummy error');
    before(() => {
      stubConsoleError = stub(console, 'error');
    });
    beforeEach(() => {
      stubConsoleError.reset();
      stubConsoleError.callsFake(fake());
    });
    after(() => {
      stubConsoleError.restore();
    });
    it('正常系', () => {
      errorHandler(dummyError, req, res, () => {});
      assert.ok(stubConsoleError.calledOnce);
      assert.deepEqual(stubConsoleError.firstCall.args, [ dummyError.stack ]);
      assert.ok((res['sendStatus'] as SinonStub).calledOnce);
      assert.deepEqual((res['sendStatus'] as SinonStub).firstCall.args, [ 500 ]);
    });
  });
});
