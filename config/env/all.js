'use strict';

module.exports = {
  app: {
    title: 'Preethi Stores',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'MongoDB, Express, AngularJS, Node.js',
  },
  client: {
    email: 'sachin@sifium.co',
    phone: '9971530964',
    successCheckoutMessage: 'Checkout successful'
  },
  mailer: {
  	from: 'mean-commerce-dev',
  	options: {
  		service: 'Gmail',
  		auth: {
  			user: 'sachin@sifium.co',
  			pass: 'sachin@sifium'
  		}
  	}
  },
  sms: {
    send: 'mean-commerce-dev',
    auth: {
      uname: 'demoway',
      pass: 'mint2014'
    }
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions'
};
