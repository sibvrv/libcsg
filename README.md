## :diamond_shape_with_a_dot_inside: LibCSG

## Constructive Solid Geometry (CSG) Library

 Solid modelling library (2d & 3d)

## Overview

Constructive Solid Geometry (CSG) is a modelling technique that uses Boolean operations like union and intersection to combine 3D solids. This library implements CSG operations on meshes elegantly and concisely using BSP trees, and is meant to serve as an easily understandable implementation of the algorithm.

> The developers of the main project (JSCAD) are busy creating the second version of the API. 
> Because the first version is needed for my own purposes. 
> It was decided to continue developing the first version.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Installation

```
npm install sibvrv/libcsg
```

## Usage

- as Node module :

```
const csg = require('libcsg')
```

## API

The API documentation can be found [here](./docs/api.md).

Also see the [OpenJsCad User Guide](https://en.wikibooks.org/wiki/OpenJSCAD_User_Guide).

## Contribute

This library is part of the JSCAD Organization, and is maintained by a group of volunteers. We welcome and encourage anyone to pitch in but please take a moment to read the following guidelines.

* If you want to submit a bug report please make sure to follow the [Reporting Issues](https://github.com/jscad/csg.js/wiki/Reporting-Issues) guide. Bug reports are accepted as [Issues](https://github.com/sibvrv/libcsg/issues/) via GitHub.

* If you want to submit a change or a patch, please see the [Contributing guidelines](https://github.com/jscad/csg.js/blob/master/CONTRIBUTING.md). New contributions are accepted as [Pull Requests](https://github.com/sibvrv/libcsg/pulls/) via GithHub.

* We only accept bug reports and pull requests on **GitHub**.

* If you have a question about how to use libCSG. You might find the answer in the [OpenJSCAD.org User Guide](https://github.com/Spiritdude/OpenJSCAD.org/wiki/User-Guide).

## Copyrights

Some copyrights apply. 
* Copyright (c) 2012 Joost Nieuwenhuijse (joost@newhouse.nl), under the MIT license. 
* Copyright (c) 2011 Evan Wallace (http://madebyevan.com/)

## License

[The MIT License (MIT)](https://github.com/sibvrv/libcsg/blob/master/LICENSE)

(unless specified otherwise)
