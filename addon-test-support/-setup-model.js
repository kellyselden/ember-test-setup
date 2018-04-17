import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';

export default function setupModel(hooks, {
  beforeModel = () => {},
  model: _model,
  init = () => {},
  afterModel = () => {}
}) {
  hooks.beforeEach(function() {
    this.model = function model(options = {}) {
      beforeModel.call(this);

      let store = this.owner.lookup('service:store');
      options = assign({}, init(), options);
      let subject = run(() => store.createRecord(_model, options));

      afterModel.call(this, subject);

      return subject;
    };
  });
}
