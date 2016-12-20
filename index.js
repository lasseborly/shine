#!/usr/bin/env node
'use strict'

const cmd = require('commander')
const https = require('https')
let token = null;

try {
  token = require('./token.js') 
} catch (error) {
  token = process.env.LIFX_TOKEN
}

cmd
  .version('0.0.1')

cmd
  .command('list [options]')
  .description('list bulbs')
  .option('-g, --group [group]', 'List bulbs from a group')
  .action((env, options) => list(env, options))

cmd
  .command('toggle [options]')
  .description('toggle bulbs on/off')
  .option('-g, --group [group]', 'Toggle bulbs from a group')
  .option('-l, --label [label]', 'Toggle bulb')
  .action((env, options) => toggle(env, options))

cmd.parse(process.argv)

function list (env, options) {
  if(options.group) {
    lifx('get', `lights/group:${options.group}`)
    .then(res => {
      console.log('------------------------------')
      res.forEach(bulb => {
        console.log(`Label: ${bulb.label}`)
        console.log(`Connected: ${bulb.connected}`)
        console.log(`Power: ${bulb.power}`)
        console.log('------------------------------')
      })
    })
  .catch(err => console.log(err))
  } else {
    lifx('get', 'lights/all')
    .then(res => {
      console.log('------------------------------')
      res.forEach(bulb => {
        console.log(`Label: ${bulb.label}`)
        console.log(`Connected: ${bulb.connected}`)
        console.log(`Power: ${bulb.power}`)
        console.log(`Group: ${bulb.group.name}`)
        console.log('------------------------------')
      })
    })
    .catch(err => console.log(err))
  }
}

function toggle (env, options) {
  if(options.group) {
    lifx('post', `lights/group:${options.group}/toggle`)
    .then(res => {
      console.log('------------------------------')
      res.results.forEach(bulb => {
        console.log(`Label: ${bulb.label}`)
        console.log(`Status: ${bulb.status}`)
        console.log('------------------------------')
      })
    })
    .catch(err => console.log(err))
  } else if (options.label) {
    lifx('post', `lights/label:${options.label}/toggle`)
    .then(res => {
      console.log('------------------------------')
      res.results.forEach(bulb => {
        console.log(`Label: ${bulb.label}`)
        console.log(`Status: ${bulb.status}`)
        console.log('------------------------------')
      })
    })
    .catch(err => console.log(err))
  } else {
    lifx('post', 'lights/all/toggle')
    .then(res => {
      console.log('------------------------------')
      res.results.forEach(bulb => {
        console.log(`Label: ${bulb.label}`)
        console.log(`Status: ${bulb.status}`)
        console.log('------------------------------')
      })
    })
    .catch(err => console.log(err))
  }

}

function lifx (method, path) {
  const options = {
    hostname: 'api.lifx.com',
    port: 443,
    path: `/v1/${path}`,
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {

      let body = ''
      res.on('data', data => {
        body += data
      })
      res.on('end', () => {
        resolve(JSON.parse(body))
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.end()
  })
}
