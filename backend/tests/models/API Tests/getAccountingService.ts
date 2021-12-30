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
import {response} from "express";

const account = new Account()
const appServer = createAppServer(account);

describe('GET account value from creation', () => {
    let statusCode;
    let resBody;
    let resText;

    before(async () => {
        const response = await chai.request(appServer).get('/');
        console.log(response);
        statusCode = response.status;
        resBody = response.body;
        resText = response.text;
    });

    it('Returned status 200', async () => {
        assert.equal(statusCode, 200);
    })

    it('Response is JSON', async () => {
        assert.isObject(resBody);
    });

    it('Returned text "Server is alive"', async () => {
        assert.isString(resText);
        assert.equal(resText, 'Server is alive');
    });
});
