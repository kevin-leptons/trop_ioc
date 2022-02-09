'use strict'

/* eslint-disable max-lines-per-function */

const assert = require('assert')
const {Container} = require('../lib')

describe('Container.get', () => {
    it('identity is not a string, throws error', async() => {
        let container = await Container.open()
        assert.throws(
            () => {
                container.get(100)
            },
            {
                constructor: TypeError,
                message: 'identity: expect type string'
            }
        )
    })
    it('not existed service, throws error', async() => {
        let container = await Container.open()
        assert.throws(
            () => {
                container.get('service.a')
            },
            {
                constructor: Error,
                message: 'identity: service.a: not found'
            }
        )
    })
})
