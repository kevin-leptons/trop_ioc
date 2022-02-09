'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

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
     * @return {ServiceA}
     */
    static open() {
        return new ServiceA()
    }

    close() {}

    increasebalance() {
        this._balance += 1
    }
}

/**
 * This is invalid if it is initialization with `ServiceA` because of
 * conflict identity.
 */
class ServiceB {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ServiceB()
    }

    close() {}
}

describe('Container.open throws error on serviceTypes', () => {
    it('conflict service types, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
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
                    serviceTypes: [ServiceA, ServiceB]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: conflict ServiceA and ServiceB'
            }
        )
    })
})
