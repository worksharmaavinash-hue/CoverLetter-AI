import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("users", userSchema)
export default userModel;