import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import sequelize from "../config/sequelize";
import User from "./user";

export interface PostInstance extends Model<InferAttributes<PostInstance>, InferCreationAttributes<PostInstance>> {
    id: number;
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
    }, 
    {
        tableName: 'posts'
    }
)


export default Post;