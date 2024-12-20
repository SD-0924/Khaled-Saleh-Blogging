
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../config/sequelize";

export interface CategoryInstance extends Model<InferAttributes<CategoryInstance>, InferCreationAttributes<CategoryInstance>> {
    id: CreationOptional<number>;
    name: string;
}
const Category = sequelize.define<CategoryInstance>("Category",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }
)


export default Category;