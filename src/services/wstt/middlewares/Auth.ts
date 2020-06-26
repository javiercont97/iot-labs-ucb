import { DB } from "../../../interfaces/dbManager";
import IWSTTAuth from "../interfaces/wsttAuth";
import { appLogger } from "../../../config/constants";


class WSTTAuth {
    public static async Authenticate(credentials: IWSTTAuth): Promise<boolean> {
        if (credentials.appID) {
            appLogger.verbose('WSTT Authentication', 'Authenticating app');
            return new Promise((reject, resolve) => {
                // check for app
                DB.Models.App.findById(credentials.appID, (err, appDB) => {
                    if (err) {
                        appLogger.error('WSTT Authentication', JSON.stringify(err));
                        return reject(false);
                    } else {
                        if (appDB == null) {
                            appLogger.error('WSTT Authentication', 'App not found');
                            reject(false);
                        } else {
                            if (appDB.apiKey == credentials.apiKey) {
                                appLogger.verbose('WSTT Authentication', 'Succeeded');
                                resolve(true);
                            } else {
                                appLogger.warning('WSTT Authentication', 'API Key rejected');
                                reject(false);
                            }
                        }
                    }
                });
            });
        }
        if (credentials.deviceID) {
            appLogger.verbose('WSTT Authentication', 'Authenticating device');
            return new Promise((reject, resolve) => {
                // check for device
                DB.Models.Device.findById(credentials.deviceID, (err, deviceDB) => {
                    if (err) {
                        appLogger.error('WSTT Authentication', JSON.stringify(err));
                        reject(false);
                    } else {
                        if (deviceDB == null) {
                            appLogger.warning('WSTT Authentication', 'Device not found');
                            reject(false);
                        } else {
                            if (deviceDB.apiKey == credentials.apiKey) {
                                appLogger.verbose('WSTT Authentication', 'Succeeded');
                                resolve(true);
                            } else {
                                appLogger.warning('WSTT Authentication', 'API Key rejected');
                                reject(false);
                            }
                        }
                    }
                });
            });
        }
    }
    // public static async AuthorizeToSubscribe(): Promise<boolean> {
    //     return new Promise((resolve, reject) => {
            
    //     });
    // }
}

export default WSTTAuth;