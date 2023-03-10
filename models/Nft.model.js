const { Schema, model } = require('mongoose');

const nftSchema = new Schema(
    {
        owner: {type: Schema.Types.ObjectId, ref: "User"},
        fromCollection: {type: Schema.Types.ObjectId, ref: "Collection"},
        nftName: {
            type: String,
            required: [true, "NFT Name is required"]
        },
        numberId: {
            type: String,
            required: [true, "NFT NumberId is required"]
        },
        imageUrl: {
            type: String,
            required: [true, "NFT Image is required"],
        },
        price: {
            type: Number,
            required: [true, "NFT Price is required"]
        },
        blockchain: {
            type: String,
            required: [true, "NFT Blockchain is required"]
        },
        forSale: {
            type: Boolean,
            required: [true, "For Sale is required"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Nft', nftSchema);
