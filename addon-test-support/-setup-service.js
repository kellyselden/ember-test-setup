export default function setupService(hooks, {
  beforeService = () => {},
  service: _service,
  afterService = () => {}
}) {
  hooks.beforeEach(function() {
    this.service = function service(options = {}) {
      beforeService.call(this);

      let subject = this.owner.factoryFor(`service:${_service}`).create(options);

      afterService.call(this, subject);

      return subject;
    };
  });
}
