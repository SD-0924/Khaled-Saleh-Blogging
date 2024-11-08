import bcrypt from 'bcrypt';
import sequelize from '../config/sequelize';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';



export interface UserInstance extends Model<InferAttributes<UserInstance>, InferCreationAttributes<UserInstance>> {
    id: CreationOptional<number>;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    isValidPassword(password: string): Promise<boolean>;
}


const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async(user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);


(User.prototype as UserInstance).isValidPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
export default User;
