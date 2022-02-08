'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')
const {Config} = require('./_lib')

class ServiceA {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return ['config']
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
     * @param {Config} config
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
        return ['config', 'service.a']
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
     * @param {Config} config
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

describe('Container.open', () => {
    it('initialize, run and dispose', async() => {
        let config = Config.open(10, 15)
        let container = await Container.open(config, [
            ServiceA, ServiceB
        ])
        let actualResult = container.get('service.b').increasebalance()
        let expectedResult = 27
        assert.strictEqual(actualResult, expectedResult)
        await container.close()
        assert.strictEqual(container._serviceMap.size, 0)
    })
})
