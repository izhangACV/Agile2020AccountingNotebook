// @ts-nocheck

import chai = require('chai');
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
const assert = require('chai').assert
import { createAppServer } from '../../src/server/appServer';
import { Account } from '../../src/models/Account';
import {before, it} from "mocha";

const account = new Account()
const appServer = createAppServer(account);


describe('GET all transactions on creation', () => {
    let statusCode;
    let resBody;

    before(async () => {
        const response = await chai.request(appServer).get(`/api/transactions`);

        statusCode = response.status;
        resBody = response.body;
    })

    it('Returned status 200', () => {
        assert.equal(statusCode, 200);
    });

    it('Response is array of objects', () => {
        assert.isArray(resBody);
        assert.isEmpty(resBody);
    });
});
