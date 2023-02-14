const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        collections: [{type: Schema.Types.ObjectId, ref: "Collection"}],
        ethereumBalance: {
            type: Number,
            required: [true, "Balance is required"]
        },
        itemsOwned: [{type: Schema.Types.ObjectId, ref: "Nft"}]
    },
    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);