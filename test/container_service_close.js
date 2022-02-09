'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

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

describe('Container.close, throws error on Service.close', () => {
    it('Service.close is not a function, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceA]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceA.close: expect a function'
            }
        )
    })
    it('Service.close throws error, throws error', async() => {
        let container = await Container.open({
            serviceTypes: [ServiceB]
        })
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
