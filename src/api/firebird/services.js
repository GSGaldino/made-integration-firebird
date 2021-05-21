const Firebird = require('node-firebird');
const Produto = require('./models/Produto');

module.exports = {
  async getProducts() {
    let data = [];
    // Firebird database options to attach
    const options = {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_PATH,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      lowercase_keys: false,
      role: null,
      pageSize: process.env.DATABASE_PAGESIZE
    };

    const getData = new Promise((resolve, reject) => {
      try {
        Firebird.attach(options, async function (err, db) {
          console.log('===================================================');
          console.log("Fetching database:", options.host);

          const query = process.env.DATABASE_QUERY;
          if (!query)
            throw new Error("Firebird.attach() -> Missing database query parameter. see your .env file")
          if (err)
            throw err;

          // db = DATABASE
          db.query(query, async function (err, result) {
            if (err) return console.log(err);

            console.log('===================================================');
            console.log("Success fetched", "result.length", result.length);

            resolve(result);
            // Close the connection
            db.detach();
          });
        });
      } catch (error) {
        reject(error);
      }
    })

    await getData
      .catch(error => {throw error})
      .then(response => data = response);

    return data.map(produto => new Produto(produto));
  }
};
