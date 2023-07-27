# Contracts

## Useful commands 

### Testing
Testing contracts with the local node provided by hardhat (configured in the as localhost network ). Using the local node gives the possibility to store the blockchain state (stateful).

```
npx hardhat node
npx hardhat test --grep Jack --network localhost
```

If it doesn't need to test contracts in a stateful way you can just use the hardhat network

```
npx hardhat test --grep Jack
```

