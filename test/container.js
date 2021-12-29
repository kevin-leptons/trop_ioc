'use strict'

const assert = require('assert')
const ioc = require('../lib')

class ServiceA {
    constructor(get) {
        this._asset = get('config').get('service_a_asset')
    }

    async _open() {
        this._asset += 1
    }

    asset() {
        return this._asset
    }
}

class ServiceB {
    constructor(get) {
        this._asset = get('config').get('service_b_asset')
        this._service_a = get('service_a')
    }

    plus_service_a_asset() {
        return this._service_a.asset() + this._asset
    }
}

class ServiceC {
    constructor(get) {
        this._service_x = get('service_x')
    }
}

class ServiceD {
    constructor() {}

    get _open() {
        return 1
    }
}

class ServiceE {
    constructor() {}

    get _close() {
        return 1
    }
}

class ServiceF {
    // eslint-disable-next-line require-await
    async _open() {
        throw new Error('error from _open()')
    }
}

class ServiceG {
    // eslint-disable-next-line require-await
    async _close() {
        throw new Error('error from _close()')
    }
}

describe('newContainer', () => {
    it('initialize, run and dispose', async () => {
        let config = new ioc.Config({
            service_a_asset: 10,
            service_b_asset: 15
        })
        let container = await ioc.newContainer(config, {
            'service_a': ServiceA,
            'service_b': ServiceB
        })
        let actual = container.get('service_b').plus_service_a_asset()
        let expect = 26

        assert.strictEqual(actual, expect)

        await container.close()

        assert.strictEqual(container._serviceStack.length, 0)
        assert.strictEqual(container._serviceMap.size, 0)
    })

    it('service does not existed, throws error', async() => {
        let config = new ioc.Config({
            a: 1
        })

        await assert.rejects(
            async () => {
                await ioc.newContainer(config, {
                    'service_c': ServiceC
                })
            },
            {
                name: 'Error',
                message: 'Service not found: service_x'
            }
        )
    })

    it('_open is existed but not a function, throws error', async() => {
        let config = new ioc.Config({
            a: 1
        })

        await assert.rejects(
            async () => {
                await ioc.newContainer(config, {
                    'service_d': ServiceD
                })
            },
            {
                name: 'Error',
                message: '_open is existed but not a function: ServiceD'
            }
        )
    })

    it('_close is existed but not a function, throw error', async() => {
        let config = new ioc.Config({
            a: 1
        })

        await assert.rejects(
            async () => {
                await ioc.newContainer(config, {
                    'service_e': ServiceE
                })
            },
            {
                name: 'Error',
                message: '_close is existed but not a function: ServiceE'
            }
        )
    })

    it('service throws error in _open(), throws error', async () => {
        let config = new ioc.Config()

        await assert.rejects(
            async () => {
                await ioc.newContainer(config, {
                    'service_f': ServiceF
                })
            },
            {
                name: 'Error',
                message: 'error from _open()'
            }
        )
    })

    it('service throws error in _close(), throws error', async () => {
        let config = new ioc.Config()

        await assert.rejects(
            async () => {
                let container = await ioc.newContainer(config, {
                    'service_g': ServiceG
                })

                await container.close()
            },
            {
                name: 'Error',
                message: 'error from _close()'
            }
        )
    })
})
