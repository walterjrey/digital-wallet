import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NetherscanService {
    constructor() {}

    async getBalanceFromAddress(address: string): Promise<any> {
        const response = await axios({
            method: 'GET',
            url: 'https://api.etherscan.io/api?module=account&action=balance&address='+address+'&tag=latest&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY',
          }).catch(() => {
            throw new ForbiddenException('API not available');
          });
      
          return response.data?.result;
    }

    async getFirstTransactionTs(address: string): Promise<any> {
        const response = await axios({
            method: 'GET',
            url: 'https://api.etherscan.io/api?module=account&action=txlist&address='+address+'&startblock=0&endblock=99999999&page=1&offset=0&sort=asc&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY',
          }).catch(() => {
            throw new ForbiddenException('API not available');
          });
          if(response.data && response.data.result && response.data.result.length > 0) {
            return response.data.result[0].timeStamp
          }
          return null;
    }

    async getEuroConversionRate(): Promise<any> {
        // implement
        return Promise.resolve(1.07);
    }

    async getEthPrice(): Promise<any> {
        const response = await axios({
            method: 'GET',
            url: 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY',
        }).catch(() => {
            throw new ForbiddenException('API not available');
        });

        if(response.data && response.data.result && response.data.result.ethusd) {
            const euroRate = await this.getEuroConversionRate();
            let usd = parseFloat(response.data.result.ethusd);
            return { usd: usd, euro: euroRate * usd };
        }
        return null;
    }
}