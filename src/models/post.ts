import sequelize from "../config/sequelize";
import { CategoryInstance } from "./category";
import User from "./user";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";


export interface PostInstance extends Model<InferAttributes<PostInstance>, InferCreationAttributes<PostInstance>> {
    id: CreationOptional<number>;
    title: string;
    content: string;
    userId: number;
}
const Post = sequelize.define<PostInstance>("Post",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    }
)


export default Post;