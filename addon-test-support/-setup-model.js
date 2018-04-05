import { run } from '@ember/runloop';

export default function setupModel(hooks, {
  beforeModel = () => {},
  model: _model,
  afterModel = () => {}
}) {
  hooks.beforeEach(function() {
    this.model = function model(options = {}) {
      beforeModel.call(this);

      let store = this.owner.lookup('service:store');
      let subject = run(() => store.createRecord(_model, options));

      afterModel.call(this, subject);

      return subject;
    };
  });
}
