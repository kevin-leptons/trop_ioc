'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')
const {Config} = require('./_lib')

/**
 * Invalid service because it's dependencies is not an array.
 */
class ServiceA {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return 100
    }
}

/**
 * Invalid service because it's dependencies has non-string item.
 */
class ServiceB {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return [100]
    }
}

/**
 * Invalid service because it's dependencies has invalid symbols item.
 */
class ServiceC {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return ['Service-X!@#$%']
    }
}

/**
 * Invalid service because it's dependencies has empty item.
 */
class ServiceD {
    static get identity() {
        return 'service.d'
    }

    static get dependencies() {
        return ['']
    }
}

describe('Container.open on Service.dependencies', () => {
    it('Service.dependencies is not an array, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceA])
            },
            {
                constructor: TypeError,
                message: 'expect a string array: ServiceA.dependencies'
            }
        )
    })
    it('Service.dependencies has non-string item, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceB])
            },
            {
                constructor: TypeError,
                message: 'expect a string array: ServiceB.dependencies'
            }
        )
    })
    it('Service.dependencies has invalid symbols item, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceC])
            },
            {
                constructor: TypeError,
                message: 'expect a string array: ServiceC.dependencies'
            }
        )
    })
    it('Service.dependencies has empty item, throws error', async() => {
        let config = Config.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceD])
            },
            {
                constructor: TypeError,
                message: 'expect a string array: ServiceD.dependencies'
            }
        )
    })
})
