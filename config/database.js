const database = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

console.log('MYSQL_HOST:', process.env.MYSQL_HOST);

const connectionPool = database.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    timezone: '+09:00',
    charset: 'utf8mb4',
    multipleStatements: false,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 50,
    // debug: ['ComQueryPacket']
});

/**
 * Get a connection from the connection pool.
 * @returns {Promise<Connection>} A promise that resolves to a MySQL connection.
 */
async function getConnection() {
    try {
        const connection = await connectionPool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error getting MySQL connection:', error);
        throw error;
    }
}

/**
 * Execute a query on the MySQL database.
 * @param {string} sql - The SQL query to execute.
 * @param {Array} args - The arguments for the SQL query.
 * @returns {Promise<Array>} A promise that resolves to the result set of the query.
 */
async function executeQuery(sql, args) {
    try {
        const [rows, _] = await connectionPool.query(sql, args);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

/**
 * Close all connections in the connection pool.
 * @returns {Promise<void>} A promise that resolves when all connections are closed.
 */
async function closeConnectionPool() {
    try {
        await connectionPool.end();
        console.log('All connections in the pool have been closed.');
    } catch (error) {
        console.error('Error closing connection pool:', error);
        throw error;
    }
}

module.exports.getConnection = getConnection;
module.exports.executeQuery = executeQuery;
module.exports.closeConnectionPool = closeConnectionPool;
