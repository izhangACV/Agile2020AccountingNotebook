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


describe('GET invalid transaction', () => {
    let transactionId;
    let statusCode;
    let resBody;
    let resText;

    before(async () => {
        transactionId = 'debitTransaction.body.id';

        const response = await chai.request(appServer).get(`/api/transactions/${transactionId}`);

        statusCode = response.status;
        resBody = response.body;
        resText = response.text;
    })

    it('Returned status 400', () => {
        assert.equal(statusCode, 400);
    });

    it('Response is JSON', () => {
        assert.isObject(resBody);
    });

    it('Returned text "invalid ID supplied"', async () => {
        assert.isString(resText);
        assert.equal(resText, 'invalid ID supplied');
    });

});
