# @trop/ioc

* Inverse of Control for Javascript... in Stone Age.

# Installation

```
npm install @trop/ioc
```

# Example

```js
const {newContainer, Config} = require('@trop/ioc')

class ServiceA {
    constructor(get) {
        this._balance = get('config').get('service_a_balance')
    }

    async open() {}

    async close() {}

    balance() {
        return this._balance
    }
}

class ServiceB {
    constructor(get) {
        this._balance = get('config').get('service_b_balance')
        this._serviceA = get('service_a')
    }

    open() {}

    close() {}

    plusServiceA() {
        return this._serviceA.balance() + this._balance
    }
}

class ServiceC {
    constructor() {}

    doNothing() {}
}

async function main() {
    let config = new Config({
        'service_a_balance': 10,
        'service_b_balance': 15
    })
    let container = await newContainer(config, {
        'service_a': ServiceA,
        'service_b': ServiceB,
        'service_c': ServiceC
    })

    let total = container.get('service_b').plusServiceA()

    console.log(total)

    await container.close()
}

main().catch(console.error)
```
