import { appLogger, API_KEY_SIZE } from "../../config/constants";
import { randomBytes as CryptoRandomBytes } from 'crypto';

export const generateApiKey: () => string = () => {
    appLogger.verbose('API-Key', 'Generate new API key');
            let apiKey = CryptoRandomBytes(Math.ceil(API_KEY_SIZE / 2))
                .toString('hex')
                .slice(0, API_KEY_SIZE);

    return apiKey;
}