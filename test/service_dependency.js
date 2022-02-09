'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

/**
 * Invalid because of attribute `dependencies` is not an array.
 */
class ServiceA {
    static get identity() {
        return 'service.a'
    }

    static get dependencies() {
        return 100
    }
}

/**
 * Invalid because of attribute `dependencies` has non-string item.
 */
class ServiceB {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return [100]
    }
}

/**
 * Invalid because of attribute `dependencies` has invalid symbols item.
 */
class ServiceC {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return ['Service-X!@#$%']
    }
}

/**
 * Invalid because of attribute `dependencies` has empty item.
 */
class ServiceD {
    static get identity() {
        return 'service.d'
    }

    static get dependencies() {
        return ['']
    }
}

/**
 * Invalid because of attribute `dependencies` is conflict.
 */
class ServiceE {
    static get identity() {
        return 'service.e'
    }

    static get dependencies() {
        return ['service.x', 'service.x']
    }

    static open() {}

    close() {}
}

describe('Container.open on Service.dependencies', () => {
    it('Service.dependencies is not an array, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceA]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceA.dependencies: expect Array'
            }
        )
    })
    it('Service.dependencies has non-string item, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceB]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceB.dependencies[0]: expect type string'
            }
        )
    })
    it('Service.dependencies has invalid symbols item, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceC]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceC.dependencies[0]: expect string pattern [a-z0-9.]+'
            }
        )
    })
    it('Service.dependencies has empty item, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceD]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceD.dependencies[0]: expect string pattern [a-z0-9.]+'
            }
        )
    })
    it('Service.dependencies is conflict, throws error', async() => {
        await assert.rejects(
            async() => {
                await Container.open({
                    serviceTypes: [ServiceE]
                })
            },
            {
                constructor: TypeError,
                message: 'config.serviceTypes: ServiceE.dependencies: conflict service.x'
            }
        )
    })
})
