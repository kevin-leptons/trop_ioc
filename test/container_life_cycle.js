'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

class Configuration {
    static get identity() {
        return 'configuration'
    }

    static get dependencies() {
        return []
    }

    constructor(balanceA, balanceB) {
        this._balanceA = balanceA
        this._balanceB = balanceB
    }

    static open(balanceA = 1, balanceB = 2) {
        return new Configuration(balanceA, balanceB)
    }

    close() {}

    get balanceA() {
        return this._balanceA
    }

    get balanceB() {
        return this._balanceB
    }
}

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
        return 'service.c'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ServiceC()
    }

    close() {}
}

describe('Container life cycle', () => {
    it('initialize, get, set, rund and dispose', async() => {
        let container = await Container.open({
            configService: Configuration.open(10, 15),
            serviceTypes: [ServiceA, ServiceB]
        })
        assert.strictEqual(container instanceof Container, true)
        let serviceC = ServiceC.open()
        container.set(serviceC)
        let gotServiceC = container.get('service.c')
        assert.deepStrictEqual(gotServiceC, serviceC)
        let serviceB = container.get('service.b')
        assert.strictEqual(serviceB instanceof ServiceB, true)
        let actualResult = serviceB.increasebalance()
        let expectedResult = 27
        assert.strictEqual(actualResult, expectedResult)
        await container.close()
        assert.strictEqual(container._serviceMap.size, 0)
    })
})
