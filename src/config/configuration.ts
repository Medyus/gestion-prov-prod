export default () => ({
  jwtkey: process.env.JWT_KEY,
  mongodb: process.env.MONGO_DB || 'mongodb://localhost/db-gestion-prov-prod',
});
