// @ts-nocheck

import chai = require('chai');
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
const assert = require('chai').assert
import { createAppServer } from '../../src/server/appServer';
import { Account } from '../../src/models/Account';
import {before} from "mocha";

const account = new Account()
const appServer = createAppServer(account);

describe('GET account value from creation', () => {
    let statusCode;
    let resBody;

    before(async () => {
        const response = await chai.request(appServer).get('/api');

        statusCode = response.status;
        resBody = response.body;
    });

   it('Returned status 200', async () => {
       assert.equal(statusCode, 200);
   })

    it('Response is JSON', async () => {
        assert.isObject(resBody);
    });

    it('Response includes balance', async () => {
        assert.isDefined(resBody.balance);
    });

    it('Returned balance is a positive integer', async () => {
       assert.isNumber(resBody.balance);
       assert.isAtLeast(resBody.balance, 0);
       assert.equal(resBody.balance, 0);
    });
});
