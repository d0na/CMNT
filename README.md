
# Non Mutable Fungible Tokens

## Starting 
1. `npm install --legacy-peer-deps`



# Contracts



## Useful commands 

### Testing
Testing contracts with the local node provided by hardhat (configured in ```hardat.conifg.ts``` as localhost network ). Using the local node gives the possibility to store the blockchain state (stateful).

```
npx hardhat node
npx hardhat test --grep Jack --network localhost
```

If it doesn't need to test contracts in a stateful way you can just use the hardhat network

```
npx hardhat test --grep Jack
```

### Running scripts

Run testbed script on Sepolia network

```
npx hardhat run scripts/testbedSAC.ts --network sepolia
```

### Package.json scripts
```
"test": "npx hardhat test",
"test:nmt": "npx hardhat test --grep JacketNMT",
"test:asset": "npx hardhat test test/JacketMutableAsset.ts",
"test:success": "npx hardhat test test/JacketMutableAssetSuccess.ts",
"test:failure": "npx hardhat test test/JacketMutableAssetFailure.ts",
"deploy": "npx hardhat deploy",
"compile": "npx hardhat compile",
"run": "npx hardhat run"
```
They are actually shortcuts to the features of the hardhat.

In particular:
- `test:nmt` : shows test related to main features of the JacketNMT
- `test:asset` : shows test related to main features of the JacketMutableAsset
- `test:success` : shows tests were users interact successfully with the JacketMutableAsset
- `test:failure` : shows tests were users interact unsuccessfully with the JacketMutableAsset

### Utility

Useful to generate UML graphs or obtain architectural information
- ``surya`` - https://github.com/Consensys/surya
- ``sol2uml`` - https://github.com/naddison36/sol2uml

es:
```
$ surya describe contracts/base/NMT.sol

# or

$ sol2uml class contracts
```