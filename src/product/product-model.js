import { Schema, model } from "mongoose";

const ProductSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
            maxLength: [100, "Name can't exceed 100 characters"]
        },

        description:{
            type:String,
            required: [true, "Description is required"],
            maxLength: [1000, "Name can't exceed 100 characters"]
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
            required: [true, "Category is required"]
        },
        stock: {
            type: Number,
            required: [true, "Stock is required"],
            min: [0, "Stock cannot be negative"]
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
            required: [true, "Supplier is required"]
        },
        status: {
            type: Boolean,
            default: true
        },
        image: {
            type: String,
            default: null
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        fechaDeVencimiento:{
            type:Date,
            required: true
        },
        fechaDeEntrada:{
            type:Date,
            required: true
        },
        precioUnitario:{
            type:Number,
            required: true,
            maxLength: [100, "Name can't exceed 100 characters"]
        }
        
    },
    {
        timestamps: true,
        versionKey: false
    }
);

ProductSchema.methods.toJSON = function () {
    const { __v, _id, ...product } = this.toObject();
    product.pid = _id;
    return product;
}

export default model('Product', ProductSchema);
