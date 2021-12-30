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


describe('POST invalid credit transactions', () => {
    let statusCode;
    let resBody;
    let resText;

    before(async () => {

        const response = await chai.request(appServer).post('/api/transactions').send({
            type: "credit",
            amount: 0
        });

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

    it('Returned text "Invalid input"', async () => {
        assert.isString(resText);
        assert.equal(resText, 'Invalid input');
    });
});
