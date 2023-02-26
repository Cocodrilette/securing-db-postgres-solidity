import { v5 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) => {
  if (!file) return callback(new Error('File is empty'), '');

  const fileType = file.originalname.split('.')[1];
  const fileName =
    'prod' +
    '-' +
    uuid(
      `${file.originalname}`,
      '7476caf5-87f0-4158-bfc3-af681dca7b4a',
      /* random valid UUID or predefined ns 
      details: https://stackoverflow.com/questions/10867405/generating-v5-uuid-what-is-name-and-namespace                                      
      */
    ) +
    `.${fileType}`;

  callback(null, fileName);
};
