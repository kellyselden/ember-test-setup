import { assign } from '@ember/polyfills';

export default function setupService(
  hooks,
  {
    beforeService = () => {},
    service: _service,
    init = () => {},
    afterService = () => {},
  }
) {
  hooks.beforeEach(function () {
    this.service = function service(options = {}) {
      beforeService.call(this);

      options = assign({}, init(), options);
      let subject = this.owner
        .factoryFor(`service:${_service}`)
        .create(options);

      afterService.call(this, subject);

      return subject;
    };
  });
}
