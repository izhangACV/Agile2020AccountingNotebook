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

describe('POST debit transaction', () => {
    let statusCode;
    let resBody;

    before(async () => {

        await chai.request(appServer).post('/api/transactions').send({
            type: "credit",
            amount: 5000
        });

        const response = await chai.request(appServer).post('/api/transactions').send({
            type: "debit",
            amount: 4000
        });

        statusCode = response.status;
        resBody = response.body;
    })

    it('Returned status 200', () => {
        assert.equal(statusCode, 200);
    });

    it('Response is JSON', () => {
        assert.isObject(resBody);
    });

    it('Response includes type, amount, id, effectiveDate', () => {
        assert.isDefined(resBody.type);
        assert.isDefined(resBody.amount);
        assert.isDefined(resBody.id);
        assert.isDefined(resBody.effectiveDate);
    });

    it('Returned type is a string equal to debit', () => {
        assert.isString(resBody.type);
        assert.equal(resBody.type, 'debit');
    });

    it('Returned amount is a positive integer equal to 4000', () => {
        assert.isNumber(resBody.amount);
        assert.isAtLeast(resBody.amount, 0)
        assert.equal(resBody.amount, 4000);
    })

    it('Returned id is a string', () => {
        assert.isString(resBody.id);
    });

    it('Returned effectiveDate is a string', () => {
        assert.isString(resBody.effectiveDate);
    })
});
