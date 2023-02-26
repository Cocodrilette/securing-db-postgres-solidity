import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  HOST_API: Joi.string().default('http://localhost:5000/api/v1'),
  PORT: Joi.number().default(5000),
  POSTGRES_PASSWORD: Joi.string().default(null),
  POSTGRES_NAME: Joi.string().default(null),
  POSTGRES_HOST: Joi.string().default(null),
  POSTGRES_PORT: Joi.number().default(null),
  POSTGRES_USERNAME: Joi.string().default(null),
  DEFAULT_LIMIT: Joi.number().default(10),
  NODE_ENV: Joi.string().default('dev'),
});
