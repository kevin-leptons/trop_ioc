'use strict'

/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

/**
 * Invalid service because attribute `close` throws error.
 */
class ServiceA {
    static get identity() {
        return 'service.b'
    }

    static get dependencies() {
        return []
    }

    static open() {
        return new ServiceA()
    }

    close() {
        throw new Error('oops!')
    }
}

describe('Container.close, throws error on Service.close', () => {
    it('Service.close throws error, throws error', async() => {
        let container = await Container.open({
            serviceTypes: [ServiceA]
        })
        await assert.rejects(
            async() => {
                await container.close()
            },
            {
                constructor: Error,
                message: 'closing services'
            }
        )
    })
})
