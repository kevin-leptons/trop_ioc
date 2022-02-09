'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

class ServiceA {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return []
    }

    /**
     *
     * @return {ServiceA}
     */
    static open() {
        return new ServiceA()
    }

    close() {}
}

/**
 * Invalid service because of identity is an empty string.
 */
class ServiceB {
    static get identity() {
        return ''
    }

    static get dependencies() {
        return []
    }

    /**
     *
     * @return {ServiceB}
     */
    static open() {
        return new ServiceB()
    }

    close() {}
}

/**
 * Invalid service because of open is not a function.
 */
class ServiceC {
    static get identity() {
        return 'service.c'
    }

    static get dependencies() {
        return []
    }

    /**
     *
     * @return {number}
     */
    static get open() {
        return 100
    }

    close() {}
}

/**
 * Invalid service because of close is not a function.
 */
class ServiceD {
    static get identity() {
        return 'service.d'
    }

    static get dependencies() {
        return []
    }

    /**
     *
     * @return {number}
     */
    static open() {
        return new ServiceD()
    }

    get close() {
        return 100
    }
}

describe('Container.set', () => {
    it('service is not an object, throws error', async() => {
        let container = await Container.open()
        let service = null
        assert.throws(
            () => {
                container.set(service)
            },
            {
                constructor: TypeError,
                message: 'service: expect an object'
            }
        )
    })
    it('service.identity is conflict, throws error', async() => {
        let container = await Container.open({
            serviceTypes: [ServiceA]
        })
        let serviceA = ServiceA.open()
        assert.throws(
            () => {
                container.set(serviceA)
            },
            {
                constructor: TypeError,
                message: 'service: ServiceA: conflict identity'
            }
        )
    })
    it('service.identity is invalid, throws error', async() => {
        let container = await Container.open()
        let service = ServiceB.open()
        assert.throws(
            () => {
                container.set(service)
            },
            {
                constructor: TypeError,
                message: 'service: ServiceB.identity: expect a string pattern [a-z0-9.]+'
            }
        )
    })
    it('service.open is not a function, throws error', async() => {
        let container = await Container.open()
        let service = new ServiceC()
        assert.throws(
            () => {
                container.set(service)
            },
            {
                constructor: TypeError,
                message: 'service: ServiceC.open: expect a function'
            }
        )
    })
    it('service.close is not a function, throws error', async() => {
        let container = await Container.open()
        let service = new ServiceD()
        assert.throws(
            () => {
                container.set(service)
            },
            {
                constructor: TypeError,
                message: 'service: ServiceD.close: expect a function'
            }
        )
    })
})
