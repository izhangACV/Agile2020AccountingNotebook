import chai = require('chai');
import 'mocha';

import { Account } from '../../src/models/Account';
import { Transaction, TransactionType } from '../../src/models/Transaction';

const expect = chai.expect;

describe('Credit account model', () => {
  it('Should be an object with value 0 and an empty transaction history on creation', async () => {
    const account = new Account();
    const value = await account.getValue();
    expect(value).to.equal(0);

    const transactions = await account.getTransactions();
    expect(transactions.length).to.equal(0);
  });

  it('Should throw when there are not enough funds for debit but accept credit', async () => {
    const account = new Account();
    const debit = new Transaction(TransactionType.DEBIT, 1);
    const credit = new Transaction(TransactionType.CREDIT, 1);

    let err;
    try {
      await account.commit(debit)
    } catch (e) {
      err = e;
    }

    expect(err).to.be.a('Error', 'Not enough funds');
    expect(await account.commit(credit)).to.have.property('id');
  });

  it('Should accept operations while valid', async () => {
    const account = new Account();
    const credit1 = new Transaction(TransactionType.CREDIT, 100);
    const debit1 = new Transaction(TransactionType.DEBIT, 10);
    const debit2 = new Transaction(TransactionType.DEBIT, 30);

    expect(await account.commit(credit1)).to.have.property('id');
    expect(await account.commit(debit1)).to.have.property('id');
    expect(await account.commit(debit2)).to.have.property('id');
  });

  it('Should return updated transaction when accepted', async () => {
    const account = new Account();
    const credit = new Transaction(TransactionType.CREDIT, 100);

    await account.commit(credit);

    expect(credit.id).to.be.a('string');
    expect(credit.effectiveDate).to.be.a('string');
  });

  it('Should return save accepted transactions and update its value', async () => {

    const account = new Account();
    const credit1 = new Transaction(TransactionType.CREDIT, 100);
    const credit2 = new Transaction(TransactionType.CREDIT, 200);

    // no transactions
    expect(await account.getValue()).to.equal(0);

    let transactions = await account.getTransactions();
    expect(transactions.length).to.equal(0);

    await account.commit(credit1);
    expect(await account.getValue()).to.equal(100);

    transactions = await account.getTransactions();
    expect(transactions.length).to.equal(1);

    await account.commit(credit2);
    expect(await account.getValue()).to.equal(300);

    transactions = await account.getTransactions();
    expect(transactions.length).to.equal(2);
  });

  it('Should return transaction when asked with id', async () => {
    const account = new Account();
    const credit = new Transaction(TransactionType.CREDIT, 100);

    await account.commit(credit);

    const foundTransaction = await account.getTransaction(credit.id as string);
    expect(foundTransaction).to.be.an('object');
  });
});
