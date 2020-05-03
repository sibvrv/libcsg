#!/usr/bin/env node
'use strict';

const fs = require('fs');

const wipeDependencies = () => {
  const file = fs.readFileSync('package.json');
  const content = JSON.parse(file);

  for (var devDep in content.devDependencies) {
    if (content.devDependencies.hasOwnProperty(devDep) && !content.devDependencies[devDep].includes('git')) {
      content.devDependencies[devDep] = '*';
    }
  }

  for (var dep in content.dependencies) {
    if (content.dependencies.hasOwnProperty(dep) && !content.dependencies[dep].includes('git')) {
      content.dependencies[dep] = '*';
    }
  }

  fs.writeFileSync('package.json', JSON.stringify(content, null, 2));
};

wipeDependencies();
