const fs = require('fs');

module.exports = {
  async createLocalDatabase(database) {
    fs.writeFileSync('database.json', JSON.stringify(database), 'utf-8', (err, content) => {
      console.log(err);
      console.log(content);
    })
    console.log('===================================================');
    console.log("Success created local database:", database.length, "items");
  },
  async databaseExists(){
    return fs.existsSync('database.json');
  }
}
