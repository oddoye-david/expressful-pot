import crypto from 'crypto';
import config from '../../config';

import HttpError from '../utils/HttpError';
import User from '../models/user';
import jwt from '../utils/jwt';
import logger from '../utils/logger';

function login(req, res, next) {
  User.findOne({ 
    email: req.body.email
  }).then(user => {
    if (!user) return next(new HttpError(401));

    user.verifyPassword(req.body.password)
      .then(match => {
        if(!match) return next(new HttpError(401));
        
        return res.json({token: jwt.signToken(user.id, user.role)});
      })
    }).catch(err => next(new HttpError()));
}

function signup(req, res, next) {
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        const user = new User({
          email: req.body.email,
          password: req.body.password
        });

        user.save().then(user => {
          return res.json({token: jwt.signToken(user.id, user.role)});
        }).catch(err => {
          const {email, password} = err.errors;
          err = email || password || false;
          return next(new HttpError(409, err.message));
        });
      }else{
        return next(new HttpError(409, `Someone already has that email. Try another?`));
      }
    })
    .catch(err => next(new HttpError()));
}

function recovery(req, res, next) {
  crypto.randomBytes(20, (err, buf) => {
    if (err) return next(new HttpError());
    const token = buf.toString('hex');

    User.findOne({ email: req.body.email }).then(user=> {
      if(!user){
        return next(new HttpError(409, 'No account with that email address exists.'));
      }

      user.passwordResetToken = token;
      user.passwordResetExpires = Date.now() + config.app.passwordResetExpires;

      user.save()
        .then(user => {
          const mailOptions = {
            to: user.email,
            from: 'reset@test.com',
            subject: 'Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'+
              'Please click on the following link, or paste this into your browser to complete the process:\n\n'+
              'http://' + config.app.host + '/auth/reset/' + token + '\n\n'+
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };

          if(config.app.env == 'development'){
            logger.log('debug', mailOptions.text);

            return res.json({ 
              message: 'Message sent. Check your email.',
              mail: 'http://' + config.app.host + '/auth/reset/' + token
            });
          }

          if(config.app.env == 'production'){
            config.smtpTransport.sendMail(mailOptions, (error, info) => {
              if (error) return next(new HttpError());
              
              logger.info(`Message sent: ${info.response}`);

              return res.json({message: 'Message sent. Check your email.'});
            });
          }
        });
    });
  });
}

function reset(req, res, next) {
  if(!req.body.password){
    return next(new HttpError(500, 'Please provide a new password.'));
  }

  User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: new Date }
  }).then(user => {
    if (!user) return next(new HttpError(409, 'Password reset token is invalid or has expired.'));

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    user.save().then(user => {
      const mailOptions = {
        to: user.email,
        from: 'reset@test.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };

      if(config.app.env == 'development'){
        logger.log('debug', mailOptions.text);

        return res.json({
          message: 'Your password has been changed.',
          text: mailOptions.text
        });
      }

      if(config.app.env == 'production'){
        config.smtpTransport.sendMail(mailOptions, (error, info) => {
          if (error) return next(new HttpError());
          
          logger.info('Success! Your password has been changed.');
          return res.json({message: 'Your password has been changed.'});
        });
      }
    });
  })
}

export default {
  login,
  signup,
  recovery,
  reset
}