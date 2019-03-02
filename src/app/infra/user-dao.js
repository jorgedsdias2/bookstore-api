class UserDAO {

    constructor(db) {
        this._db = db;
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this._db.get(
                `
                    SELECT * 
                    FROM users
                    WHERE id = ?
                `,
                [id],
                (error, user) => {
                    if(error) {
                        return reject(error);
                    }

                    return resolve(user);
                }
            );
        });;
    }

}

module.exports = UserDAO;