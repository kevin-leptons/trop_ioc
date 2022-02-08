'use strict'

class Config {
    static get identity() {
        return 'config'
    }

    static get dependencies() {
        return []
    }

    constructor(balanceA, balanceB) {
        this._balanceA = balanceA
        this._balanceB = balanceB
    }

    static open(balanceA = 1, balanceB = 2) {
        return new Config(balanceA, balanceB)
    }

    close() {}

    get balanceA() {
        return this._balanceA
    }

    get balanceB() {
        return this._balanceB
    }
}

module.exports = {
    Config
}
