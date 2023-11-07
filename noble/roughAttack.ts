import { bytesToHex, utf8ToBytes } from '@noble/curves/abstract/utils';
import { bls12_381 as bls } from '@noble/curves/bls12-381';

/**
 * @description rough attack는 다중_메시지에_대한_다중_서명에서 발생하는 공격이다.
 */
const signApprove = (secretKey: string, message: string) => {
    const publicKey = bls.getPublicKey(secretKey)
    const messageToBytes = utf8ToBytes(message)
    const signature = bls.sign(messageToBytes, secretKey);

    return {
        publicKey,
        messageToBytes,
        signature
    }
}

const idealCase = () => {
    console.log("----------- 🚀 RUN Ideal Case -----------");
    const aliceSK = "5ab6bb33fd50ff401adf6a1cc1065f6b329140b5ef79ccae4f30decc07eef775"
    const bobSK = "2058fc09516c484340a09b6075328b22aaebcc48f206f324ac318f362fc4076f"
    const alicePK = bls.getPublicKey(aliceSK)
    const bobPK = bls.getPublicKey(bobSK)

    
    // (1) 검증자는 검증할 때마다 aggregater를 수행하면, 시간이 너무 오래 걸린다. 
    // 때문에, 참여자의 public key를 사전에 aggregate화 시켜 보관한다.
    const aggPK = bls.aggregatePublicKeys([alicePK, bobPK])
    console.log(`# Aggregated Public Keys : ${bytesToHex(aggPK)} \n`);


    // (2) 참여자는 다중 서명을 통해 어떤 동작에 대한 승인을 위해 정해진 message를 서명한 후, aggregate signature를 만든다.
    const message = "i approve it by signing this message."
    const aliceSign = signApprove(aliceSK, message)
    const bobSign = signApprove(bobSK, message)
    const aggSignature = bls.aggregateSignatures([aliceSign.signature, bobSign.signature]);
    console.log(`# Aggregated Signatures Keys : ${bytesToHex(aggSignature)}\n`);

    // (3) 검증자는 사전에 약속한 message와 aggregate signature, aggregate public key를 통해 검증한다.
    const isValid = bls.verify(aggSignature, utf8ToBytes(message), aggPK);

    // (4) 참여자 모두가 착한 사람이라는 이상적인 상황, 모두의 동의를 서명으로 얻어 문제 없이 검증을 수행한다.
    console.log(`# Verify Result : ${isValid} \n`);
}

const roughAttack = () => {
    console.log("----------- 🚀 RUN Rough Attack Case -----------");
    // (1) 집단에 참여하기 위해, alice는 개인키로 공개키를 만들어 검증자에게 보낸다.
    const aliceSK = "5ab6bb33fd50ff401adf6a1cc1065f6b329140b5ef79ccae4f30decc07eef775"
    const alicePK = bls.getPublicKey(aliceSK)

    // (2) 이때, bob은 alice의 공개키(pk)를 보고 악의적인 공개키를 만들어 검증자에게 보낸다.
    const bobSK = "2058fc09516c484340a09b6075328b22aaebcc48f206f324ac318f362fc4076f"
    const bobPK = bls.getPublicKey(bobSK)
    const G_AlicePK =  bls.G1.ProjectivePoint.fromHex(bytesToHex(alicePK))
    const G_BobPK =  bls.G1.ProjectivePoint.fromHex(bytesToHex(bobPK))
    const maliciousBobPK = G_BobPK.subtract(G_AlicePK).toRawBytes()
    console.log("# Bob의 악의적인 Public Key : " + bytesToHex(maliciousBobPK) + "\n");
    
    // (3) 검증자는 참여자의 public key를 사전에 aggregate화 시켜 보관한다. 검증자는 Bob의 악의적인 public key를 받는다
    const aggPK = bls.aggregatePublicKeys([alicePK, maliciousBobPK])
    
    // (4) 이때, 검증자가 보관하는 Aggregated Public Keys가 bob의 원래 Public Key와 동일하다.
    console.log("# Bob의 원래 Public Key : " + bytesToHex(bobPK));
    console.log(`# Aggregated Public Keys : ${bytesToHex(aggPK)} \n`);

    // (5) Bob은 어떤 동작에 대한 승인을 위해 기존의 secret key로 정해진 message를 서명한 후, aggregate signature를 만든다.
    // 이때, Alice의 동의 없이 혼자서 서명을 만들고 검증자에게는 Alice와 같이 만든 aggregate signature라고 말하며 전달한다.
    const message = "i approve it by signing this message."
    const bobSign = signApprove(bobSK, message)
    const aggSignature = bls.aggregateSignatures([bobSign.signature]);
    // Aggregated Signatures Keys와 Bob의 서명이 동일하다.
    console.log(`# Bob Signatures : ${bytesToHex(bobSign.signature)}`);
    console.log(`# Aggregated Signatures Keys : ${bytesToHex(aggSignature)} \n`);

    // (6) 검증자는 사전에 약속한 message와 aggregate signature, aggregate public key를 통해 검증한다.
    const isValid = bls.verify(aggSignature, utf8ToBytes(message), aggPK);

    // (7) Alice의 동의(서명) 없이, Bob이 혼자 다중 서명 프로토콜 검증을 통과 하게 된다.
    console.log(`# Verify Result : ${isValid} \n`);
}

(async () => {
    // idealCase();
    roughAttack()
})()