'use strict'

const assert = require('assert')
const {Container} = require('@trop/ioc')

class Configuration {
    /**
     * @type {string}
     */
    static get identity() {
        return 'configuration'
    }

    /**
     * @type {Array<string>}
     */
    static get dependencies() {
        return []
    }

    /**
     *
     * @param {number} balanceA
     * @param {number} balanceB
     */
    constructor(balanceA, balanceB) {
        this._balanceA = balanceA
        this._balanceB = balanceB
    }

    /**
     *
     * @param {number} balanceA
     * @param {number} balanceB
     */
    static open(balanceA = 1, balanceB = 2) {
        return new Configuration(balanceA, balanceB)
    }

    close() {}

    /**
     * @type {number}
     */
    get balanceA() {
        return this._balanceA
    }

    /**
     * @type {number}
     */
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
     *
     * @param {number} balance
     */

    constructor(balance) {
        this._balance = balance
    }

    /**
     * @param {Config} config
     * @return {ServiceA}
     */
    static async open(config) {
        return new ServiceA(config.balanceA)
    }

    async close() {
    }

    /**
     * @type {number}
     */
    get balance() {
        return this._balance
    }
}

class ServiceB {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return ['configuration', 'service.a']
    }

    /**
     *
     * @param {number} balance
     */
    constructor(balance) {
        this._balance = balance
    }

    /**
     *
     * @param {Config} config
     * @param {ServiceA} serviceA
     * @return {ServiceB}
     */
    static open(config, serviceA) {
        let balance = config.balanceB + serviceA.balance
        return new ServiceB(balance)
    }

    close() {}

    /**
     * @type {number}
     */
    get balance() {
        return this._balance
    }

    increaseBalance() {
        this._balance += 1
    }
}

async function main() {
    let container = await Container.open({
        configService: Configuration.open(3, 15),
        serviceTypes: [ServiceA, ServiceB]
    })
    let serviceB = container.get('service.b')
    serviceB.increaseBalance()
    assert.strictEqual(serviceB.balance, 19)
    await container.close()
    console.log('ok')
}

main().catch(console.error)
