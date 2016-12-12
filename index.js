#!/usr/bin/env node
'use strict'

const cmd = require('commander')
const https = require('https')

const token = ''

cmd
  .version('1.0.0')

cmd
  .command('list')
  .description('list bulbs')
  .action(() => list())

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

function list () {
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
