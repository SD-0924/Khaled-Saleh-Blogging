import dotenv from 'dotenv'
import { Sequelize } from 'sequelize';
dotenv.config();

const sequelize = new Sequelize({
  dialect: "mssql",
  host: process.env.DBSERVER,
  port: Number(process.env.DBPORT),
  database: process.env.DBNAME,
  username: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  dialectOptions: {
      options: {
          trustServerCertificate: true,
          encrypt: true,
      }
  },
  logging: false
});

export const sequelizeAuthentication = async () => {
    try {
        console.log("Connecting to the database...");
        await sequelize.authenticate();
        console.log("Connection with database has been established successfully.");
    } catch (exception : any) {
        console.error('Unable to connect to the database:', exception.message);
    }
}

export default sequelize;