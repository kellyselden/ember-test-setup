import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupModel } from 'ember-test-setup';
import DS from 'ember-data';
import sinon from 'sinon';

const MyModel = DS.Model.extend({ foo: DS.attr() });

module('Unit | setupModel', function(hooks) {
  setupTest(hooks);

  let sandbox;

  hooks.beforeEach(function() {
    sandbox = sinon.createSandbox();
  });

  hooks.afterEach(function() {
    sandbox.restore();
  });

  module('just model', function(hooks) {
    setupModel(hooks, {
      model: 'my-model',
    });

    hooks.beforeEach(function() {
      this.owner.register('model:my-model', MyModel);
    });

    test('it exists', function(assert) {
      let model = this.model();

      assert.ok(model);
    });

    test('it accepts options', function(assert) {
      let model = this.model({ foo: 'bar' });

      assert.equal(model.get('foo'), 'bar');
    });
  });

  module('beforeModel and afterModel', function(hooks) {
    let beforeModel = sinon.spy();
    let afterModel = sinon.spy();

    setupModel(hooks, {
      beforeModel,
      model: 'my-model',
      afterModel
    });

    let createRecord;

    hooks.beforeEach(function() {
      let store = this.owner.lookup('service:store');
      createRecord = sandbox.stub(store, 'createRecord').returns('foo');
    });

    test('it calls the hooks', function(assert) {
      assert.notOk(beforeModel.called);
      assert.notOk(afterModel.called);
      assert.notOk(createRecord.called);

      let model = this.model({ foo: 'bar' });

      assert.equal(model, 'foo');

      assert.deepEqual(beforeModel.args, [[]]);
      assert.deepEqual(afterModel.args, [['foo']]);
      assert.deepEqual(createRecord.args, [['my-model', { foo: 'bar' }]]);

      assert.ok(beforeModel.calledBefore(createRecord));
      assert.ok(afterModel.calledAfter(createRecord));
    });
  });
});
