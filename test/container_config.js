'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

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
                message: 'config.configService: ConfigD.open: expect a function'
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
                message: 'config.configService: ConfigB.close: expect a function'
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
