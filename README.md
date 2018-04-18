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

### Installation

* `git clone <repository-url>`
* `cd ember-test-setup`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
