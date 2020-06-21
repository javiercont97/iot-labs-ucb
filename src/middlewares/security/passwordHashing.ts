import { randomBytes, createHmac } from 'crypto';
import { SALT_SIZE, appLogger } from '../../config/constants';


class PasswordInfo {
    public salt: String;
    public hash: String;

    constructor(salt: String, hash: String) {
        this.salt = salt;
        this.hash = hash;
    }
}

export class PasswordHaher {
    /**
     * Generates a string of the given length in hex format
     * @param {number} length Random string length
     */
    private static genRandomString(length: number): String {
        appLogger.verbose('Password Hasher', 'Generating random string');
        return randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
    };

    /**
     * hash password with sha512.
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
     */
    private static sha512(password: String, salt: String): PasswordInfo {
        appLogger.verbose('Password Hasher', 'Creating hash');
        let hash = createHmac('sha512', salt.toString() ); /** Hashing algorithm sha512 */
        hash.update(password.toString());
        let value = hash.digest('hex');
        return new PasswordInfo ( salt, value );
    };

    /**
     * Create a password hashed string
     * @param {string} userpassword Password provided by User
     */
    public static saltHashPassword(userpassword: string): String {
        appLogger.verbose('Password Hasher', 'Creating sal-hash');
        let salt = this.genRandomString(SALT_SIZE);
        let saltedHash = this.sha512(userpassword, salt);
        return `${saltedHash.salt}$${saltedHash.hash}`;
    }

    /**
     * Compares password given by user with DB stored hash
     * @param {string} saltedHash DB stored hash
     * @param {string} password Password provided by User
     */
    public static verifyPassword(saltedHash: String, password: String): Boolean {
        appLogger.verbose('Password Hasher', 'Processing password');
        let salt = saltedHash.split('$')[0];
        let saltedHashToCompare = this.sha512(password, salt);
        return (saltedHash == `${saltedHashToCompare.salt}$${saltedHashToCompare.hash}`);
    }
}