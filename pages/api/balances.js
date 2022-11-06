import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

export default async function handler(req, res) {
    // reads the api key from .env.local and starts Moralis SDK
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    const { addr: address } = req.query;

    // Promise.all() for receiving data async from two endpoints
    const [nativeBalance, tokenBalances] = await Promise.all([
        Moralis.EvmApi.balance.getNativeBalance({
            chain: EvmChain.GOERLI,
            address,
        }),
        Moralis.EvmApi.token.getWalletTokenBalances({
            chain: EvmChain.GOERLI,
            address,
        }),
    ]);
    res.status(200).json({
        // formatting the output
        nativeBalance: nativeBalance.result.balance.ether,
        tokenBalances: tokenBalances.result.map((token) => token.display()),
    });
}