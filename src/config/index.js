import path from 'path';
import nodemailer from 'nodemailer';

function development(){
  return {
    app: {
      port: 3000,
      host: '127.0.0.1:3000',
      env: 'development',
      passwordResetExpires: 3600000 // 1h
    },
    db: {
      uri: 'mongodb://localhost:27017/myproject'
    },
    jwt: {
      secret : 'YOUR_SUPER_SECRET',
      expiresIn: '1d',
      aud: 'http://localhost',
      refreshTime: '21600' // 6h
    },
    winston: {
      options: {
        file: {
          level: 'info',
          filename: path.join(__dirname, '../storage/logs/app.log'),
          handleExceptions: true,
          json: true,
          maxsize: 5242880, //5MB
          maxFiles: 5,
          colorize: false
        },
        console: {
          level: 'debug',
          handleExceptions: true,
          json: false,
          colorize: true
        }
      }
    }
  }
}

function production(){
  const smtpTransport = nodemailer.createTransport('SMTP', {
    host: 'mail.yourserver.com',
    port: 25,
    auth: {
      user: 'username',
      pass: 'password'
    }
  });

  return {
    app: {
      port: 3000,
      host: '127.0.0.1:3000',
      env: 'production',
      passwordResetExpires: Date.now() + 3600000 // 1h
    },
    db: {
      uri: 'mongodb://localhost:27017/myproject-production'
    },
    jwt: {
      secret : 'YOUR_SUPER_SECRET',
      expiresIn: '1d',
      aud: 'http://localhost',
      refreshTime: '21600' // 6h
    },
    smtpTransport,
    winston: {
      options: {
        file: {
          level: 'info',
          filename: path.join(__dirname, '../storage/logs/app.log'),
          handleExceptions: true,
          json: true,
          maxsize: 5242880, //5MB
          maxFiles: 5,
          colorize: false
        },
        console: {
          level: 'debug',
          handleExceptions: true,
          json: false,
          colorize: true
        }
      }
    }
  }
}

const ENV = process.env.NODE_ENV || 'development';

let config = {
  'development' : development,
  'production' : production
}[ENV]();

export default config;