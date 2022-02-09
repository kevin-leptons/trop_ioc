'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

/**
 * Invalid because of attribute `identity` is not `configuration`.
 */
class ConfigA {
    static get identity() {
        return 'config.a'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ConfigA()
    }

    close() {}
}

/**
 * Invalid because of attribute `close` is not a function.
 */
class ConfigB {
    static get identity() {
        return 'configuration'
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

/**
 * Invalid because of attribute `dependencies` is not empty.
 */
class ConfigC {
    static get identity() {
        return 'configuration'
    }

    static get dependencies() {
        return ['service.x']
    }

    static open() {
        return new ConfigC()
    }

    close() {}
}

/**
 * Invalid because of attribute `open` is not a function.
 */
class ConfigD {
    static get identity() {
        return 'configuration'
    }

    static get dependencies() {
        return []
    }

    static get open() {
        return new ConfigD()
    }
}

describe('Container.open throws error on configService', () => {
    it('config is not an object', async() => {
        let configService = 100
        await assert.rejects(
            async() => {
                await Container.open({configService})
            },
            {
                constructor: TypeError,
                message: 'config.configService: expect an object'
            }
        )
    })
    it('config.identity is not "configuration"', async() => {
        let configService = ConfigA.open()
        await assert.rejects(
            async() => {
                await Container.open({configService})
            },
            {
                constructor: TypeError,
                message: 'config.configService: ConfigA.identity: expect \'configuration\''
            }
        )
    })
    it('config.open is not a function', async() => {
        let configService = new ConfigD()
        await assert.rejects(
            async() => {
                await Container.open({configService})
            },
            {
                constructor: TypeError,
                message: 'config.configService: ConfigD.open: expect type function'
            }
        )
    })
    it('config.close is not a function', async() => {
        let configService = ConfigB.open()
        await assert.rejects(
            async() => {
                await Container.open({configService})
            },
            {
                constructor: TypeError,
                message: 'config.configService: ConfigB.close: expect type function'
            }
        )
    })
    it('config.dependencies is not an empty array', async() => {
        let configService = ConfigC.open()
        await assert.rejects(
            async() => {
                await Container.open({configService})
            },
            {
                constructor: TypeError,
                message: 'config.configService: ConfigC.dependencies: expect an empty array'
            }
        )
    })
})
