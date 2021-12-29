'use strict'

class Config {
    /**
     *
     * @param {object} data - Key-value data.
     */
    constructor(data={}) {
        if (typeof data !== 'object') {
            throw Error('invalid configuration data')
        }

        let entries = Object.keys(data)
            .map(key => [key, data[key]])

        this._map = new Map(entries)
    }

    /**
     *
     * @param {string} key
     * @returns {any} Configuration value.
     */
    get(key) {
        if (!this._map.has(key)) {
            throw Error('not existed configuration attribute: ' + key)
        }

        return this._map.get(key)
    }
}

class Container {
    /**
     *
     * @param {Config} config
     * @param {object} serviceTypes - Map of service name to service type.
     * Service type is a class which is implement methods `open()` and
     * `close()`. The order of services must be the same as dependency between
     * them.
     */
    constructor(config, serviceTypes) {
        this._serviceMap = new Map()
        this._serviceStack = []
        this._serviceTypeMap = serviceTypes
        this.set('config', config)
    }

    /**
     * Initialize services from types.
     */
    async open() {
        let names = Object.keys(this._serviceTypeMap)
        let types = names.map(name => [name, this._serviceTypeMap[name]])
        let getHandler = this.get.bind(this)

        for (let [name, ServiceType] of types) {
            Container._validateServiceType(ServiceType)

            let service = new ServiceType(getHandler)

            if (service._open) {
                await service._open()
            }

            this.set(name, service)
        }
    }

    /**
     * Stop all services.
     */
    async close() {
        for (;;) {
            let serviceName = this._serviceStack.shift()

            if (!serviceName) {
                break
            }

            let service = this.get(serviceName)

            if (service._close) {
                await service._close()
            }

            this._serviceMap.delete(serviceName)
        }
    }

    /**
     * Retrieve service by name.
     *
     * @param {string} serviceName
     * @returns {any}
     */
    get(serviceName) {
        let service = this._serviceMap.get(serviceName)

        if (!service) {
            throw Error(`Service not found: ${serviceName}`)
        }

        return service
    }

    /**
     * Put a service to container, it must be initilize outside.
     *
     * @param {string} name
     * @param {any} instance
     */
    set(name, instance) {
        if (this._serviceMap.has(name)) {
            throw Error(`Service conflict: ${name}`)
        }

        this._serviceMap.set(name, instance)
        this._serviceStack.unshift(name)
    }

    /**
     * @private
     * @param {constructor} type
     */
    static _validateServiceType(type) {
        if (!Container._isValidMethod(type.prototype, '_open')) {
            throw Error(`_open is existed but not a function: ${type.name}`)
        }

        if (!Container._isValidMethod(type.prototype, '_close')) {
            throw Error(`_close is existed but not a function: ${type.name}`)
        }
    }

    /**
     * @private
     * @param {constructor} constructor
     * @param {string} methodName
     * @returns {boolean}
     */
    static _isValidMethod(constructor, methodName) {
        if (!Object.prototype.hasOwnProperty.call(constructor, methodName)) {
            return true
        }

        return (typeof constructor[methodName]) === 'function'
    }
}

/**
 *
 * @param {Config} config
 * @param {object} serviceTypes - Map of service name to service type.
 * Service type is a class which is implement methods `open()` and `close()`.
 * The order of services must be the same as dependency between them.
 * @returns {Promise<Container>}
 */
async function newContainer(config, serviceTypes) {
    let container = new Container(config, serviceTypes)

    await container.open()

    return container
}

module.exports = {
    newContainer,
    Config
}
