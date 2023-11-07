import bls from "bls-eth-wasm";
import { createCspringBLSKeyPair, signMessage } from "./herumi/utils";


(async() => {
    await bls.init(bls.BLS12_381); // BLS12-381 커브 초기화

    const AliceKeyPair = await createCspringBLSKeyPair();
    const BobKeyPair = await createCspringBLSKeyPair();
    const message = "approve message"

    const aggPK = new bls.PublicKey()
    aggPK.add(AliceKeyPair.publicKey)
    aggPK.add(BobKeyPair.publicKey)
    bls.getFieldOrder
    console.log("Agg Public Key : " + aggPK.serializeToHexStr());


    
})()
    
    
