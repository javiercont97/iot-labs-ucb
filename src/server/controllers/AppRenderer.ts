import { Request, Response } from 'express';
import { resolve as resolvePath } from 'path';

export class AppRenderer {
    /**
     * @todo set middlewares for authorization
     */
    public static renderApp(req: Request, res: Response): void {
        let appID = String(req.params.appID);
        let fileName = String(req.params.file);
        let appPath = resolvePath(__dirname, `../../../app/${appID}/`);
        res.sendFile( resolvePath(appPath, fileName));
    }
}