const { snakeCase } = require('snake-case')

class Config {
    // Input
    //  * data {Object}: Map by key-value.
    constructor(data) {
        if (!data) {
            throw Error('Invalid configuration data')
        }

        let keys = Object.keys(data)

        if (keys.length <= 0) {
            throw Error('Empty configuration data')
        }

        for (let k of keys) {
            this[k] = data[k]
        }
    }
}

class Container {
    constructor(config, type_list) {
        this._service_map = new Map()
        this._type_list = type_list
        this.set(config)
    }

    async open() {
        for (let type of this._type_list) {
            this._validate_service_type(type)

            let instance = new type(this.get.bind(this))

            await instance.open()
            this.set(instance)
        }
    }

    async close() {

    }

    get(service_name) {
        let service = this._service_map.get(service_name)

        if (!service) {
            throw Error(`Service not found: "${service_name}"`)
        }

        return service
    }

    set(instance) {
        let service_name = snakeCase(instance.constructor.name)

        if (this._service_map.has(service_name)) {
            throw Error(`Service conflict: "${service_name}"`)
        }

        this._service_map.set(service_name, instance)
    }

    _validate_service_type(type) {
        if (this._is_not_async_function(type.prototype.open)) {
            throw Error(`Service does not implement member async open(): "${type.name}"`)
        }

        if (this._is_not_async_function(type.prototype.close)) {
            throw Error(`Service does not implement member async close(): "${type.name}"`)
        }
    }

    _is_not_async_function(fn) {
        return typeof fn !== 'function' || fn.constructor.name !== 'AsyncFunction'
    }
}

// Input
//  * config {Config}: Contains configuration by key-value.
//  * type_list {Array<class>}: List of service types which is implement
//    service methods and ordered by dependency.
//
// Output {Container}
async function new_container(config, type_list) {
    let container = new Container(config, type_list)

    await container.open()
    return container
}

module.exports = {
    new_container,
    Config
}