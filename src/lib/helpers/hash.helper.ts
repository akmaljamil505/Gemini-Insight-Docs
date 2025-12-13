
export default class HashHelper {

    static generateUniqueHash() : string {
        const randomArray = new Uint8Array(32);
        const hasher = new Bun.CryptoHasher("sha256");
        hasher.update(randomArray);
        return hasher.digest("hex");
    }

}