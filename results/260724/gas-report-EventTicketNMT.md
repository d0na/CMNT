## Methods
| **Symbol** | **Meaning**                                                                              |
| :--------: | :--------------------------------------------------------------------------------------- |
|    **◯**   | Execution gas for this method does not include intrinsic gas overhead                    |
|    **△**   | Cost was non-zero but below the precision setting for the currency display (see options) |

|                              |       Min |       Max |       Avg | Calls | eur avg |
| :--------------------------- | --------: | --------: | --------: | ----: | ------: |
| **EventTicketNMT**           |           |           |           |       |         |
|        *mint*                | 1,225,654 | 1,233,754 | 1,229,136 |    22 |  0.0174 |
|        *payableTransferFrom* |         - |         - |   100,963 |     2 |  0.0014 |

## Deployments
|                             | Min | Max  |       Avg | Block % | eur avg |
| :-------------------------- | --: | ---: | --------: | ------: | ------: |
| **AMEventOrganizer**        |   - |    - |    91,003 |   0.3 % |  0.0013 |
| **CSPEventTicket**          |   - |    - |   716,205 |   2.4 % |  0.0101 |
| **DenyAllSmartPolicy**      |   - |    - |   235,320 |   0.8 % |  0.0033 |
| **EventTicketMutableAsset** |   - |    - | 1,175,338 |   3.9 % |  0.0166 |
| **EventTicketNMT**          |   - |    - | 2,732,527 |   9.1 % |  0.0387 |
| **PSPEventTicket**          |   - |    - |   341,736 |   1.1 % |  0.0048 |

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

