import { randomBytes as CryptoRandomBytes, createCipher as CryptoCipher, createDecipher as CryptoDecipher } from 'crypto';
import { Request, Response } from 'express';
import { DB } from '../interfaces/dbManager';


class Authentication {
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
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    /**
     * 
     * @param userID User ID
     * @param platform OS platform (Win32, linux, darwin, etc)
     */
    public static createSessionObject(userID: string, platform: string): { key: string, session: string } {
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
            session: this.encrypt(JSON.stringify({ id: session.userID, platform: session.platform, timeStamp: session.timeStamp }), key)
        }
    };

    /**
     * 
     * @param cipher Stored session object
     * @param session Current session object
     * @param key Decryption Key
     */
    public static verifySession(cipher: string, session: string, key: string): boolean {
        let storedSession = JSON.parse(this.decrypt(cipher, key));
        let currentSession = JSON.parse(this.decrypt(session, key));

        if (storedSession.id == currentSession.id && storedSession.platform == currentSession.platform && storedSession.timeStamp == currentSession.timeStamp) {
            return true;
        }
        return false;
    }

    /**
     * Verify is current session is active
     * @param req Request object
     * @param res Response object
     * @param next Function to be executed on success
     */
    public static verifySessionActive(req: Request, res: Response, next: Function): void {
        let id = String(req.query.user);
        let session = String(req.query .session);

        DB.Models.User.findById(id, (err, userDB) => {
            if(err) {
                return res.status(500).json({
                    err
                });
            }
            if(userDB === null) {
                return res.status(404).json({
                    err: {
                        message: 'No such user'
                    }
                });
            }

            let openSessions = userDB.openSessions;

            let index = openSessions.findIndex( value => {
                return value.session == session;
            });


            if(index < 0 || !Authentication.verifySession(openSessions[index].session, session, openSessions[index].key)) {
                return res.status(403).json({
                    err: {
                        message: 'Invalid session'
                    }
                });
            }
            next();
        });

    }
}

export default Authentication;