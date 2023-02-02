const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");

// console("Hello");

async function main (){
    require("dotenv").config()
    const url = `${process.env.GOERLI_URL}`
    const customProvider = new ethers.providers.JsonRpcProvider(url);
    const network = await customProvider.getNetwork();
    
    const sf = await Framework.create({
        chainId: network.chainId,
        provider: customProvider,
        dataMode:"WEB3_ONLY"
    });
    
    // console(sf.settings.config.hostAddress);
}

main();