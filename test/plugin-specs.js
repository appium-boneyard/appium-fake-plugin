import { FakePlugin } from '..';
import B from 'bluebird';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const should = chai.should();

class FakeExpress {
  constructor () {
    this.routes = {};
  }

  all (route, handler) {
    this.routes[route] = handler;
  }

  async get (route) {
    return await new B((resolve, reject) => {
      try {
        const res = {
          send: resolve,
        };
        this.routes[route]({}, res);
      } catch (e) {
        reject(e);
      }
    });
  }
}

describe('fake plugin', function () {
  it('should exist', function () {
    should.exist(FakePlugin);
  });

  it('should update an express app with a fake route', async function () {
    const p = new FakePlugin('fake');
    const app = new FakeExpress();
    await app.get('/fake').should.eventually.be.rejected;
    p.updateServer(app);
    await app.get('/fake').should.eventually.eql(JSON.stringify({fake: 'fakeResponse'}));
  });

  it('should wrap find element', async function () {
    const p = new FakePlugin('fake');
    await p.wrapCommand(() => ({el: 'fakeEl'}), {}, 'findElement', 'arg1', 'arg2').should.eventually.eql({
      el: 'fakeEl',
      fake: true,
    });
  });

  it('should handle page source', async function () {
    const p = new FakePlugin('fake');
    await p.handleCommand({}, 'getPageSource', 'arg1', 'arg2').should.eventually.eql(
      '<Fake>["arg1","arg2"]</Fake>'
    );
  });
});
