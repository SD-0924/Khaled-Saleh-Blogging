import { Sequelize } from '@sequelize/core';
import { MsSqlDialect } from '@sequelize/mssql';
import dotenv from 'dotenv'
dotenv.config();

const sequelize = new Sequelize({
    dialect: MsSqlDialect,
    server: process.env.DBSERVER,
    port: Number(process.env.DBPORT),
    database: process.env.DBNAME,
    authentication: {
      type: "default",
      options: {
        userName: process.env.DBUSERNAME,
        password: process.env.DBPASSWORD,
      }
    },
    trustServerCertificate : true,
    encrypt: true
});

export const sequelizeAuthentication = async () => {
    try {
        console.log("Connecting to the database...");
        await sequelize.authenticate();
        console.log("Connection with database has been established successfully.");
        await sequelize.sync();
    } catch (exception : any) {
        console.error('Unable to connect to the database:', exception.message);
    }
}

export default sequelize;