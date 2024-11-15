
import dotenv from 'dotenv'
import server from './server';
import { sequelizeAuthentication } from './config/sequelize';
dotenv.config();


(async() =>{
  await sequelizeAuthentication();
  server.listen(process.env.PORT, async()=>{
    console.log(`The server started and it's listening at port ${process.env.PORT}`);
  });
})();

import "./models/associations"

