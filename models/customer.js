const db = require('../util/database');

module.exports = class Customer {
    constructor(name, lastName, phone, email, password) {
        this.name = name;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.password = password;
    }

    static find(email) {
        return db.execute('SELECT id_customer as id, name, lastname as lastName, phone, email, password FROM customers WHERE email = ?', [email]);
    }

    static save(customer) {
        return db.execute(
            'INSERT INTO customers (name, lastname, phone, email, password) VALUES (?, ?, ?, ?, ?)',
            [customer.name, customer.lastName || '', customer.phone || '', customer.email, customer.password]
        );
    }
}