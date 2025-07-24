module.exports = {
  development: {
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST ?? '127.0.0.1',
    dialect: 'postgres',
    port: Number(process.env.DB_PORT) ?? 5000,
    seederStorage: 'sequelize',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
