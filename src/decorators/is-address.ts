import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { WalletType } from 'src/enums';
import { hexToU8a, isHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

export function IsAddress(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAddress',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!Object.values(WalletType).includes(relatedValue)) return false;
          if (typeof value !== 'string') return false;

          if (typeof relatedValue !== 'string') return false;
          switch (relatedValue) {
            case WalletType.POLKADOTJS: {
              if (value.length !== 66) return false;
              try {
                const addressToU8a = isHex(value)
                  ? hexToU8a(value)
                  : decodeAddress(value);
                const validAddress = encodeAddress(addressToU8a);
                return Boolean(validAddress);
              } catch {
                // ignore
              }
              return false;
            }
            case WalletType.METAMASK:
              return false;
            case WalletType.NEAR:
              return false;
            default:
              return false;
          }
        },
      },
    });
  };
}
