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

    async open() {}
    async close() {}
}

class Container {
    // Input
    //  * config {Config}
    //  * type_map {Object}: Key is service's name, value is service's type.
    constructor(config, type_map) {
        this._service_map = new Map()
        this._service_stack = []
        this._type_map = type_map
        this.set('config', config)
    }

    async open() {
        let names = Object.keys(this._type_map)
        let type_list = names.map(name => [name, this._type_map[name]])

        for (let [name, type] of type_list) {
            this._validate_service_type(type)

            let instance = new type(this.get.bind(this))

            await instance.open()
            this.set(name, instance)
        }
    }

    async close() {
        for (;;) {
            let service_name = this._service_stack.shift()

            if (!service_name) {
                break
            }

            let service = this.get(service_name)

            await service.close()
            this._service_map.delete(service_name)
        }
    }

    get(service_name) {
        let service = this._service_map.get(service_name)

        if (!service) {
            throw Error(`Service not found: "${service_name}"`)
        }

        return service
    }

    // Input
    //  * name {String}: Name of service.
    //  * instance {any}: Instance of service.
    set(name, instance) {
        if (this._service_map.has(name)) {
            throw Error(`Service conflict: "${name}"`)
        }

        this._service_map.set(name, instance)
        this._service_stack.unshift(name)
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
