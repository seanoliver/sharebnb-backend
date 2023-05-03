'use strict';

import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';

/** return signed JWT from user data. */

function createToken(user) {
  const payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
}

export { createToken };
