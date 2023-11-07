import { bytesToHex } from '@noble/curves/abstract/utils';
import { bls12_381 } from '@noble/curves/bls12-381';

const privateKey1 = "5ab6bb33fd50ff401adf6a1cc1065f6b329140b5ef79ccae4f30decc07eef775"
const privateKey2 = "2058fc09516c484340a09b6075328b22aaebcc48f206f324ac318f362fc4076f"

const privateKey = bls12_381.utils.randomPrivateKey()
console.log("privateKey : " + bytesToHex(privateKey));
const publicKey1 = bls12_381.getPublicKey(privateKey1)
const publicKey2 = bls12_381.getPublicKey(privateKey2)
console.log("publicKey1 1 : " + bytesToHex(publicKey1));
console.log("publicKey1 2 : " + bytesToHex(publicKey2));
// const point1 =  bls12_381.G1.ProjectivePoint.fromPrivateKey(privateKey1)
const point1 =  bls12_381.G1.ProjectivePoint.fromHex(publicKey1)
const point2 =  bls12_381.G1.ProjectivePoint.fromPrivateKey(privateKey2)
let zeroPoint = bls12_381.G1.ProjectivePoint.ZERO
console.log("------ Init Point ------");
console.log(zeroPoint);

console.log("------ Add Point1 to Init Point ------");
zeroPoint = zeroPoint.add(point1)
console.log(zeroPoint);

console.log("------ Sub Point1 to Init Point ------");
zeroPoint = zeroPoint.subtract(point1)
console.log(zeroPoint);

console.log("------ Add Point1 to Init Point ------");
zeroPoint = zeroPoint.add(point1)
console.log(zeroPoint);

console.log("------ Init Point pubkey ------");
console.log(zeroPoint.toHex());
console.log(bytesToHex(zeroPoint.toRawBytes()));

