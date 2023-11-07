import bls from "bls-eth-wasm"

export const generatorBLSPublicKey = async (serialize: string | Uint8Array) => {
    await bls.init(bls.BLS12_381)

    // BLS public Key 객체(null) 생성
    const publicKey = new bls.PublicKey()

    if (typeof serialize == "string") {
        publicKey.deserializeHexStr(serialize)
    } else {
        if (serialize.byteLength === 96) { // Uncompressed Serialize
            publicKey.deserializeUncompressed(serialize)
        } else if (serialize.byteLength === 48) { // Compressed Serialize
            publicKey.deserialize(serialize)
        }
    }
    return publicKey
}

export const generatorBLSSecretKey = async (serialize: string | Uint8Array) => {
    await bls.init(bls.BLS12_381)

    // BLS Secret Key 객체(null) 생성
    const secretKey = new bls.SecretKey();
    if (typeof serialize == "string") {
        secretKey.deserializeHexStr(serialize);
    } else {
        if(serialize.byteLength === 32) {
            secretKey.deserialize(serialize); 
        }
    }
    return secretKey
}

/**
 * @description 안전한 난수(CSPRNG : Cryptographically Secure Pseudo-Random Number Generator)를 사용하여 BLS Key Pair 생성
 * @returns `{ secretKey: bls.SecretKeyType , publicKey: bls.PublicKeyType }`
 */
export const createCspringBLSKeyPair = async () => {
    await bls.init(bls.BLS12_381); // BLS12-381 커브 초기화

    // BLS Secret Key 객체(null) 생성
    const SK = new bls.SecretKey();

    SK.setByCSPRNG(); // CSPRNG로 비밀 키 생성
    const PK = SK.getPublicKey(); // 공개 키 생성

    return { secretKey: SK, publicKey: PK };
}

export const signMessage = (sk: bls.SecretKeyType, message: string | Uint8Array) => {
    
    //  개인키로 Message 서명
    return sk.sign(message)
}

/**
 * @name 소유권-증명(Proof-of-Possession) 생성
 * @description 검증자에게 전달하기 위한 소유권-증명 데이터 생성
 */
export const proveOwnership = (sk: bls.SecretKeyType,message:string | Uint8Array) => {
    const publicKey = sk.getPublicKey()
    const signature = signMessage(sk, message)

    return {
        publicKey,
        signature,
        message
    }
}

/**
 * @name 소유권-증명(Proof-of-Possession) 검증
 * @description 사용자로부터 전달받은 소유권-증명 데이터 검증
 */
export const verifyOwnership = async () => {
    await bls.init(bls.BLS12_381); // BLS12-381 커브 초기화


}

