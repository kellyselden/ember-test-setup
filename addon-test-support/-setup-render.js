import { render as _render } from '@ember/test-helpers';

export default function setupRender(hooks, {
  beforeRender = () => {},
  template,
  afterRender = () => {}
}) {
  hooks.beforeEach(function() {
    this.render = async function render(_template = template) {
      beforeRender.call(this);

      await _render(_template);

      afterRender.call(this);
    };
  });
}
