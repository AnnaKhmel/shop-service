const db = require('../util/database');

exports.getByGender = async (req, res, next) => {
    const query = `SELECT
    DISTINCT
        с.id_category AS id,
        с.category AS name
    FROM products p
      JOIN category_product cp
        ON p.id_products = cp.id_products
      JOIN сategories с
        ON cp.id_category = с.id_category
      JOIN options o
        ON p.id_products = o.id_products
      JOIN gender g
        ON o.id_gender = g.id_gender
    WHERE g.gender = ?
    ORDER BY с.category`;

    const { gender } = req.query;

    try {
        const [categories] = await db.query(query, [gender]);

        res
            .status(200)
            .json({ data: categories });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
}