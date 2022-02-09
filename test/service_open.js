'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

/**
 * Invalid because of attribute `open` is not a function.
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
 * Invalid because of `open()` does not return service instance.
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
 * Invalid because of `open()` throws error.
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

/**
 * Invalid because of missing attribute `open`.
 */
class ServiceD {
    static get identity() {
        return 'service.d'
    }

    static get dependencies() {
        return []
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
                message: 'config.serviceTypes: ServiceA.open: expect type function'
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
    it('Service.open is missing, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceD]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceD.open: missing'
            }
        )
    })
})
