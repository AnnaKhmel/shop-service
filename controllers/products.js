const mysql = require('mysql2');
const db = require('../util/database');

exports.getAll = async (req, res, next) => {
    let query = `SELECT DISTINCT
        p.id_products AS id,
        p.name,
        p.price,
        m.materials AS material
    FROM products p
    JOIN materials m
      ON p.id_materials = m.id_materials
    JOIN options o
      ON p.id_products = o.id_products
    JOIN gender g
      ON o.id_gender = g.id_gender
    JOIN category_product cp
      ON p.id_products = cp.id_products
    WHERE 1 = 1`;

    const { categoryId, gender } = req.query;

    if (gender) {
        query += ` AND g.gender = ${mysql.escape(gender)}`;
    }

    if (categoryId) {
        query += ` AND cp.id_category = ${mysql.escape(categoryId)}`;
    }

    try {
        let [products] = await db.query(query);

        if (products.length > 0) {
            const productIds = products.map(p => p.id);
            const [options] = await db.query(
                `SELECT
                    o.id_products AS productId,
                    s.size,
                    c.colour AS color,
                    g.gender
                FROM options o
                    JOIN size s ON o.id_size = s.id_size
                    JOIN colours c ON o.id_colour = c.id_colour
                    JOIN gender g ON o.id_gender = g.id_gender
                WHERE id_products in (?)`,
                [productIds]
            );

            products = products.map(p => ({
                ...p,
                options: options
                    .filter(o => o.productId === p.id)
                    .map(o => ({
                        size: o.size,
                        color: o.color,
                        gender: o.gender
                    }))
            })
            );
        }

        res
            .status(200)
            .json({ data: products });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
}

exports.get = async (req, res, next) => {
    const productId = req.params.id;

    try {
        const [data] = await db.query(
            'SELECT id_products as id, name, price FROM products WHERE id_products = ?',
            [productId]
        );

        res
            .status(200)
            .json({ data });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
}
