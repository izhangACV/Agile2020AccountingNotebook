import { Transaction, TransactionType } from './Transaction';
import { Semaphore } from 'async-mutex';

export interface AccountInterface {
  getValue(): Promise<number>;
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction>;
  commit(transaction: Transaction): Promise<Transaction>;
}

const INITIAL_VALUE = 0;

export class Account implements AccountInterface {
  private value: number;
  private readonly transactions: Transaction[];

  private readers = 0;
  private writers = 0;
  private noReaders = new Semaphore(1);
  private noWriters = new Semaphore(1);


  constructor(value: number = INITIAL_VALUE) {
    this.value = value;
    this.transactions = [];
  }

  private async readerEntry() {
    await this.noReaders.acquire();
    if (this.readers === 0) await this.noWriters.acquire();
    this.readers++;
    this.noReaders.release();
  }

  private readerExit() {
    this.readers--;
    if (this.readers === 0) this.noWriters.release();
  }

  async getValue(): Promise<number> {
    let value: number;

    try {
      await this.readerEntry();

      value = this.value;
    } finally {
      this.readerExit();
    }

    return value;
  }

  async getTransactions(): Promise<Transaction[]> {
    let transactions: Transaction[];

    try {
      await this.readerEntry();

      transactions = this.transactions;
    } finally {
      this.readerExit();
    }

    return transactions;
  }

  async getTransaction(id: string): Promise<Transaction> {
    let transaction: Transaction;

    try {
      await this.readerEntry();

      transaction = this.transactions.find(t => t.id === id) as Transaction;
      if (!transaction) throw new Error('Transaction not found');
    } finally {
      this.readerExit();
    }

    return transaction;
  }

  private canConfirm(transaction: Transaction): boolean {
    // If transaction is credit, it can always be accepted
     return (transaction.type === TransactionType.DEBIT ? this.value >= transaction.amount : true);
  }

  private async writerEntry() {
    if (this.writers === 0) await this.noReaders.acquire();
    this.writers++;
    await this.noWriters.acquire();
  }

  private writerExit() {
    this.noWriters.release();
    this.writers--;
    if (this.writers === 0) this.noReaders.release();
  }

  async commit(transaction: Transaction): Promise<Transaction> {
    try {
      await this.writerEntry();

      if (!this.canConfirm(transaction)) throw new Error('Not enough funds');

      // update value
      if (transaction.type === TransactionType.DEBIT) this.value -= transaction.amount;
      else this.value += transaction.amount;

      // save history
      transaction.confirm();
      this.transactions.push(transaction);
    } finally {
      this.writerExit();
    }

    return transaction;
  }

}
