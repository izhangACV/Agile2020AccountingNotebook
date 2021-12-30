// @ts-nocheck

import chai = require('chai');
import 'mocha';

import { Transaction, TransactionType } from '../../src/models/Transaction';

const expect = chai.expect;

describe('Credit transaction model', () => {
  const creditTransaction = new Transaction(TransactionType.CREDIT, 60);

  it('Should be an object with type, amount, id and effectiveDate', () => {
    expect(creditTransaction).to.have.all.keys(['type', 'amount', 'id', 'effectiveDate']);
  });

  it('Should have only type and amount on creation and not be confirmed', () => {
    expect(creditTransaction.type).to.equal(TransactionType.CREDIT);
    expect(creditTransaction.amount).to.equal(60);
    expect(creditTransaction.id).to.equal(null);
    expect(creditTransaction.effectiveDate).to.equal(null);

    expect(creditTransaction.isConfirmed()).to.equal(false);
  });

  it('Should have id and effectiveDate on confirmation', () => {
    creditTransaction.confirm();

    expect(creditTransaction.id).to.be.a('string');
    expect(creditTransaction.effectiveDate).to.be.a('string');

    expect(creditTransaction.isConfirmed()).to.equal(true);
  });
});

describe('Invalid transaction model', () => {
  const creditTransaction = new Transaction(TransactionType.CREDIT, 60);

  it('Should be an object with type, amount, id and effectiveDate', () => {
    expect(creditTransaction).to.have.all.keys(['type', 'amount', 'id', 'effectiveDate']);
  });
});

describe('Debit transaction model', () => {
  const creditTransaction = new Transaction(TransactionType.DEBIT, 30);

  it('Should be an object with type, amount, id and effectiveDate', () => {
    expect(creditTransaction).to.have.all.keys(['type', 'amount', 'id', 'effectiveDate']);
  });

  it('Should have only type and amount on creation and not be confirmed', () => {
    expect(creditTransaction.type).to.equal(TransactionType.DEBIT);
    expect(creditTransaction.amount).to.equal(30);
    expect(creditTransaction.id).to.equal(null);
    expect(creditTransaction.effectiveDate).to.equal(null);

    expect(creditTransaction.isConfirmed()).to.equal(false);
  });

  it('Should have id and effectiveDate on confirmation', () => {
    creditTransaction.confirm();

    expect(creditTransaction.id).to.be.a('string');
    expect(creditTransaction.effectiveDate).to.be.a('string');

    expect(creditTransaction.isConfirmed()).to.equal(true);
  });
});
