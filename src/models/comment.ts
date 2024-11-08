
import sequelize from "../config/sequelize";
import User from "./user";
import Post from "./post";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export interface CommentInstance extends Model<InferAttributes<CommentInstance>, InferCreationAttributes<CommentInstance>> {
    id: CreationOptional<number>;
    content: string;
    postId: number;
    userId: number;
}

const Comment = sequelize.define<CommentInstance>("Comment",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Post,
                key: 'id',
            },
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


export default Comment;