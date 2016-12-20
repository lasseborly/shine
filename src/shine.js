#!/usr/bin/env node
'use strict'

const cmd = require('commander')
const LIFX = require('./LIFX.js')
const lifx = new LIFX(process.env.LIFX_TOKEN || require('../token.js'))

cmd
  .version('0.0.1')

cmd
  .command('list [options]')
  .description('list bulbs')
  .option('-g, --group [group]', 'List bulbs from a group')
  .action((env, options) => lifx.list(env, options))

cmd
  .command('toggle [options]')
  .description('toggle bulbs on/off')
  .option('-g, --group [group]', 'Toggle bulbs from a group')
  .option('-l, --label [label]', 'Toggle bulb')
  .action((env, options) => lifx.toggle(env, options))

cmd.parse(process.argv)
