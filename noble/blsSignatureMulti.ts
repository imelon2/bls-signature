import { bytesToHex, utf8ToBytes } from '@noble/curves/abstract/utils';
import { bls12_381 as bls } from '@noble/curves/bls12-381';

const privateKeys = [
    '18f020b98eb798752a50ed0563b079c125b0db5dd0b1060d1c1b47d4a193e1e4',
    'ed69a8c50cf8c9836be3b67c7eeff416612d45ba39a5c099d48fa668bf558c9c',
    '16ae669f3be7a2121e17d0c68c05a8f3d6bef21ec0f2315f1d7aec12484e4cf5',
];
const message = 'Sign Message';
const messages = ['Sign Message1', 'Sign Message2', 'Sign Message3'];

/**
 * @name 단일_메시지에_대한_다중_서명
 */
const case1 = async () => {
    console.log("----------- 🚀 RUN 단일_메시지에_대한_다중_서명 -----------");
    const publicKeys = privateKeys.map(bls.getPublicKey);
    const messageToBytes = utf8ToBytes(message)
    const signatures = privateKeys.map((p) => bls.sign(messageToBytes, p));

    // aggregate 공개키
    const aggPubKey = bls.aggregatePublicKeys(publicKeys);
    console.log(`# Aggregated Public Keys : ${bytesToHex(aggPubKey)}`);
    // aggregate 서명
    const aggSignature = bls.aggregateSignatures(signatures);
    console.log(`# Aggregated Signatures Keys : ${bytesToHex(aggSignature)}`);
    // verify
    const isValid = bls.verify(aggSignature, messageToBytes, aggPubKey);

    console.log(`# Verify Result : ${isValid} \n`);
}

/**
 * @name 다중_메시지에_대한_다중_서명
 * @description 다중 메시지 다중 서명의 검증은 Aggregated Public Keys가 아닌 개별 Public Keys[]를 사용한다.
 */
const case2 = async () => {
    console.log("----------- 🚀 RUN 다중_메시지에_대한_다중_서명 -----------");
    const publicKeys = privateKeys.map(bls.getPublicKey);
    const messagesToBytes = messages.map((m) => utf8ToBytes(m))
    const signatures = privateKeys.map((p, i) => bls.sign(messagesToBytes[i], p));

    // aggregate 서명
    console.log(`# Aggregated Public Keys : X`);
    const aggSignature = bls.aggregateSignatures(signatures);
    console.log(`# Aggregated Signatures Keys : ${bytesToHex(aggSignature)}`);
    // verify
    const isValid = bls.verifyBatch(aggSignature, messagesToBytes, publicKeys);

    console.log(`# Verify Result : ${isValid} \n`);
}

(async() => {
    await case1()
    await case2()
})()