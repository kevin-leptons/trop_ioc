'use strict'

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
        return new ServiceA()
    }

    close() {}
}

class ConfigA {
    static get identity() {
        return ''
    }

    static open() {
        return new ConfigA()
    }
}

class ConfigB {
    static get identity() {
        return 'config.a'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ConfigB()
    }

    get close() {
        return 100
    }
}

describe('Container.open on config', () => {
    it('config is not an object, throws error', async() => {
        let config = 100
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceA])
            },
            {
                constructor: TypeError,
                message: 'expect an object: config'
            }
        )
    })
    it('config.identity is empty string, throws error', async() => {
        let config = ConfigA.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceA])
            },
            {
                constructor: TypeError,
                message: 'expect a string pattern [a-z0-9.]+: ConfigA.identity'
            }
        )
    })
    it('config.close is not a function, throws error', async() => {
        let config = ConfigB.open()
        await assert.rejects(
            async() => {
                await Container.open(config, [ServiceA])
            },
            {
                constructor: TypeError,
                message: 'expect a function: ConfigB.close'
            }
        )
    })
})
