import jwt from '../utils/jwt'

export default function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  jwt.verifyToken(token).then((auth) => {
    req.locals.token = auth.token;
    req.locals.id = auth.sub;
    req.locals.role = auth.role;
    next();
  }).catch((err) => {
    return next(err);
  });
}