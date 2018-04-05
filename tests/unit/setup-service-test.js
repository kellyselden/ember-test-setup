import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupService } from 'ember-test-setup';
import Ember from 'ember';
import Service from '@ember/service';
import sinon from 'sinon';

const MyService = Service.extend({ foo: 'foo' });

module('Unit | setupService', function(hooks) {
  setupTest(hooks);

  let sandbox;

  hooks.beforeEach(function() {
    sandbox = sinon.createSandbox();

    this.owner.register('service:my-service', MyService);
  });

  hooks.afterEach(function() {
    sandbox.restore();
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
      if (Ember.VERSION === '2.12.2') {
        let factoryFor = sandbox.stub(this.owner, 'factoryFor');
        create = sinon.stub().returns('foo');
        factoryFor.withArgs('service:my-service').returns({ create });
      } else {
        let factory = this.owner.factoryFor('service:my-service');
        create = sandbox.stub(factory, 'create').returns('foo');
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
});
