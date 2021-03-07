const assert = require('assert')
const ioc = require('../index')

class ServiceA {
    constructor(get) {
        this._asset = get('config').service_a_asset
    }

    async open() {}
    async close() {}

    asset() {
        return this._asset
    }
}

class ServiceB {
    constructor(get) {
        this._asset = get('config').service_b_asset
        this._service_a = get('service_a')
    }

    async open() {}
    async close() {}

    plus_service_a_asset() {
        return this._service_a.asset() + this._asset
    }
}

class ServiceC {
    constructor(get) {
        this._service_x = get('service_x')
    }

    async open() {}
    async close() {}
}

class ServiceD {
    constructor(get) {}

    async close() {}
}

class ServiceE {
    constructor(get) {}

    async open() {}
}

describe('new_container()', () => {
    it('should initialize and run', async () => {
        let config = new ioc.Config({
            service_a_asset: 10,
            service_b_asset: 15
        })
        let container = await ioc.new_container(config, [
            ServiceA,
            ServiceB
        ])

        let actual = container.get('service_b').plus_service_a_asset()
        let expect = config.service_a_asset + config.service_b_asset

        assert.strictEqual(actual, expect)
    })

    it('should throw error not found', async() => {
        let config = new ioc.Config({
            a: 1
        })

        await assert.rejects(
            async () => {
                await ioc.new_container(config, [
                    ServiceC
                ])
            },
            {
                name: 'Error',
                message: 'Service not found: "service_x"'
            }
        )
    })

    it('should throw error conflict', async() => {
        let config = new ioc.Config({
            a: 1
        })

        await assert.rejects(
            async () => {
                await ioc.new_container(config, [
                    ServiceA,
                    ServiceA
                ])
            },
            {
                name: 'Error',
                message: 'Service conflict: "service_a"'
            }
        )
    })

    it('should throw error not implement member open()', async() => {
        let config = new ioc.Config({
            a: 1
        })

        await assert.rejects(
            async () => {
                await ioc.new_container(config, [
                    ServiceD
                ])
            },
            {
                name: 'Error',
                message: 'Service does not implement member async open(): "ServiceD"'
            }
        )
    })

    it('should throw error not implement member close()', async() => {
        let config = new ioc.Config({
            a: 1
        })

        await assert.rejects(
            async () => {
                await ioc.new_container(config, [
                    ServiceE
                ])
            },
            {
                name: 'Error',
                message: 'Service does not implement member async close(): "ServiceE"'
            }
        )
    })
})


