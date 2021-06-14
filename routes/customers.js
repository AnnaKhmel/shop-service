const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Customer = require('../models/customer');
const customersController = require('../controllers/customers');

router.post(
    '/signup',
    [
        body('name').trim().isLength({ max: 50 }).not().isEmpty(),
        body('lastname').trim().isLength({ max: 50 }).optional(),
        body('phone').trim().optional().isLength({ max: 20 }),
        body('email').isEmail().isLength({ max: 50 }).withMessage('Please enter a valid email.')
            .custom(async email => {
                const user = await Customer.find(email);

                if (user[0].length > 0) {
                    return Promise.reject('Email address already exist!');
                }
            })
            .normalizeEmail(),
        body('password').trim().isLength({ min: 6 })
    ],
    customersController.signup
);

router.post('/login', customersController.login)

module.exports = router;
