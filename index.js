#!/usr/bin/env node
'use strict'

const cmd = require('commander')
const https = require('https')
const token = require('./token.js')

cmd
  .version('1.0.0')

cmd
  .command('list [env]')
  .description('list bulbs')
  .action((env, options) => list(env, options))

cmd
  .command('toggle')
  .description('toggle bulbs on/off')
  .action(() => toggle())

cmd
  .command('raw')
  .description('get raw data')
  .action(() => raw())

cmd.parse(process.argv)

function raw () {
  lifx('get', 'lights/all')
  .then(res => {
    res.forEach(bulb => {
      console.log(bulb)
    })
  })
  .catch(err => console.log(err))
}

function list (env, options) {

  if(options.group) {
    lifx('get', `lights/group:${options.group}`)
    .then(res => {
      res.forEach(bulb => {
        console.log(bulb.label)
      })
    })
  .catch(err => console.log(err))
  } else {
    lifx('get', 'lights/all')
    .then(res => {
      res.forEach(bulb => {
        console.log(`Name: ${bulb.label}`)
        console.log(`Connected: ${bulb.connected}`)
        console.log(`Power: ${bulb.power}`)
        console.log(`Group: ${bulb.group.name}`)
        console.log('------------------------------')
      })
    })
    .catch(err => console.log(err))
  }
}

function toggle () {
  lifx('post', 'lights/all/toggle')
  .then(res => {
    res.results.forEach(bulb => {
      console.log(`Name: ${bulb.label} Status: ${bulb.status}`)
    })
  })
  .catch(err => console.log(err))
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
      if (res.statusCode != 200) {
        reject(res.statusCode)
      }

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
