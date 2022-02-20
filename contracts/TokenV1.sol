// contract/TokenV1.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract TokenV1 is Initializable, ERC20Upgradeable {
  uint256 public store;

  function initialize(string calldata name, string calldata symbol) initializer public {
    __ERC20_init(name, symbol);
    _mint(msg.sender, 1000 * 10 ** decimals());
    store = 0;
  }

  function version() public pure returns (string memory) {
      return "V1";
  }

  function setStore(uint256 newValue) public {
    store = newValue;
  }
}