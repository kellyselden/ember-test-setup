import { render as _render } from '@ember/test-helpers';

export default function setupRender(hooks, {
  beforeRender = () => {},
  template,
  afterRender = () => {}
}) {
  let _this;

  async function render(_template = template) {
    beforeRender.call(_this);

    await _render(_template);

    afterRender.call(_this);
  }

  hooks.beforeEach(function() {
    _this = this;
  });

  return render;
}
