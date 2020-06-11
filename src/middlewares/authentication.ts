import { randomBytes as CryptoRandomBytes, createCipher as CryptoCipher, createDecipher as CryptoDecipher } from 'crypto';

class Authentication {
    private static appendSession() {

    }

    private static removeSession() {

    }

    /**
     * 
     * @param text String to cipher
     * @param key Key to cipher
     */
    private static encrypt(text: string, key: string): string {
        const cipher = CryptoCipher('aes192', key);
        let token = cipher.update(text);
        token = Buffer.concat([token, cipher.final()]);
        return token.toString('hex');
    }

    /**
     * 
     * @param encrypted Cipher to be dechiphered
     * @param key Key to decipher
     */
    private static decrypt(encrypted: string, key: string): string {
        let decipher = CryptoDecipher('aes192', key);
        let decrypted = decipher.update(encrypted, 'hex');
        decrypted = Buffer.concat([decrypted, decipher.final() ]);
        return decrypted.toString();
    }

    /**
     * 
     * @param userID User ID
     * @param platform OS platform (Win32, linux, darwin, etc)
     */
    public static createSessionObject(userID: string, platform: string): {key: string, cipher: string, timeStamp: Date, platform: string } {
        let session = {
            timeStamp: new Date(),
            platform,
            userID
        }

        let key = CryptoRandomBytes(Math.ceil(32 / 2))
            .toString('hex')
            .slice(0, 32);

        return {
            key,
            cipher: this.encrypt(JSON.stringify({id: session.userID, platform: session.platform, timeStamp: session.timeStamp}), key),
            timeStamp: new Date(),
            platform
        }
    };

    /**
     * 
     * @param session Session object should contain .cipher value to be decrypted and compared to .platform, .id and .timeStamp
     * @param key Key string is used to decrypt session .cipher value
     */
    public static verifySession({cipher, platform, id, timeStamp}, key: string): boolean {
        let decryptedSession = this.decrypt( cipher, key);
        let sessionObj = JSON.parse(decryptedSession);

        if(sessionObj === {id, platform, timeStamp}) {
            return true;
        }
        return false;
    }
}

export default Authentication;