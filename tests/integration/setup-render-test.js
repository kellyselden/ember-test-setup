import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupRender } from 'ember-test-setup';
import hbs from 'htmlbars-inline-precompile';

module('Integration | setupRender', function(hooks) {
  setupRenderingTest(hooks);

  module('just template', function(hooks) {
    let render = setupRender(hooks, {
      template: hbs`foo`,
    });

    test('it renders', async function(assert) {
      await render();

      assert.equal(this.element.textContent, 'foo');
    });

    test('it overrides template', async function(assert) {
      await render(hbs`bar`);

      assert.equal(this.element.textContent, 'bar');
    });
  });

  module('beeforeRender and afterRender', function(hooks) {
    let foo;

    let render = setupRender(hooks, {
      beforeRender() {
        this.set('foo', 'bar');
      },
      template: hbs`{{foo}}`,
      afterRender() {
        foo = this.element;
      }
    });

    test('it renders', async function(assert) {
      await render();

      assert.equal(foo.textContent, 'bar');
    });
  });
});
