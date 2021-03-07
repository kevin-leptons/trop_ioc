const assert = require('assert')
const {Config} = require('../index')

describe('Config', () => {
    it('should copy attribute a, b', () => {
        let data = {
            a: 1,
            b: 2
        }
        let config = new Config(data)

        assert.strictEqual(config.a, data.a)
        assert.strictEqual(config.b, data.b)
    })

    it('should copy attribute a, b, c, d', () => {
        let data = {
            a: 1,
            b: 2,
            c: 'xxx',
            d: 'yyy'
        }
        let config = new Config(data)

        assert.strictEqual(config.a, data.a)
        assert.strictEqual(config.b, data.b)
        assert.strictEqual(config.c, data.c)
        assert.strictEqual(config.d, data.d)
    })

    it('should throw invalid data error with no input', () => {
        assert.throws(
            () => {
                new Config()
            },
            {
                name: 'Error',
                message: 'Invalid configuration data'
            }
        )
    })

    it('should throw empty error with no input', () => {
        assert.throws(
            () => {
                new Config({})
            },
            {
                name: 'Error',
                message: 'Empty configuration data'
            }
        )
    })
})