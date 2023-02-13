const { Schema, model } = require('mongoose');

const collectionSchema = new Schema(
    {
        collectionName: {
            type: String,
            required: [true, "Collection Name is required"],
            unique: true
        },
        owner: {type: Schema.Types.ObjectId, ref: "User"},
        size: {
            type: Number,
            required: [true, "Collection Size is required"]
        },
        logoUrl: {
            type: String,
            required: [true, "Collection Logo is required"],
            unique: true
        },
        backgroundHeader: {
            type: String,
            required: [true, "Collection Background Header is required"],
            unique: true
        },
        description: {
            type: String,
            required: [true, "Collection Description is required"]
        },
        blockchain: {
            type: String,
            required: [true, "Collection Blockchain is required"]
        },
        items: [{type: Schema.Types.ObjectId, ref: "Nft"}]
    },
    {
        timestamps: true
    }
);

module.exports = model('Collection', collectionSchema);

