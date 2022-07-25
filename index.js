const express = require('express');
const ethers = require('ethers');
require('dotenv').config();

//setup api----------------------------------
let alchemyApiKey = process.env.ALCHEMYAPIKEY
let provider = new ethers.providers.AlchemyProvider('homestead',process.env.ALCHEMYAPIKEY)
//-----------------------------------

//setup express-----------------------------------
const app = express();
const path = require('path');

//set view engine and views directory-----------------------------------
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

//Calculate Transfer() signature-----------------------------------
//import ethers utils
const utils = ethers.utils
const transferSignature = 'Transfer(address,address,uint256)'
//convert Transfer Signature to bytes before hashing
const transferSignatureBytes = utils.toUtf8Bytes(transferSignature);
//hash the bytes to get the Signature hash
const transferSignatureHash = utils.keccak256(transferSignatureBytes)
console.log(transferSignatureHash);
//-----------------------------------

//Routes-----------------------------------
app.get('/', (req,res) => {
    res.render('home')
})

app.get('/transaction/:transactionHash', async (req,res) => {
    const {transactionHash} = req.params;
    const fullTransaction = await provider.getTransactionReceipt(transactionHash)
    console.log(fullTransaction)
    res.render('transaction', {...fullTransaction, transactionHash, transferSignatureHash})
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})

