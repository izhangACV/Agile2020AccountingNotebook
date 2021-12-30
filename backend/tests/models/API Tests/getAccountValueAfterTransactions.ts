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


describe('GET account value after transaction', () => {
    let statusCode;
    let resBody;

    before(async () => {

        await chai.request(appServer).post('/api/transactions').send({
            type: "credit",
            amount: 5000
        });

        await chai.request(appServer).post('/api/transactions').send({
            type: "debit",
            amount: 2000
        });

        await chai.request(appServer).post('/api/transactions').send({
            type: "credit",
            amount: 1000
        });

        const response = await chai.request(appServer).get('/api');

        statusCode = response.status;
        resBody = response.body;
    })

    it('Returned status 200', () => {
        assert.equal(statusCode, 200);
    });

    it('Response is JSON', () => {
        assert.isObject(resBody);
    });

    it('Response includes balance', async () => {
        assert.isDefined(resBody.balance);
    });

    it('Returned balance is a positive integer', async () => {
        assert.isNumber(resBody.balance);
        assert.isAtLeast(resBody.balance, 0);
        assert.equal(resBody.balance, 4000);
    });
});
