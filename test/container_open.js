'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')
const {Configuration} = require('./_lib')

class ServiceA {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return ['configuration']
    }

    /**
     * @type {number}
     */
    get balance() {
        return this._balance
    }

    constructor(balance) {
        this._balance = balance
    }

    /**
     *
     * @param {Configuration} config
     * @return {ServiceA}
     */
    static open(config) {
        let balance = config.balanceA
        return new ServiceA(balance)
    }

    close() {}

    increasebalance() {
        this._balance += 1
    }
}

class ServiceB {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return ['configuration', 'service.a']
    }

    constructor(balance) {
        this._balance = balance
    }

    /**
     * @type {number}
     */
    get balance() {
        return this._balance
    }

    /**
     *
     * @param {Configuration} config
     * @param {ServiceA} serviceA
     * @return {ServiceB}
     */
    static open(config, serviceA) {
        serviceA.increasebalance()
        let balance = config.balanceB + serviceA.balance
        return new ServiceB(balance)
    }

    close() {}

    increasebalance() {
        return this._balance += 1
    }
}

class ServiceC {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ServiceC()
    }

    close() {}
}

describe('Container.open', () => {
    it('initialize, run and dispose', async() => {
        let container = await Container.open({
            configService: Configuration.open(10, 15),
            serviceTypes: [ServiceA, ServiceB]
        })
        let actualResult = container.get('service.b').increasebalance()
        let expectedResult = 27
        assert.strictEqual(actualResult, expectedResult)
        await container.close()
        assert.strictEqual(container._serviceMap.size, 0)
    })
    it('conflict service types, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    configService: Configuration.open(10, 15),
                    serviceTypes: [ServiceA, ServiceA]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: conflict ServiceA and ServiceA'
            }
        )
    })
    it('conflict service identities, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    configService: Configuration.open(10, 15),
                    serviceTypes: [ServiceA, ServiceC]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: conflict ServiceA and ServiceC'
            }
        )
    })
})
