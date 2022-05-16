import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Users from '../database/models/Users';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const USER = {
  id: 1,
  username: "Admin",
  role: "admin",
  email: "admin@admin.com",
  password: 'secret_admin',    
};

const USER_CREDENTIALS = {
  email: "admin@admin.com",
  password: "secret_admin",
};

const USER_RESPONSE = {
id: 1,
username: "Admin",
role: "admin",
email: "admin@admin.com",
};


describe('Login com método POST ', () => {
  let chaiHttpResponse: Response;
  describe('Se o corpo da requisição conter email e senha válidos de um usuário existente ', () => {

    before(async () => {
      sinon.stub(Users, "findOne").resolves(USER as Users);
    });

    after(()=>{
      (Users.findOne as sinon.SinonStub).restore();
    });

    it('É esperado o status da resposta ser 200 e o corpo da resposta ter um objeto do usuário e um token', async () => {

      chaiHttpResponse = await chai.request(app).post('/login').send(USER_CREDENTIALS);

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.have.own.property('user');
      expect(chaiHttpResponse.body).to.have.own.property('token');
      expect(chaiHttpResponse.body.user).to.be.an('object').deep.equal(USER_RESPONSE)
    });

  })
});
