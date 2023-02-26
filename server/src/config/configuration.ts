export default () => ({
  hostAPI: process.env.HOST_API,
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresDbName: process.env.POSTGRES_NAME,
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: parseInt(process.env.POSTGRES_PORT),
  defaultLimit: parseInt(process.env.DEFAULT_LIMIT),
});
