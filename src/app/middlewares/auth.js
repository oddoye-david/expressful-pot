import jwt from '../utils/jwt'

export default function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  jwt.verifyToken(token).then((auth) => {
    res.locals.token = auth.token;
    res.locals.id = auth.sub;
    res.locals.role = auth.role;
    next();
  }).catch((err) => {
    return next(err);
  });
}