# Table of Contents

* [Getting Started](#getting-started)
* [API References](#api-references)
* [Development](#development)
* [Packaging and Distribution](#packaging-and-distribution)

# Getting Started

See [example.js](./example.js)

# API References

See [API References at Github Page](https://kevin-leptons.github.io/trop_ioc).

# Development

```bash
# Install dependency packages and ensure source code is fine.
npm install
npm run standardize
npm test

# Make documents and put to directory `docs` for Git Hub page.
# And serve documents from local machine as HTTP server.
npm run doc
npm run doc-server

# Test an example at `doc/example.js`.
npm link
npm link @trop/ioc
npm run example
```

# Packaging and Distribution

```bash
npm publish
```
