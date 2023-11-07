import bls from "bls-eth-wasm"

(async () => {
    await bls.init(bls.BLS12_381)
    
    // const CurveOrder = bls.getCurveOrder()
    // console.log("Curve Order : ", CurveOrder);

    // 개인키
    let aliceSK;
    // 공개키
    let alicePK:bls.PublicKeyType;
    // 공개키 서명 값 : proof-of-possession
    let alicePop:bls.SignatureType;
    // const msg = 'message approved by both';

    // init alice Key
    aliceSK = new bls.SecretKey()

    // set alice Private Key
    // aliceSK.setInt(1)
    // // CSPRNG : Cryptographically Secure Pseudo-Random Number Generator
    aliceSK.setByCSPRNG() 
    console.log("SecretKey : " + aliceSK.serializeToHexStr());

    alicePK = aliceSK.getPublicKey()
    console.log("PublicKey : " + alicePK.serializeUncompressed());
    console.log("PublicKey : " + alicePK.serialize());
    console.log("PublicKey : " + alicePK.serializeToHexStr());

    // alicePop = aliceSK.sign(alicePK.serializeToHexStr())
    // console.log("Proof-Of-Possession : " + alicePop.serializeToHexStr());

    
    // const isPOP = alicePK.verify(alicePop,alicePK.serializeToHexStr())
    // console.log("Verify Proof-Of-Possession : " + isPOP);
    // let hex = "97f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"
    // let pk = new bls.PublicKey()
    // pk.deserializeHexStr(hex)
    // console.log("PublicKey : " + pk.serializeToHexStr());

    // console.log(typeof pk);
})()
