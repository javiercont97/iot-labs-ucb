import mailjet = require('node-mailjet');
import { appLogger, HOST_URL } from '../../config/constants';

class Mailer {
    private static mailjet = mailjet.connect('a4c82f01ae8c4af028920c52363065fa', '1544ce6fff38e5aff2888f9c12444e3b');

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
                            "Email": "kelmorian.labs@gmail.com",
                            "Name": "IoT Labs"
                        },
                        "To": [
                            {
                                "Email": mail,
                                "Name": name
                            }
                        ],
                        "TemplateID": 1504472,
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

    
    public static sendNotificationEmail(mail: string, name: string, app: string, appID: string): void {
        appLogger.verbose('Mailer', 'Sending application ready e-mail notification');
        let request = this.mailjet.post('send', { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "kelmorian.labs@gmail.com",
                            "Name": "IoT Labs"
                        },
                        "To": [
                            {
                                "Email": mail,
                                "Name": name
                            }
                        ],
                        "TemplateID": 1810027,
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