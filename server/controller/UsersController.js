import conn from '../helpers/conn';
import passwordHelper from '../helpers/password';
import generateToken from '../helpers/token';

const db = conn();
db.connect();

class UsersController {
  /**
   *  Signup a user
   *  @param {Object} request
   *  @param {Object} response
   *  @return {Object} json
   */
  static signup(request, response) {
    const {
      email,
      firstName,
      lastName,
    } = request.body;

    let {
      isAdmin,
      password,
    } = request.body;
    isAdmin = parseInt(isAdmin, 10) || 0;
    const hashedPassword = passwordHelper.hashPassword(password.trim());

    const query = {
      text: 'INSERT INTO users(first_name, last_name, email, password, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [firstName, lastName, email, hashedPassword, isAdmin],
    };

    UsersController.signupQuery(response, query);
  }

  /**
   *  Run user signup query
   *  @param {Object} request
   *  @param {Object} response
   * @param {String} query
   *  @return {Object} json
   *
   */
  static signupQuery(response, query) {
    db.query(query)
      .then((dbResult) => {
        const currentToken = generateToken({ id: dbResult.rows[0].id, isAdmin: dbResult.rows[0].is_admin });
        process.env.CURRENT_TOKEN = currentToken;
        return response.status(201).json({
          status: 'success',
          data: {
            user_id: dbResult.rows[0].id,
            is_admin: dbResult.rows[0].is_admin,
            token: currentToken
          },
        });
      })
      .catch();
  }
}

export default UsersController;
