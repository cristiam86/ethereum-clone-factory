// contract/TokenV1.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract TokenV2 is Initializable, ERC20Upgradeable {
  uint256 public store;

  function version() public pure returns (string memory) {
      return "V2";
  }

  function setStore(uint256 newValue) public {
    store = newValue;
  }
}