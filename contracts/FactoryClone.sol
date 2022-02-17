pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./TokenV1.sol";
import "hardhat/console.sol";

contract FactoryClone {
    address immutable tokenImplementation;

    event TokenCreated (
      address indexed cloneAddress
    );

    constructor(address implementationAddress) {
        tokenImplementation = implementationAddress;
    }

    function createToken(string calldata name, string calldata symbol) external returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(name, symbol));
        address clone = Clones.cloneDeterministic(tokenImplementation, salt);
        
        console.log('FactoryClone.sol ~ line 20 ~ createToken ~ clone', clone);

        TokenV1(clone).initialize(name, symbol);
        emit TokenCreated(clone);
        return clone;
    }
}