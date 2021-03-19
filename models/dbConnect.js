const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('expressjsdb', 'postgres', '1234567890', {
    host: 'localhost',
    dialect: 'postgres'
});

async function testdb() {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
}

module.exports = testdb;