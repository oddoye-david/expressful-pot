export default class HttpError{
  constructor(status = 500, message){
    this.status = status;
    this.message = message;

    if(!message) this.setMessage(status);
  }

  setMessage(status){
    let obj = {
      '400' : () => { this.message = `Oops. We're sorry, but something went wrong.` },
      '401' : () => { this.message = `Authentication failed. Please check username and/or Password.` },
      '409' : () => { this.message = `Someone already has that email. Try another?` },
      '500' : () => { this.message = `The server encountered an unexpected condition which prevented it from fulfilling the request.` },
    };

    obj[status]();
  }
}