const CollectionMarketplace = artifacts.require("CollectionMarketplace")
const { catchRevert } = require("./utils/exceptions")

// Mocha - testing framework
// Chai - assertion JS library

const getBalance = async address => web3.eth.getBalance(address)
const toBN = value => web3.utils.toBN(value)

const getGas = async result => {
  const tx = await web3.eth.getTransaction(result.tx)
  const gasUsed = toBN(result.receipt.gasUsed)
  const gasPrice = toBN(tx.gasPrice)
  const gas = gasUsed.mul(gasPrice)
  return gas
}

contract("CollectionMarketplace", accounts => {

  const CollectionId = "0x00000000000000000000000000003130"
  const proof = "0x0000000000000000000000000000313000000000000000000000000000003130"

  const CollectionId2 = "0x00000000000000000000000000002130"
  const proof2 = "0x0000000000000000000000000000213000000000000000000000000000002130"

  const value = "900000000"

  let _contract = null
  let contractOwner = null
  let buyer = null
  let CollectionHash = null

  before(async () => {
    _contract = await CollectionMarketplace.deployed()
    contractOwner = accounts[0]
    buyer = accounts[1]
  })

  describe("Purchase the new Collection", () => {

    before(async() => {
      await _contract.purchaseCollection(CollectionId, proof, {
        from: buyer,
        value
      })
    })

    it("should NOT allow to repurchase already owned Collection", async () => {
      await catchRevert(_contract.purchaseCollection(CollectionId, proof, {
        from: buyer,
        value
      }))
    })

    it("can get the purchased Collection hash by index", async () => {
      const index = 0
      CollectionHash = await _contract.getCollectionHashAtIndex(index)
      const expectedHash = web3.utils.soliditySha3(
        { type: "bytes16", value: CollectionId },
        { type: "address", value: buyer },
      )

      assert.equal(CollectionHash, expectedHash, "Collection hash is not matching the hash of purchased Collection!")
    })

    it("should match the data of the Collection purchased by buyer", async () => {
      const exptectedIndex = 0
      const exptectedState = 0
      const Collection = await _contract.getCollectionByHash(CollectionHash)

      assert.equal(Collection.id, exptectedIndex, "Collection index should be 0!")
      assert.equal(Collection.price, value, `Collection price should be ${value}!`)
      assert.equal(Collection.proof, proof, `Collection proof should be ${proof}!`)
      assert.equal(Collection.owner, buyer, `Collection buyer should be ${buyer}!`)
      assert.equal(Collection.state, exptectedState, `Collection state should be ${exptectedState}!`)
    })
  })

  describe("Activate the purchased Collection", () => {

    it("should NOT be able to activate Collection by NOT contract owner", async () => {
      await catchRevert(_contract.activateCollection(CollectionHash, {from: buyer}))
    })

    it("should have 'activated' state", async () => {
      await _contract.activateCollection(CollectionHash, {from: contractOwner})
      const Collection = await _contract.getCollectionByHash(CollectionHash)
      const exptectedState = 1

      assert.equal(Collection.state, exptectedState, "Collection should have 'activated' state")
    })
  })


  describe("Transfer ownership", () => {
    let currentOwner = null

    before(async() => {
      currentOwner = await _contract.getContractOwner()
    })

    it("getContractOwner should return deployer address", async () => {
      assert.equal(
        contractOwner,
        currentOwner,
        "Contract owner is not matching the one from getContractOwner function"
      )
    })

    it("should NOT transfer ownership when contract owner is not sending TX", async () => {
      await catchRevert(_contract.transferOwnership(accounts[3], {from: accounts[4]}))
    })

    it("should transfer owership to 3rd address from 'accounts'", async () => {
      await _contract.transferOwnership(accounts[2], {from: currentOwner})
      const owner = await _contract.getContractOwner()
      assert.equal(owner, accounts[2], "Contract owner is not the second account")
    })

    it("should transfer owership back to initial contract owner'", async () => {
      await _contract.transferOwnership(contractOwner, {from: accounts[2]})
      const owner = await _contract.getContractOwner()
      assert.equal(owner, contractOwner, "Contract owner is not set!")
    })
  })

  describe("Deactivate Collection", () => {
    let CollectionHash2 = null
    let currentOwner = null

    before(async () => {
      await _contract.purchaseCollection(CollectionId2, proof2, {from: buyer, value})
      CollectionHash2 = await _contract.getCollectionHashAtIndex(1)
      currentOwner = await _contract.getContractOwner()
    })

    it("should NOT be able to deactivate the Collection by NOT contract owner", async () => {
      await catchRevert(_contract.deactivateCollection(CollectionHash2, {from: buyer}))
    })


    it("should have status of deactivated and price 0", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer)
      const beforeTxContractBalance = await getBalance(_contract.address)
      const beforeTxOwnerBalance = await getBalance(currentOwner)

      const result = await _contract.deactivateCollection(CollectionHash2, {from: contractOwner})

      const afterTxBuyerBalance = await getBalance(buyer)
      const afterTxContractBalance = await getBalance(_contract.address)
      const afterTxOwnerBalance = await getBalance(currentOwner)

      const Collection = await _contract.getCollectionByHash(CollectionHash2)
      const exptectedState = 2
      const exptectedPrice = 0
      const gas = await getGas(result)

      assert.equal(Collection.state, exptectedState, "Collection is NOT deactivated!")
      assert.equal(Collection.price, exptectedPrice, "Collection price is not 0!")

      assert.equal(
        toBN(beforeTxOwnerBalance).sub(gas).toString(),
        afterTxOwnerBalance,
        "Contract owner ballance is not correct"
      )

      assert.equal(
        toBN(beforeTxBuyerBalance).add(toBN(value)).toString(),
        afterTxBuyerBalance,
        "Buyer ballance is not correct"
      )

      assert.equal(
        toBN(beforeTxContractBalance).sub(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract ballance is not correct"
      )
    })


    it("should NOT be able activate deactivated Collection", async () => {
      await catchRevert(_contract.activateCollection(CollectionHash2, {from: contractOwner}))
    })
  })

  describe("Repurchase Collection", () => {
    let CollectionHash2 = null

    before(async () => {
      CollectionHash2 = await _contract.getCollectionHashAtIndex(1)
    })

    it("should NOT repurchase when the Collection doesn't exist", async () => {
      const notExistingHash = "0x5ceb3f8075c3dbb5d490c8d1e6c950302ed065e1a9031750ad2c6513069e3fc3"
      await catchRevert(_contract.repurchaseCollection(notExistingHash, {from: buyer}))
    })

    it("should NOT repurchase with NOT Collection owner", async () => {
      const notOwnerAddress = accounts[2]
      await catchRevert(_contract.repurchaseCollection(CollectionHash2, {from: notOwnerAddress}))
    })

    it("should be able repurchase with the original buyer", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer)
      const beforeTxContractBalance = await getBalance(_contract.address)

      const result = await _contract.repurchaseCollection(CollectionHash2, {from: buyer, value})

      const afterTxBuyerBalance = await getBalance(buyer)
      const afterTxContractBalance = await getBalance(_contract.address)

      const Collection = await _contract.getCollectionByHash(CollectionHash2)
      const exptectedState = 0
      const gas = await getGas(result)

      assert.equal(Collection.state, exptectedState, "The Collection is not in purchased state")
      assert.equal(Collection.price, value, `The Collection price is not equal to ${value}`)

      assert.equal(
        toBN(beforeTxBuyerBalance).sub(toBN(value)).sub(gas).toString(),
        afterTxBuyerBalance,
        "Client balance is not correct!"
      )

      assert.equal(
        toBN(beforeTxContractBalance).add(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract balance is not correct!"
      )
    })

    it("should NOT be able to repurchase purchased Collection", async () => {
      await catchRevert(_contract.repurchaseCollection(CollectionHash2, {from: buyer}))
    })
  })

  describe("Receive funds", () => {
    it("should have transacted funds", async () => {
      const value = "100000000000000000"
      const contractBeforeTx = await getBalance(_contract.address)

      await web3.eth.sendTransaction({
        from: buyer,
        to: _contract.address,
        value
      })

      const contractAfterTx = await getBalance(_contract.address)

      assert.equal(
        toBN(contractBeforeTx).add(toBN(value)).toString(),
        contractAfterTx,
        "Value after transaction is not matching!"
      )
    })
  })

  describe("Normal withdraw", () => {
    const fundsToDeposit = "100000000000000000"
    const overLimitFunds = "999999000000000000000"
    let currentOwner = null

    before(async () => {
      currentOwner = await _contract.getContractOwner()

      await web3.eth.sendTransaction({
        from: buyer,
        to: _contract.address,
        value: fundsToDeposit
      })
    })

    it("should fail when withdrawing with NOT owner address", async () => {
      const value = "10000000000000000"
      await catchRevert(_contract.withdraw(value, {from: buyer}))
    })

    it("should fail when withdrawing OVER limit balance", async () => {
      await catchRevert(_contract.withdraw(overLimitFunds, {from: currentOwner}))
    })

    it("should have +0.1ETH after withdraw", async () => {
      const ownerBalance = await getBalance(currentOwner)
      const result = await _contract.withdraw(fundsToDeposit, {from: currentOwner})
      const newOwnerBalance = await getBalance(currentOwner)
      const gas = await getGas(result)

      assert.equal(
        toBN(ownerBalance).add(toBN(fundsToDeposit)).sub(gas).toString(),
        newOwnerBalance,
        "The new owner balance is not correct!"
      )
    })
  })

  describe("Emergency withdraw", () => {
    let currentOwner

    before(async () => {
      currentOwner = await _contract.getContractOwner()
    })

    after(async () => {
      await _contract.resumeContract({from: currentOwner})
    })

    it("should fail when contract is NOT stopped", async () => {
      await catchRevert(_contract.emergencyWithdraw({from: currentOwner}))
    })

    it("should have +contract funds on contract owner", async () => {
      await _contract.stopContract({from: contractOwner})

      const contractBalance = await getBalance(_contract.address)
      const ownerBalance = await getBalance(currentOwner)

      const result = await _contract.emergencyWithdraw({from: currentOwner})
      const gas = await getGas(result)

      const newOwnerBalance = await getBalance(currentOwner)

      assert.equal(
        toBN(ownerBalance).add(toBN(contractBalance)).sub(gas),
        newOwnerBalance,
        "Owner doesn't have contract balance"
      )
    })

    it("should have contract balance of 0", async () => {
      const contractBalance = await getBalance(_contract.address)

      assert.equal(
        contractBalance,
        0,
        "Contract does't have 0 balance"
      )
    })
  })

  describe("Self Destruct", () => {
    let currentOwner

    before(async () => {
      currentOwner = await _contract.getContractOwner()
    })

    it("should fail when contract is NOT stopped", async () => {
      await catchRevert(_contract.selfDestruct({from: currentOwner}))
    })

    it("should have +contract funds on contract owner", async () => {
      await _contract.stopContract({from: contractOwner})

      const contractBalance = await getBalance(_contract.address)
      const ownerBalance = await getBalance(currentOwner)

      const result = await _contract.selfDestruct({from: currentOwner})
      const gas = await getGas(result)

      const newOwnerBalance = await getBalance(currentOwner)

      assert.equal(
        toBN(ownerBalance).add(toBN(contractBalance)).sub(gas),
        newOwnerBalance,
        "Owner doesn't have contract balance"
      )
    })

    it("should have contract balance of 0", async () => {
      const contractBalance = await getBalance(_contract.address)

      assert.equal(
        contractBalance,
        0,
        "Contract does't have 0 balance"
      )
    })

    it("should have 0x bytecode", async () => {
      const code = await web3.eth.getCode(_contract.address)

      assert.equal(
        code,
        "0x",
        "Contract is not destroyed"
      )
    })
  })


})