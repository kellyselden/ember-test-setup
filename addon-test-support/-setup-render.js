import { render as _render } from '@ember/test-helpers';

export default function setupRender(hooks, {
  beforeRender = () => {},
  template,
  afterRender = () => {}
}) {
  async function render(_template = template) {
    beforeRender.call(render._this);

    await _render(_template);

    afterRender.call(render._this);
  }

  hooks.beforeEach(function() {
    render._this = this;
  });

  return render;
}
