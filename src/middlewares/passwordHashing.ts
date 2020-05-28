import { randomBytes, createHmac } from 'crypto';
import { SALT_SIZE } from '../config/constants';


class PasswordInfo {
    public salt: String;
    public hash: String;

    constructor(salt: String, hash: String) {
        this.salt = salt;
        this.hash = hash;
    }
}

export class PasswordHaher {
    private static genRandomString(length): String {
        return randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
    };

    /**
     * hash password with sha512.
     * @function
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
     */
    private static sha512(password: String, salt: String): PasswordInfo {
        let hash = createHmac('sha512', salt.toString() ); /** Hashing algorithm sha512 */
        hash.update(password.toString());
        let value = hash.digest('hex');
        return new PasswordInfo ( salt, value );
    };

    public static saltHashPassword(userpassword): String {
        let salt = this.genRandomString(SALT_SIZE);
        let saltedHash = this.sha512(userpassword, salt);
        return `${saltedHash.salt}$${saltedHash.hash}`;
    }

    public static verifyPassword(saltedHash: String, password: String): Boolean {
        let salt = saltedHash.split('$')[0];
        let saltedHashToCompare = this.sha512(password, salt);
        return (saltedHash == `${saltedHashToCompare.salt}$${saltedHashToCompare.hash}`);
    }
}