import { FakePlugin } from '..';
import chai from 'chai';

const should = chai.should();

describe('fake plugin', function () {
  it('should exist', function () {
    should.exist(FakePlugin);
  });
});
