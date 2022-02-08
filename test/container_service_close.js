'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')
const {Config} = require('./_lib')

/**
 * Invalid service because it's `close()` is not a function.
 */
class ServiceA {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ServiceA()
    }

    static close = 100
}

/**
 * Invalid service because it's `close()` throws error.
 */
class ServiceB {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ServiceB()
    }

    close() {
        throw new Error('oops!')
    }
}

describe('Container.close on Service.dependencies', () => {
    it('Service.close is not a function, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceA])
            },
            {
                constructor: TypeError,
                message: 'expect a function: ServiceA.close'
            }
        )
    })
    it('Service.close throws error, throws error', async() => {
        let config = Config.open()
        let container = await Container.open(config, [ServiceB])
        await assert.rejects(
            async() => {
                await container.close()
            },
            {
                constructor: Error,
                message: 'closing services'
            }
        )
    })
})
