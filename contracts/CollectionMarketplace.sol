// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CollectionMarketplace {

  enum State {
    Purchased,
    Activated,
    Deactivated
  }

  struct Collection {
    uint id; // 32
    uint price; // 32
    bytes32 proof; // 32
    address owner; // 20
    State state; // 1
  }

  bool public isStopped = false;

  // mapping of collectionHash to Collection data
  mapping(bytes32 => Collection) private ownedCollections;

  // mapping of collectionID to collectionHash
  mapping(uint => bytes32) private ownedCollectionHash;

  // number of all collections + id of the collection
  uint private totalOwnedCollections;

  address payable private owner;

  constructor() {
    setContractOwner(msg.sender);
  }

  /// Collection has invalid state!
  error InvalidState();

  /// Collection is not created!
  error CollectionIsNotCreated();

  /// Collection has already a Owner!
  error CollectionHasOwner();

  /// Sender is not collection owner!
  error SenderIsNotCollectionOwner();


  /// Only owner has an access!
  error OnlyOwner();

  modifier onlyOwner() {
    if (msg.sender != getContractOwner()) {
      revert OnlyOwner();
    }
    _;
  }

  modifier onlyWhenNotStopped {
    require(!isStopped);
    _;
  }

  modifier onlyWhenStopped {
    require(isStopped);
    _;
  }

  receive() external payable {}

  function withdraw(uint amount)
    external
    onlyOwner
  {
    (bool success, ) = owner.call{value: amount}("");
    require(success, "Transfer failed.");
  }

  function emergencyWithdraw()
    external
    onlyWhenStopped
    onlyOwner
  {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Transfer failed.");
  }

  function selfDestruct()
    external
    onlyWhenStopped
    onlyOwner
  {
    selfdestruct(owner);
  }

  function stopContract()
    external
    onlyOwner
  {
    isStopped = true;
  }

  function resumeContract()
    external
    onlyOwner
  {
    isStopped = false;
  }

  function purchaseCollection(
    bytes32 collectionId, // 0x0000000000000000000000000000313000000000000000000000000000000030
    bytes32 proof // 0x0000000000000000000000000000313000000000000000000000000000003130
  )
    external
    payable
    onlyWhenNotStopped
  {
    bytes32 collectionHash = keccak256(abi.encodePacked(collectionId, msg.sender));

    if (hasCollectionOwnership(collectionHash)) {
      revert CollectionHasOwner();
    }

    uint id = totalOwnedCollections++;

    ownedCollectionHash[id] = collectionHash;
    ownedCollections[collectionHash] = Collection({
      id: id,
      price: msg.value,
      proof: proof,
      owner: msg.sender,
      state: State.Purchased
    });
  }

  function repurchaseCollection(bytes32 collectionHash)
    external
    payable
    onlyWhenNotStopped
  {
    if (!isCollectionCreated(collectionHash)) {
      revert CollectionIsNotCreated();
    }

    if (!hasCollectionOwnership(collectionHash)) {
      revert SenderIsNotCollectionOwner();
    }

    Collection storage collection = ownedCollections[collectionHash];

    if (collection.state != State.Deactivated) {
      revert InvalidState();
    }

    collection.state = State.Purchased;
    collection.price = msg.value;
  }

  
  function activateCollection(bytes32 collectionHash)
    external
    onlyWhenNotStopped
    onlyOwner
  {
    if (!isCollectionCreated(collectionHash)) {
      revert CollectionIsNotCreated();
    }

    Collection storage collection = ownedCollections[collectionHash];

    if (collection.state != State.Purchased) {
      revert InvalidState();
    }

    collection.state = State.Activated;
  }

  function deactivateCollection(bytes32 collectionHash)
    external
    onlyWhenNotStopped
    onlyOwner
  {
    if (!isCollectionCreated(collectionHash)) {
      revert CollectionIsNotCreated();
    }

    Collection storage collection = ownedCollections[collectionHash];

    if (collection.state != State.Purchased) {
      revert InvalidState();
    }

    (bool success, ) = collection.owner.call{value: collection.price}("");
    require(success, "Transfer failed!");

    collection.state = State.Deactivated;
    collection.price = 0;
  }

  function transferOwnership(address newOwner)
    external
    onlyOwner
  {
    setContractOwner(newOwner);
  }

  function getCollectionCount()
    external
    view
    returns (uint)
  {
    return totalOwnedCollections;
  }

  function getCollectionHashAtIndex(uint index)
    external
    view
    returns (bytes32)
  {
    return ownedCollectionHash[index];
  }

  function getCollectionByHash(bytes32 collectionHash)
    external
    view
    returns (Collection memory)
  {
    return ownedCollections[collectionHash];
  }

  function getContractOwner()
    public
    view
    returns (address)
  {
    return owner;
  }

  function setContractOwner(address newOwner) private {
    owner = payable(newOwner);
  }

  function isCollectionCreated(bytes32 collectionHash)
    private
    view
    returns (bool)
  {
    return ownedCollections[collectionHash].owner != 0x0000000000000000000000000000000000000000;
  }

  function hasCollectionOwnership(bytes32 collectionHash)
    private
    view
    returns (bool)
  {
    return ownedCollections[collectionHash].owner == msg.sender;
  }
}