# arsoedjono.github.io

Personal Github page of `arsoedjono`

# Prerequisites

- Ruby v3.3.1 (I am using RVM for ruby version management)
- Node LTS 20 (I am using fnm for node version management)
- Makefile

# How to Run Server Locally

```bash
make
```

# Dependency Scripts

## Sprite Generator

```bash
### Install
cd sprite-generator
npm install

### Run
node generate-sprite.js "<images-glob>" "<output-path>"
node generate-sprite.js "sts2/img/badges/*.png" "sts2/badges"    # example

### Help command
node generate-sprite.js
```
