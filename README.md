ember-test-setup
==============================================================================

[![npm version](https://badge.fury.io/js/ember-test-setup.svg)](https://badge.fury.io/js/ember-test-setup)
[![Build Status](https://travis-ci.org/kellyselden/ember-test-setup.svg?branch=master)](https://travis-ci.org/kellyselden/ember-test-setup)

Testing shorthands to reduce duplication

Motivation
------------------------------------------------------------------------------

You have many tests with duplicated render setup, templates, and post render code.

```js
test('my test 1', async function(assert) {
  this.setProperties({
    foo: true,
    bar: true
  });

  await render(hbs`
    {{my-component
      foo=foo
      bar=bar
    }}
  `);

  let label = document.querySelector('label');
  let input = document.querySelector('input');

  /// run tests
});

test('my test 2', async function(assert) {
  this.setProperties({
    foo: true,
    bar: true
  });

  await render(hbs`
    {{my-component
      foo=foo
      bar=bar
    }}
  `);

  let label = document.querySelector('label');
  let input = document.querySelector('input');

  /// run tests
});

// more tests
```

You might try to make your own helpers to remove the duplication, but here is a standard solution.

```js
let label, input;

let render = setupRender(hooks, {
  beforeRender() {
    this.setProperties({
      foo: true,
      bar: true
    });
  },
  template: hbs`
    {{my-component
      foo=foo
      bar=bar
    }}
  `,
  afterRender() {
    label = document.querySelector('label');
    input = document.querySelector('input');
  }
});

test('my test 1', async function(assert) {
  await render();

  /// run assertions
});

test('my test 2', async function(assert) {
  await render();

  /// run assertions
});

// more tests
```



Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-test-setup
```


Usage
------------------------------------------------------------------------------

Replace

```js
import { render } from '@ember/test-helpers';
```

with

```js
import { setupRender } from 'ember-test-setup';
```

Then add

```js
let render = setupRender(hooks, {
  beforeRender() {
    // optional
  },
  template: hbs`
    {{my-component
      // ...
    }}
  `,
  afterRender() {
    // optional
  }
});
```

And finally replace all usages of

```js
await render(hbs`
  {{my-component
    // ...
  }}
`);
```

with

```js
await render();
```

It is possible to override the default template, useful for testing default values.

```js
await render(hbs`{{my-component}}`);
```

You can also do this for models and services.

```js
import { setupModel, setupService } from 'ember-test-setup';

setupModel(hooks, {
  beforeModel() {
    // optional
  },
  model: 'my-model',
  init: () => ({
    // optional
  }),
  afterModel(model) {
    // optional
  }
});

setupService(hooks, {
  beforeService() {
    // optional
  },
  service: 'my-service',
  init: () => ({
    // optional
  }),
  afterService(service) {
    // optional
  }
});

let model = this.model({ /* optional */ });
let service = this.service({ /* optional */ });
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
