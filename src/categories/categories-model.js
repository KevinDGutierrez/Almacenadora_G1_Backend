import { Schema, model } from "mongoose";

const CategorieSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
            maxLength: [25, "Cant be overcome 25 characters"]
        },
        description: {
            type: String,
            required: [true, " description is required"],
            maxLength: [2000, "Cant be overcome 25 characters"]
        },
        status:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Categories', CategorieSchema);