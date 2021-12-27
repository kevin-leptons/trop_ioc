'use strict'

const assert = require('assert')
const {Config} = require('../lib')

describe('Config', () => {
    it('existed attribute, return value', () => {
        let data = {
            one: 1,
            two: 'two'
        }
        let config = new Config(data)

        assert.strictEqual(config.get('one'), data.one)
        assert.strictEqual(config.get('two'), data.two)
    })

    it('not existed attribute, throws error', () => {
        let data = {
            one: 1,
            two: 'two'
        }
        let config = new Config(data)

        assert.throws(
            () => config.get('foo_bar'),
            {
                name: 'Error',
                message: 'not existed configuration attribute: foo_bar'
            }
        )
    })
})
