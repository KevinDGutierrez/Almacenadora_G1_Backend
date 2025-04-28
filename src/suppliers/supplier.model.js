import { Schema, model } from "mongoose";

const SupplierSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del proveedor es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    productsSupplied: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
});

export default model('Supplier', SupplierSchema);
