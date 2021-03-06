import Express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './server/routes';

dotenv.config();

// declare constants
const app = new Express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

routes(app);

// declare 404 route
app.all('*', (req, res) => res.status(404).json({
  status: 404,
  error: 'The URL you are trying to access does not exist. Please enter a valid url',
}));

// listen to app port
app.listen(port, () => console.log(`App listening on port ${port}`));

export default app;
