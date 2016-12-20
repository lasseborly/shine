# Shine

[![Travis][build-badge]][build]
[![License][license-badge]][license]

Small CLI for controlling LIFX bulbs.

[build-badge]: https://img.shields.io/travis/lasseborly/shine/master.svg?style=flat-square
[build]: https://travis-ci.org/lasseborly/shine
[license-badge]: https://img.shields.io/npm/l/shine.svg?style=flat-square
[license]: https://www.npmjs.com/package/shine

## Install

```shell
git clone https://github.com/lasseborly/shine.git shine \
&& cd shine/ && sudo npm install -g
```

## Usage

```shell
Usage: shine [options] [command]

Commands:

  list      list bulbs
  toggle    toggle bulbs on/off

Options:

  -h, --help      output usage information
  -V, --version   output the version number
```

### List all

```shell
shine list
```

### List group

```shell
shine list -g BedRoom
``` 

### Toggle all

```shell
shine toggle
```

### Toggle group

```shell
shine toggle -g LivingRoom
```

### Toggle a single bulb

```shell
shine toggle -l Table
```
