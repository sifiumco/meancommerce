'use strict';

module.exports = {
  app: {
    title: 'meancommerce',
    description: 'MEAN stack based e-commerce platform',
    keywords: 'MEAN stack E-commerce opensource',
  },
  client: {
    email: '',
    phone: '',
    successCheckoutMessage: 'Checkout successful'
  },
  mailer: {
  	from: 'mean-commerce-dev',
  	options: {
  		service: 'Gmail',
  		auth: {
  			user: '',
  			pass: ''
  		}
  	}
  },
  sms: {
    send: 'mean-commerce-dev',
    auth: {
      uname: '',
      pass: ''
    }
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions'
};
