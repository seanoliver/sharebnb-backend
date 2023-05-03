'use strict';

class Listing {
	static async create(data) {
		const result = await db.query(
			`
    INSERT INTO jobs (name,
                      description,
                      price,
                      address)
    VALUES ($1, $2, $3, $4)
    RETURNING
        id,
        title,
        salary,
        equity,
        company_handle AS "companyHandle"`,
			[data.title, data.salary, data.equity, data.companyHandle]
		);
	}
}

export default Listing;
