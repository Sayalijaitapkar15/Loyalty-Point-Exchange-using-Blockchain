// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoyaltyPointExchange {
    address public owner;

    enum Role { None, User, Merchant }

    struct MerchantRequest {
        address merchantAddress;
        bool approved;
    }

    struct Item {
        uint id;
        string name;
        uint priceInEther;
        uint priceInPoints;
        address merchant;
        bool exists;
    }

    mapping(address => string) public userNames;
    mapping(address => Role) public roles;
    mapping(address => string) public merchantNames;
    mapping(address => uint) public loyaltyPoints;
    mapping(address => uint) public etherBalance;
    mapping(address => MerchantRequest) public merchantRequests;
    mapping(uint => Item) public items;

    uint public nextItemId;
    uint public platformFeePercent = 2;

    event MerchantRequested(address indexed merchant);
    event MerchantApproved(address indexed merchant, string name);
    event UserRegistered(address indexed user);
    event ItemAdded(uint indexed itemId, string name, address indexed merchant);
    event ItemPurchased(uint indexed itemId, address indexed buyer, address indexed merchant, string method);
    event PointsRedeemed(address indexed merchant, uint amount);
    event PlatformFeeUpdated(uint newFeePercent);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyMerchant() {
        require(roles[msg.sender] == Role.Merchant, "Only merchant allowed");
        _;
    }

    modifier onlyUser() {
        require(roles[msg.sender] == Role.User, "Only user allowed");
        _;
    }

    constructor() {
        owner = msg.sender;
        roles[msg.sender] = Role.Merchant;
        merchantNames[msg.sender] = "Admin";
    }

    function registerUser(string memory _name) external {
    require(roles[msg.sender] == Role.None, "Already registered");
    roles[msg.sender] = Role.User;
    userNames[msg.sender] = _name;
    emit UserRegistered(msg.sender);
}


    function requestMerchantAccess() external {
        require(roles[msg.sender] == Role.None, "Already registered");
        merchantRequests[msg.sender] = MerchantRequest(msg.sender, false);
        emit MerchantRequested(msg.sender);
    }

    function approveMerchant(address merchant, string memory name) external onlyOwner {
        require(!merchantRequests[merchant].approved, "Already approved");
        merchantRequests[merchant].approved = true;
        roles[merchant] = Role.Merchant;
        merchantNames[merchant] = name;
        emit MerchantApproved(merchant, name);
    }

    function addItem(string memory name, uint priceInEther, uint priceInPoints) external onlyMerchant {
        items[nextItemId] = Item(nextItemId, name, priceInEther, priceInPoints, msg.sender, true);
        emit ItemAdded(nextItemId, name, msg.sender);
        nextItemId++;
    }

    function purchaseItemWithEther(uint itemId) external payable onlyUser {
        Item memory item = items[itemId];
        require(item.exists, "Item not found");
        require(msg.value == item.priceInEther, "Incorrect Ether value");

        uint fee = (msg.value * platformFeePercent) / 100;
        uint amountToMerchant = msg.value - fee;

        payable(item.merchant).transfer(amountToMerchant);
        etherBalance[owner] += fee;

        emit ItemPurchased(itemId, msg.sender, item.merchant, "Ether");
    }

    function purchaseItemWithPoints(uint itemId) external onlyUser {
        Item memory item = items[itemId];
        require(item.exists, "Item not found");
        require(loyaltyPoints[msg.sender] >= item.priceInPoints, "Insufficient points");

        loyaltyPoints[msg.sender] -= item.priceInPoints;
        loyaltyPoints[item.merchant] += item.priceInPoints;

        emit ItemPurchased(itemId, msg.sender, item.merchant, "Points");
    }

    function redeemPointsForEther(uint amount) external onlyMerchant {
        require(loyaltyPoints[msg.sender] >= amount, "Insufficient points");

        uint etherAmount = amount * 1e15;
        require(address(this).balance >= etherAmount, "Contract lacks Ether");

        loyaltyPoints[msg.sender] -= amount;
        payable(msg.sender).transfer(etherAmount);

        emit PointsRedeemed(msg.sender, amount);
    }

    function updatePlatformFee(uint newFeePercent) external onlyOwner {
        require(newFeePercent <= 10, "Fee too high");
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
    }

    function getMyRole() external view returns (Role) {
        return roles[msg.sender];
    }

    function getMerchantName(address merchant) external view returns (string memory) {
        return merchantNames[merchant];
    }

    receive() external payable {}
} 
