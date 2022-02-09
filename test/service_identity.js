'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

/**
 * Invalid because of attribute `identity` is not a string.
 */
class ServiceA {
    static get identity() {
        return 100
    }
}

/**
 * Invalid because of attribute `identity` has invalid symbols.
 */
class ServiceB {
    static get identity() {
        return 'Service-!@#$'
    }
}

/**
 * Invalid because of attribute `identity` is an empty string.
 */
class ServiceC {
    static get identity() {
        return ''
    }
}

describe('Container.open on Service.identity', () => {
    it('Service.identity is not a string, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceA]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceA.identity: expect type string'
            }
        )
    })
    it('Service.identity has invalid symbols, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceB]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceB.identity: expect string pattern [a-z0-9.]+'
            }
        )
    })
    it('Service.identity is empty string, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceC]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceC.identity: expect string pattern [a-z0-9.]+'
            }
        )
    })
})
