## Methods
| **Symbol** | **Meaning**                                                                              |
| :--------: | :--------------------------------------------------------------------------------------- |
|    **◯**   | Execution gas for this method does not include intrinsic gas overhead                    |
|    **△**   | Cost was non-zero but below the precision setting for the currency display (see options) |

|                            |     Min |     Max |     Avg | Calls | eur avg |
| :------------------------- | ------: | ------: | ------: | ----: | ------: |
| **JacketNMT**              |         |         |         |       |         |
|        *mint*              | 983,697 | 991,809 | 985,846 |    37 |  0.0139 |
|        *safeTransferFrom*  |  98,371 | 101,183 |  99,907 |    11 |  0.0014 |
|        *transferFrom*      |  95,546 |  98,358 |  97,082 |    11 |  0.0014 |
| **NonFungibleToken**       |         |         |         |       |         |
|        *mintCollectionNFT* |       - |       - |  70,811 |     1 |  0.0010 |
|        *transferFrom*      |       - |       - |  54,563 |     1 |  0.0008 |

## Deployments
|                                         | Min | Max  |       Avg | Block % | eur avg |
| :-------------------------------------- | --: | ---: | --------: | ------: | ------: |
| **CreatorSmartPolicy**                  |   - |    - |   518,664 |   1.7 % |  0.0073 |
| **CreatorSmartPolicyNoTransferAllowed** |   - |    - |   406,522 |   1.4 % |  0.0058 |
| **DenyAllSmartPolicy**                  |   - |    - |   235,320 |   0.8 % |  0.0033 |
| **JacketMutableAsset**                  |   - |    - |   917,501 |   3.1 % |  0.0130 |
| **JacketNMT**                           |   - |    - | 2,471,421 |   8.2 % |  0.0350 |
| **NonFungibleToken**                    |   - |    - |   959,230 |   3.2 % |  0.0136 |
| **PrincipalSmartPolicy**                |   - |    - |   285,213 |     1 % |  0.0040 |

## Solidity and Network Config
| **Settings**        | **Value**      |
| ------------------- | -------------- |
| Solidity: version   | 0.8.20         |
| Solidity: optimized | true           |
| Solidity: runs      | 200            |
| Solidity: viaIR     | true           |
| Block Limit         | 30,000,000     |
| L1 Gas Price        | 30.1 gwei      |
| Token Price         | 0.47 eur/matic |
| Network             | POLYGON        |
| Toolchain           | hardhat        |

