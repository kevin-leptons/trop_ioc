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

    it('existed attribute, value=false, return correct value', () => {
        let data = {
            foo: false
        }
        let expectedResult = false
        let config = new Config(data)
        let actualResult = config.get('foo')

        assert.deepStrictEqual(actualResult, expectedResult)
    })

    it('existed attribute, value=0, return correct value', () => {
        let data = {
            foo: 0
        }
        let expectedResult = 0
        let config = new Config(data)
        let actualResult = config.get('foo')

        assert.deepStrictEqual(actualResult, expectedResult)
    })

    it('existed attribute, value=undefined, return correct value', () => {
        let data = {
            foo: undefined
        }
        let expectedResult = undefined
        let config = new Config(data)
        let actualResult = config.get('foo')

        assert.deepStrictEqual(actualResult, expectedResult)
    })

    it('existed attribute, value=null, return correct value', () => {
        let data = {
            foo: null
        }
        let expectedResult = null
        let config = new Config(data)
        let actualResult = config.get('foo')

        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
