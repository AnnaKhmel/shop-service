const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);

    if (!errors.isEmpty()) {
        const error = new Error(errors.array().join(' '));
        error.statusCode = 400;
        next(error);
        return;
    }

    const { name, lastName, phone, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const customerDetails = {
            name,
            lastName,
            phone,
            email,
            password: hashedPassword
        };

        const [result] = await Customer.save(customerDetails);

        const token = jwt.sign(
            {
                email: email,
                customerId: result.insertId
            },
            'secretfortoken',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, customerId: result.insertId });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const [customer] = await Customer.find(email);

        if (customer.length !== 1) {
            const error = new Error('A customer with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }

        const storedCustomer = customer[0];
        const isEqual = await bcrypt.compare(password, storedCustomer.password);

        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: email,
                customerId: storedCustomer.id
            },
            'secretfortoken',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, customerId: storedCustomer.id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
};