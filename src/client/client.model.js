import { Schema, model } from "mongoose";

const ClientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del cliente es obligatorio']
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

export default model('Client', ClientSchema);
