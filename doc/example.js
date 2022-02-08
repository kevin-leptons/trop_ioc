'use strict'

const {Container} = require('@trop/ioc')

class Config {
    /**
     * @type {string}
     */
    static get identity() {
        return 'config'
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
        return new Config(balanceA, balanceB)
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
        return ['config']
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
        return ['config', 'service.a']
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
    let config = new Config(0, 15)
    let container = await Container.open(config, [
        ServiceA, ServiceB
    ])
    let serviceB = container.get('service.b')
    serviceB.increaseBalance()
    console.log(`balance: ${serviceB.balance}`)
    await container.close()
}

main().catch(console.error)
