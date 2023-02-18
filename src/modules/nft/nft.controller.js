const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const express = require('express')
const { Alchemy } = require('alchemy-sdk');
const { Network } = require('alchemy-sdk');

const app = express();

const config = {
    apiKey: "Fxmfls6frj5CKArdLMDMMESogb0Y0JO0",
    network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(config);

async function findAll(req, res, next) {
    try {
        // Get all NFTs
        const nfts = await alchemy.nft.getNftsForOwner(req.query.address);
        // Print NFTs
        var len = nfts.ownedNfts.length;
        var IDs = [];
        for (let i = 0; i < len; i++) {
            IDs.push(nfts.ownedNfts[i].tokenId);
        }
        return res.json(IDs);
    } catch (error) {
        next(error);
    }
}

async function findOne(req, res, next) {
    try {
        const nfts = await alchemy.nft.getNftsForOwner(req.query.address);
        var len = nfts.ownedNfts.length;
        var urls = [];
        for (let i = 0; i < len; i++) {
            urls.push(nfts.ownedNfts[i].media[0].gateway);
        }
        return res.json(urls);
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    findAll,
    findOne,
};
