'use strict'
const https = require('https')

module.exports = class LIFX {

  constructor (token) {
    this.token = token
  }

/**
 * List available lights.
 */
  list (env, options) {
    if(options.group) {
      this.api('get', `lights/group:${options.group}`)
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
      this.api('get', 'lights/all')
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

/**
 * Toggle lights on/off
 */
  toggle (env, options) {
    return new Promise((resolve, reject) => {
      if (options.group) {
        this.api('post', `lights/group:${options.group}/toggle`)
        .then(res => {
          console.log('------------------------------')
          res.results.forEach(bulb => {
            console.log(`Label: ${bulb.label}`)
            console.log(`Status: ${bulb.status}`)
            console.log('------------------------------')
          })
          resolve({success: 'group'})
        })
        .catch(err => reject(err))
      } else if (options.label) {
        this.api('post', `lights/label:${options.label}/toggle`)
        .then(res => {
          console.log('------------------------------')
          res.results.forEach(bulb => {
            console.log(`Label: ${bulb.label}`)
            console.log(`Status: ${bulb.status}`)
            console.log('------------------------------')
          })
          resolve({success: 'label'})
        })
        .catch(err => reject(err))
      } else {
        this.api('post', 'lights/all/toggle')
        .then(res => {
          console.log('------------------------------')
          res.results.forEach(bulb => {
            console.log(`Label: ${bulb.label}`)
            console.log(`Status: ${bulb.status}`)
            console.log('------------------------------')
          })
          resolve({success: 'all'})
        })
        .catch(err => reject(err))
      }
    })
  }

/**
 * Abstraction of requests made for the LIFX API.
 */
  api (method, path) {
    const options = {
      hostname: 'api.lifx.com',
      port: 443,
      path: `/v1/${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${this.token}`
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

}