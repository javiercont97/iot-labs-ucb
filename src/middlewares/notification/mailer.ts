import mailjet = require('node-mailjet');
import { ACTIVATION_MAIL_TEMPLATE, appLogger, ERROR_MAIL_TEMPLATE, HOST_URL, MAILJET_APIKEY_PRIVATE, MAILJET_APIKEY_PUBLIC, READY_MAIL_TEMPLATE, SENDER_EMAIL } from '../../config/constants';

class Mailer {
    private static mailjet = mailjet.connect(MAILJET_APIKEY_PUBLIC, MAILJET_APIKEY_PRIVATE);

    /**
     * Sends an activation e-mail to user's specified mail
     * @param id User ID
     * @param mail User's e-mail
     * @param name User's name
     */
    public static sendActivationEmail(id: string, mail: string, name: string): void {
        appLogger.verbose('Mailer', 'Sending user activation e-mail');
        let request = this.mailjet.post('send', { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": SENDER_EMAIL,
                            "Name": "IoT Labs"
                        },
                        "To": [
                            {
                                "Email": mail,
                                "Name": name
                            }
                        ],
                        "TemplateID": ACTIVATION_MAIL_TEMPLATE,
                        "TemplateLanguage": true,
                        "Subject": "Activar cuenta",
                        "Variables": {
                            "name": `${name}`,
                            "confirmation_link": `${HOST_URL}/api/activate-user?id=${id}`
                        }
                    }
                ]
            });

        request.then((res) => {
            // appLogger.verbose('Mailer', JSON.stringify(res.body));
            appLogger.verbose('Mailer', 'User activation mail send');
        }).catch(err => {
            appLogger.error('Mailer', JSON.stringify(err));
        });
    }

    /**
     * 
     * @param mail User's e-mail address
     * @param name User's name
     * @param app Laboratory name
     * @param appID Laboratory ID
     */
    public static sendNotificationEmail(mail: string, name: string, app: string, appID: string): void {
        appLogger.verbose('Mailer', 'Sending application ready e-mail notification');
        let request = this.mailjet.post('send', { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": SENDER_EMAIL,
                            "Name": "IoT Labs"
                        },
                        "To": [
                            {
                                "Email": mail,
                                "Name": name
                            }
                        ],
                        "TemplateID": READY_MAIL_TEMPLATE,
                        "TemplateLanguage": true,
                        "Subject": `${app} lista para usar`,
                        "Variables": {
                            "user_name": `${name}`,
                            "app_name": `${app}`,
                            "app_link": `${HOST_URL}/api/render/${appID}`
                        }
                    }
                ]
            });

        request.then((res) => {
            // appLogger.verbose('Mailer', JSON.stringify(res.body));
            appLogger.verbose('Mailer', 'App ready mail send');
        }).catch(err => {
            appLogger.error('Mailer', JSON.stringify(err));
        });
    }

    /**
     * 
     * @param mail User's e-mail address
     * @param name User's name
     * @param app Laboratory name
     * @param appID Laboratory ID
     */
     public static sendErrorsEmail(mail: string, name: string, app: string, errorLog: string): void {
        appLogger.verbose('Mailer', 'Sending compilation error notification');
        let request = this.mailjet.post('send', { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": SENDER_EMAIL,
                            "Name": "IoT Labs"
                        },
                        "To": [
                            {
                                "Email": mail,
                                "Name": name
                            }
                        ],
                        "TemplateID": ERROR_MAIL_TEMPLATE,
                        "TemplateLanguage": true,
                        "Subject": `Error al compilar el laboratorio ${app}`,
                        "Variables": {
                            "user_name": `${name}`,
                            "app_name": `${app}`,
                            "errorLog": errorLog
                        }
                    }
                ]
            });

        request.then((res) => {
            // appLogger.verbose('Mailer', JSON.stringify(res.body));
            appLogger.verbose('Mailer', 'Compilation error mail send');
        }).catch(err => {
            appLogger.error('Mailer', JSON.stringify(err));
        });
    }

    /**
     * Sends a recovery e-mail to user's specified mail
     * @param id User ID
     * @param mail User's mail
     * @param name User's name
     */
    public static sendRecoveryMail(id: string, mail: string, name: string): void {
        // appLogger.verbose('Mailer', 'Sending account recovery e-mail');
        appLogger.warning('Mailer', 'Not implemented');
    }
}

export default Mailer;