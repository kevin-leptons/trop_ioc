'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')
const {Config} = require('./_lib')

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

describe('Container.open on Service.dependencies', () => {
    it('Service.open is not a function, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceA])
            },
            {
                constructor: TypeError,
                message: 'expect a function: ServiceA.open'
            }
        )
    })
    it('Service.open does not return instance of service, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceB])
            },
            {
                constructor: TypeError,
                message: 'expect an instance service: ServiceB.open'
            }
        )
    })
    it('Service.open throws error, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceC])
            },
            {
                constructor: Error,
                message: 'oops!'
            }
        )
    })
})
