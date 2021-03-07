import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupService } from 'ember-test-setup';
import { VERSION } from '@ember/version';
import Service from '@ember/service';
import sinon from 'sinon';

class MyService extends Service { foo = 'foo' }

module('Unit | setupService', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:my-service', MyService);
  });

  hooks.afterEach(function() {
    sinon.restore();
  });

  module('just service', function(hooks) {
    setupService(hooks, {
      service: 'my-service',
    });

    test('it exists', function(assert) {
      let service = this.service();

      assert.equal(service.get('foo'), 'foo');
    });

    test('it accepts options', function(assert) {
      let service = this.service({ bar: 'bar' });

      assert.equal(service.get('bar'), 'bar');
    });
  });

  module('beforeService and afterService', function(hooks) {
    let beforeService = sinon.spy();
    let afterService = sinon.spy();

    setupService(hooks, {
      beforeService,
      service: 'my-service',
      afterService
    });

    let create;

    hooks.beforeEach(function() {
      if (VERSION === '2.12.2') {
        let factoryFor = sinon.stub(this.owner, 'factoryFor');
        create = sinon.stub().returns('foo');
        factoryFor.withArgs('service:my-service').returns({ create });
      } else {
        let factory = this.owner.factoryFor('service:my-service');
        create = sinon.stub(factory, 'create').returns('foo');
      }
    });

    test('it calls the hooks', function(assert) {
      assert.notOk(beforeService.called);
      assert.notOk(afterService.called);
      assert.notOk(create.called);

      let service = this.service({ bar: 'bar' });

      assert.equal(service, 'foo');

      assert.deepEqual(beforeService.args, [[]]);
      assert.deepEqual(afterService.args, [['foo']]);
      assert.deepEqual(create.args, [[{ bar: 'bar' }]]);

      assert.ok(beforeService.calledBefore(create));
      assert.ok(afterService.calledAfter(create));
    });
  });

  module('init', function(hooks) {
    setupService(hooks, {
      service: 'my-service',
      init: () => ({
        bar: 'bar',
        baz: 'baz'
      })
    });

    test('it accepts init', function(assert) {
      let service = this.service();

      assert.equal(service.get('bar'), 'bar');
    });

    test('it merges init and options', function(assert) {
      let service = this.service({ bar: 'baz' });

      assert.equal(service.get('bar'), 'baz', 'options takes precedence');
      assert.equal(service.get('baz'), 'baz', 'init is still used');
    });
  });
});
