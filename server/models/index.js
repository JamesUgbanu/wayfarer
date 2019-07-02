import createQuery from './tables.create';
import destroyQuery from './db.destroy';
import connection from '../helpers/conn';
import password from '../helpers/password';

const client = connection();
client.connect();

const adminPassword = password.hashPassword('scrip#9ju');

const adminQuery = `INSERT INTO users(first_name, last_name, email, password, is_admin) VALUES 
('james', 'Ugbanu', 'jamesugbanu@gmail.com', '${adminPassword}', true) RETURNING *;`;

const dbQueries = `${destroyQuery}${createQuery}${adminQuery}`;

client.query(dbQueries, (err, res) => {
  client.end();
});
