enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export type Transaction = {
  from: string;
  to: string;
  value: number;
  timeStamp: Date;
};

export class Luksoscan {
  constructor() {
    console.log('Luksoscan constructor');
  }

  async getTransactions(
    walletAddress: string,
    network: keyof typeof Network,
  ): Promise<Transaction[] | null> {
    const url = `https://api.explorer.execution.${network}.lukso.network.luksoscan.com/api/v2/addresses/${walletAddress}/transactions`;

    console.log('Luksoscan.getTransactions request', url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Luksoscan.getTransactions', data);

      if (!data.result && !Array.isArray(data.items)) {
        console.log('Luksoscan.getTransactions result is not array');
        return null;
      }
      const transactions: Transaction[] = [];
      for (const tx of data.items) {
        const transaction: Transaction = {
          from: tx.from.hash,
          to: tx.to.hash,
          value: tx.value,
          timeStamp: tx.timestamp,
        };
        transactions.push(transaction);
      }
      return transactions;
    } catch (e) {
      console.error('Luksoscan.getTransactions', e);
      return null;
    }
  }
}

const luksoscan = new Luksoscan();
export default luksoscan;
