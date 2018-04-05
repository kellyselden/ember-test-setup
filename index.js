'use strict';

module.exports = {
  name: 'ember-test-setup',

  treeForAddonTestSupport(tree) {
    const Funnel = require('broccoli-funnel');

    tree = new Funnel(tree, {
      destDir: this.moduleName(),
      annotation: `Addon#treeForTestSupport (${this.name})`,
    });

    return this.preprocessJs(tree, '/', this.name, {
      registry: this.registry,
    });
  }
};
