import mailjet = require('node-mailjet');
import { appLogger } from '../../config/constants';

class Mailer {
    private static mailjet = mailjet.connect('a4c82f01ae8c4af028920c52363065fa', '1544ce6fff38e5aff2888f9c12444e3b');

    /**
     * 
     * @param id User ID
     * @param mail User's e-mail
     * @param name User's name
     */
    public static sendActivationEmail(id: string, mail: string, name: string): void {
        let request = this.mailjet.post('send', { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "kelmorian.labs@gmail.com",
                            "Name": "Kelmorian Labs"
                        },
                        "To": [
                            {
                                "Email": mail,
                                "Name": name
                            }
                        ],
                        "Subject": "Activar cuenta",
                        "TextPart": "",
                        "HTMLPart": `<body>
                                        <h3>Bienvenido a <a href='http://localhost:12321/'>Kelmorian Labs</a>!</h3> <br/>
                                        <p>Si no creaste una cuenta ignora este mensage</p> <br/>
                                        <a href='http://localhost:12321/api/activate-user?id=${id}'>Activar cuenta</a>
                                    </body>`,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            });

        request.then((res) => {
            appLogger.info('Mailer', JSON.stringify(res.body));
        }).catch(err => {
            appLogger.error('Mailer', JSON.stringify(err));
        });
    }
}

export default Mailer;