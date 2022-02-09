'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

/**
 * Invalid service because it's `open()` is not a function.
 */
class ServiceA {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return []
    }

    static get open() {
        return 100
    }

    close() {}
}

/**
 * Invalid service because it's `open()` does not return service instance.
 */
class ServiceB {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return 100
    }

    close() {}
}

/**
 * Invalid service because it's `open()` throws error.
 */
class ServiceC {
    static get identity() {
        return 'service.c'
    }

    static get dependencies() {
        return []
    }

    static open() {
        throw new Error('oops!')
    }

    close() {}
}

describe('Container.open, throws error on Service.open', () => {
    it('Service.open is not a function, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceA]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceA.open: expect a function'
            }
        )
    })
    it('Service.open does not return instance of service, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceB]
                })
            },
            {
                constructor: TypeError,
                message: 'ServiceB.open return: expect a service instance'
            }
        )
    })
    it('Service.open throws error, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceC]
                })
            },
            {
                constructor: Error,
                message: 'oops!'
            }
        )
    })
})
