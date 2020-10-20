import { Request, Response } from 'express';
import { appLogger, ALLOWED_EXTENTIONS, MAX_FILE_SIZE } from '../../config/constants';
import { UploadedFile } from 'express-fileupload';


export class FileValidator {
    public static verifyFileExistance(req: Request, res: Response, next: Function): void {
        if(!req.files) {
            appLogger.warning('File Validator', 'No file uploaded');
            next();
        } else {
            appLogger.verbose('File Validator', 'File exists');
            FileValidator.verifyFileExtention(req, res, next);
        }
    }

    public static verifyFileExtention(req: Request, res: Response, next: Function): void{        
        let appFile: UploadedFile = req.files.appFiles || req.files.appFiles[0];
        let fileName = String(appFile.name).split('.');
        let extention = fileName[fileName.length - 1];

        if(ALLOWED_EXTENTIONS.indexOf(extention) < 0) {
            appLogger.warning('File Validator', `File extention is not allowed [${extention}]`);
            res.status(400).json({
                err: {
                    message: 'Las extenciones permitidas son: [' + ALLOWED_EXTENTIONS.join(', ') + ']'
                }
            });
        } else {
            appLogger.verbose('File Validator', 'File extention verified');
            FileValidator.verifyFileSize(req, res, next);
        }
    }

    public static verifyFileSize(req: Request, res: Response, next: Function): void {
        let appFile: UploadedFile = req.files.appFiles || req.files.appFiles[0];

        if( (appFile.size/1048576) > MAX_FILE_SIZE) {
            appLogger.warning('File Validator', `Max file size is 25[MB], this file is ${appFile.size/1048576}[MB]`);
            res.status(400).json({
                err: {
                    message: `El tamaño maximo permitido es 25[MB], el tamaño de este archivo es ${appFile.size/1048576}[MB]`
                }
            });
        } else {
            appLogger.verbose('File Validator', 'File size verified');
            next();
        }
    }
}