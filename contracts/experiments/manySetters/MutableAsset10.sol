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
contract MutableAsset10 is MutableAsset {
    /** */
    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt,_creatorSmartPolicy,_holderSmartPolicy) {}

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

    function setMethod1(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod1(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod1(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method1 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod2(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod2(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod2(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method2 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod3(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod3(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod3(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method3 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod4(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod4(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod4(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method4 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod5(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod5(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod5(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method5 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod6(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod6(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod6(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method6 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod7(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod7(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod7(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method7 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod8(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod8(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod8(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method8 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod9(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod9(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod9(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method9 = _param;

        emit StateChanged(jacketDescriptor);
    }

    function setMethod10(
        uint256 _param
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod10(uint256)",
                _param),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature(
                "setMethod10(uint256)",
                _param),
            address(this)
        )
    {
        jacketDescriptor.method10 = _param;

        emit StateChanged(jacketDescriptor);
    }
}
