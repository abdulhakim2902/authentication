import { WalletType } from 'src/enums';
import { numberToHex, hexToU8a, isHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';

import nacl from 'tweetnacl';
import ethers from 'ethers';

import * as bs58 from 'bs58';
import * as nearAPI from 'near-api-js';

export async function validateSignature(
  account: string,
  nonce: string,
  signature: string,
  walletType: WalletType,
): Promise<boolean> {
  switch (walletType) {
    case WalletType.POLKADOTJS: {
      const sig = isHex(signature) ? signature : '0x'.concat(signature);
      const n = Number(nonce);
      const { isValid } = signatureVerify(numberToHex(n), sig, account);

      return isValid;
    }

    case WalletType.METAMASK: {
      const sig = isHex(signature) ? signature : '0x'.concat(signature);
      const n = Number(nonce);
      const address = ethers.verifyMessage(numberToHex(n), sig);
      return address === account;
    }

    case WalletType.NEAR: {
      try {
        const environment = process.env.NODE_ENV;
        const network = environment === 'production' ? 'mainnet' : 'testnet';
        const [publicAddress, sig] = signature.split(':');
        const encode = bs58.encode(Buffer.from(hexToU8a(publicAddress)));
        const pk = 'ed25519:'.concat(encode);
        const rpcURL = `https://rpc.${network}.near.org`;
        const provider = new nearAPI.providers.JsonRpcProvider({ url: rpcURL });
        const address = isHex(account) ? account.substring(2) : account;
        const result = await provider.query({
          request_type: 'view_access_key',
          account_id: address,
          public_key: pk,
          finality: 'optimistic',
        });

        if (!Boolean(result)) {
          return false;
        }

        return nacl.sign.detached.verify(
          Buffer.from(numberToHex(Number(nonce))),
          Buffer.from(hexToU8a(isHex(sig) ? sig : '0x'.concat(sig))),
          Buffer.from(publicAddress.slice(2), 'hex'),
        );
      } catch (e) {
        return false;
      }
    }

    default:
      return false;
  }
}
