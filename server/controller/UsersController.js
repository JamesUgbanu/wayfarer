import conn from '../helpers/conn';
import passwordHelper from '../helpers/password';
import generateToken from '../helpers/token';
import validationErrors from '../helpers/validationErrors';

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

  /**
   *  Sign in user
   *  @param {Object} requestuest
   *  @param {Object} response
   *  @return {Object} json
   */
  static signIn(request, response) {
    const { email, password } = request.body;
    const query = `SELECT * FROM user WHERE email = '${email}'`;

    db.query(query)
      .then((dbResult) => {
        if (dbResult.rowCount === 0) return UsersController.wrongEmailResponse(response);
        if (!passwordHelper.comparePasswords(password.trim(), dbResult.rows[0].password)) {
          return UsersController.passwordFailureResponse(response);
        }

        const currentToken = generateToken({ id: dbResult.rows[0].id, isAdmin: dbResult.rows[0].is_admin });
        process.env.CURRENT_TOKEN = currentToken;

        return UsersController.loginSuccessResponse(response, currentToken, dbResult.rows[0]);
      })
      .catch();
  }

  /**
   *  return message for non existent email in login
   *  @param {Object} response
   *  @return {Object} json
   */
  static wrongEmailResponse(response) {
    return response.status(404).json({
      status: 'error',
      error: validationErrors.noEmail,
    });
  }

  /**
   *  return message for non matching password in login
   *  @param {Object} response
   *  @return {Object} json
   */
  static passwordFailureResponse(response) {
    return response.status(401).json({
      status: 'error',
      error: validationErrors.loginFailure,
    });
  }


  /**
   *  return message for successful login
   *  @param {Object} response
   *  @return {Object} json
   */
  static loginSuccessResponse(response, currentToken, data) {
    return response.status(200).json({
      status: 'success',
      data: {
        token: currentToken,
        id: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
      },
    });
  }
}

export default UsersController;
