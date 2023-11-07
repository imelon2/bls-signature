import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/curves/abstract/utils';
import { bls12_381 as bls } from '@noble/curves/bls12-381';

{
    const privateKey = "5ab6bb33fd50ff401adf6a1cc1065f6b329140b5ef79ccae4f30decc07eef775"
    const publicKey = bls.getPublicKey(privateKey)
    const message = utf8ToBytes('Sign Message');
    
    const signature = bls.sign(message, privateKey);
    const isValid = bls.verify(signature, message, publicKey);
    console.log({ publicKey, signature, isValid });
}