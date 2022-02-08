'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')
const {Config} = require('./_lib')

/**
 * Invalid service because it's identity is not a string.
 */
class ServiceA {
    static get identity() {
        return 100
    }
}

/**
 * Invalid service because it's identity has invalid symbols.
 */
class ServiceB {
    static get identity() {
        return 'Service-!@#$'
    }
}

/**
 * Invalid service because it's identity is an empty string.
 */
class ServiceC {
    static get identity() {
        return ''
    }
}

describe('Container.open on Service.identity', () => {
    it('Service.identity is not a string, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceA])
            },
            {
                constructor: TypeError,
                message: 'expect a string pattern [a-z0-9.]+: ServiceA.identity'
            }
        )
    })
    it('Service.identity has invalid symbols, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceB])
            },
            {
                constructor: TypeError,
                message: 'expect a string pattern [a-z0-9.]+: ServiceB.identity'
            }
        )
    })
    it('Service.identity is empty string, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceC])
            },
            {
                constructor: TypeError,
                message: 'expect a string pattern [a-z0-9.]+: ServiceC.identity'
            }
        )
    })
})
