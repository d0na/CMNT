## Methods
| **Symbol** | **Meaning**                                                                              |
| :--------: | :--------------------------------------------------------------------------------------- |
|    **◯**   | Execution gas for this method does not include intrinsic gas overhead                    |
|    **△**   | Cost was non-zero but below the precision setting for the currency display (see options) |

|                                  |       Min |       Max |       Avg | Calls | eur avg |
| :------------------------------- | --------: | --------: | --------: | ----: | ------: |
| **EventTicketMutableAsset**      |           |           |           |       |         |
|        *setBackstageAccess*      |         - |         - |    92,253 |     1 |  0.0013 |
|        *setHolderSmartPolicy*    |         - |         - |    29,849 |     1 |  0.0004 |
|        *setSeat*                 |         - |         - |    97,672 |     3 |  0.0014 |
|        *setValidationDate*       |         - |         - |   103,067 |     1 |  0.0015 |
|        *setVirtualSwagBag*       |         - |         - |    85,704 |     1 |  0.0012 |
|        *setVirtualSwagBagAccess* |         - |         - |    94,849 |     2 |  0.0013 |
| **EventTicketNMT**               |           |           |           |       |         |
|        *mint*                    | 1,228,154 | 1,228,166 | 1,228,162 |    34 |  0.0174 |
|        *transferFrom*            |         - |         - |    95,650 |     1 |  0.0014 |

## Deployments
|                        |     Min |    Max  |       Avg | Block % | eur avg |
| :--------------------- | ------: | ------: | --------: | ------: | ------: |
| **AMEventOrganizer**   |       - |       - |    91,003 |   0.3 % |  0.0013 |
| **CSPEventTicket**     | 716,181 | 716,205 |   716,203 |   2.4 % |  0.0101 |
| **DenyAllSmartPolicy** |       - |       - |   235,320 |   0.8 % |  0.0033 |
| **EventTicketNMT**     |       - |       - | 2,732,527 |   9.1 % |  0.0387 |
| **HSPEventTicket**     |       - |       - |   329,110 |   1.1 % |  0.0047 |
| **PSPEventTicket**     |       - |       - |   341,736 |   1.1 % |  0.0048 |

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

