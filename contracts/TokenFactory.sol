pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TokenV1.sol";

contract TokenFactory is Ownable {
    UpgradeableBeacon immutable beacon;
    address public implementation;

    event TokenCreated (
      address indexed cloneAddress
    );

    constructor(address implementationAddress) {
        beacon = new UpgradeableBeacon(implementationAddress);
        transferOwnership(msg.sender);
    }

    function upgradeImplementation(address newImplementation) public onlyOwner {
        beacon.upgradeTo(newImplementation);
    }

    function createToken(string calldata name, string calldata symbol) external returns (address) {
        BeaconProxy token = new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(TokenV1(address(0)).initialize.selector, name, symbol)
        );
        
        emit TokenCreated(address(token));
        address(token);
    }
}