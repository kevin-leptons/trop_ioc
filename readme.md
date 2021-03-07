@trop/ioc
=========

Simple IOC container for Javascript. It is not real IOC for now but it will, soon.

Usage
=====

To use service with container, it must be implement by specification
in section `Service Interface`.

```js
const ioc = require('@trop/ioc')

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

async function main() {
    let config = new ioc.Config({
        service_a_asset: 10,
        service_b_asset: 15
    })
    let container = await ioc.new_container(config, [
        ServiceA,
        ServiceB
    ])

    let total = container.get('service_b').plus_service_a_asset()

    // output: 25
    console.log(total)
}

main().catch(console.error)
```

Service Interface
=================

```js
class ServiceA {
    // Description
    //  * Get all dependency services.
    //
    // Input
    //  * get {Function(service_name)}: Retrieve dependency services.
    //    "service_name" is camel case of class name of service.
    //    Example: ServiceA => "service_a", ServiceABC_ => "service_abc"
    constructor(get) {
        this._service_x = get('service_x)
        this._service_y = get('service_y)
    }

    // Description
    //  * Initialize service that require asynchronous actions.
    async open() {

    }

    // Description
    //  * Release all resources which is manage by service like connections,
    //    open files...
    async close() {

    }

    // An API of service
    method_a() {

    }

    // An other API of service and so on
    method_b() {

    }
}
```