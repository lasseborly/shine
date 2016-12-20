const LIFX = require('../src/LIFX.js')
const lifx = new LIFX(process.env.LIFX_TOKEN || require('../token.js'))
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

test('Retrieve all bulbs', () => {
  lifx.api('get', 'lights/all')
    .then(res => expect(res.length).toBeGreaterThanOrEqual(0))
})

test('Retrieve a group of bulbs', () => {
  lifx.api('get', 'lights/group:Lasse')
    .then(res => expect(res.length).toBeGreaterThanOrEqual(0))
})

test('Toggle all bulbs', () => {
  lifx.api('post', 'lights/all/toggle')
    .then(res => expect(res.results.length).toBeGreaterThanOrEqual(0))
})

test('Toggle a group of bulbs', () => {
  lifx.api('post', 'lights/group:Lasse/toggle')
    .then(res => expect(res.results.length).toBeGreaterThanOrEqual(0))
})

test('Toggle a single bulb', () => {
  lifx.api('post', 'lights/label:Table/toggle')
    .then(res => expect(res.results.length).toBeGreaterThanOrEqual(0))
})

test('Toogle - Group', () => {
  return lifx.toggle({}, {group: 'Lasse'})
  .then(res => expect(res.success).toBe('group'))
})