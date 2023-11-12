// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../../base/MutableAsset.sol";
import "../../JacketNMT.sol";
import "../../base/SmartPolicy.sol";

/**
 * @title Smart Asset which represents a Jacket
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice This Smart Contract contains all the Jacket properties and features which allows
 * it to mutate
 */
contract MutableAsset10a is MutableAsset {
    /** */
    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    //Jacket descriptor
    struct JacketDescriptor {
        uint256 method1;
        uint256 method2;
        uint256 method3;
        uint256 method4;
        uint256 method5;
        uint256 method6;
        uint256 method7;
        uint256 method8;
        uint256 method9;
        uint256 method10;
    }

    // Current state representing jacket descriptor with its attributes
    JacketDescriptor public jacketDescriptor;

    /** Retrieves all the attributes of the descriptor Jacket
     *
     * TODO forse visto che jacketDescriptor è public nn doverebbe servire
     */
    function getJacketDescriptor()
        public
        view
        returns (JacketDescriptor memory)
    {
        return (jacketDescriptor);
    }

    event StateChanged(JacketDescriptor jacketDescriptor);

    /**
     * USERS ACTIONS with attached policy
     * */

    fallback() external {}

    
    function setMethod(
        uint256 _param1,
        uint256 _param2,
        uint256 _param3,
        uint256 _param4,
        uint256 _param5,
        uint256 _param6,
        uint256 _param7,
        uint256 _param8,
        uint256 _param9,
        uint256 _param10,
        string memory _tokenURI
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,string)",
                _param1,
                _param2,
                _param3,
                _param4,
                _param5,
                _param6,
                _param7,
                _param8,
                _param9,
                _param10,
                _tokenURI
            ),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,string)",
                _param1,
                _param2,
                _param3,
                _param4,
                _param5,
                _param6,
                _param7,
                _param8,
                _param9,
                _param10,
                _tokenURI
            ),
            address(this)
        )
    {
        _setMethod(
            _param1,
            _param2,
            _param3,
            _param4,
            _param5,
            _param6,
            _param7,
            _param8,
            _param9,
            _param10,
            _tokenURI
        );
    }

    function _setMethod(
        uint256 _param1,
        uint256 _param2,
        uint256 _param3,
        uint256 _param4,
        uint256 _param5,
        uint256 _param6,
        uint256 _param7,
        uint256 _param8,
        uint256 _param9,
        uint256 _param10,
        string memory _tokenURI
    ) public {
        jacketDescriptor.method1 = _param1;
        jacketDescriptor.method2 = _param2;
        jacketDescriptor.method3 = _param3;
        jacketDescriptor.method4 = _param4;
        jacketDescriptor.method5 = _param5;
        jacketDescriptor.method6 = _param6;
        jacketDescriptor.method7 = _param7;
        jacketDescriptor.method8 = _param8;
        jacketDescriptor.method9 = _param9;
        jacketDescriptor.method10 = _param10;
        setTokenURI(_tokenURI);
        emit StateChanged(jacketDescriptor);
    }
}
