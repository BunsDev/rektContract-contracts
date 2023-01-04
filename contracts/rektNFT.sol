// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./erc721a/ERC721A.sol";

contract rektNFT is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;

    bytes32 public merkleRoot = "";
    mapping(address => bool) public whitelistClaimed;

    string public baseURI;
    uint256 public maxSupply = 2023;
    uint256 public currentSupply = 0;
    uint8 public maxMintAmount = 1;
    bool public publicSaleActive = false;
    bool public whitelistSaleActive = false;

    address public withdrawAddress;
    //mapping(uint256 => string) public tokenIdToURI;

    address[] public admins;
    mapping(address => bool) public ownerByAddress;

    //@title This is ERC721A contract for Rekt
    // @author The name of the author is @dsborde
    // @notice Constructor sets the base parameters for constructors
    // @dev Since its ERC721A we need to use _msgSender()
    constructor(string memory _name, string memory _symbol)
        ERC721A(_name, _symbol)
    {
        admins.push(msg.sender);
        ownerByAddress[msg.sender] = true;
    }

    modifier onlyAdmins() {
        require(
            ownerByAddress[msg.sender] == true,
            "only admins can call this fucntion "
        );
        _;
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function getNFTWhiteList(bytes32[] memory _merkleProof)
        external
        callerIsUser
    {
        require(whitelistSaleActive || publicSaleActive, "Not ready for sale");
        require(currentSupply + 1 <= maxSupply, "Supply Limit Reached");
        require(
            balanceOf(msg.sender) < maxMintAmount,
            "Max NFT mint Limit reached"
        );

        require(
            !whitelistClaimed[msg.sender],
            "whiteList slot has already been claimed."
        );

        bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Invalid proof!"
        );
        whitelistClaimed[msg.sender] = true;
        _safeMint(msg.sender, 1);

        currentSupply++;
    }

    function mintPublicSale() external callerIsUser {
        require(whitelistSaleActive || publicSaleActive, "Not ready for sale");
        require(currentSupply + 1 <= maxSupply, "Supply Limit Reached");
        require(
            balanceOf(msg.sender) < maxMintAmount,
            "Max NFT mint Limit reached"
        );

        _safeMint(msg.sender, 1);
        currentSupply++;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Non Existent Token");
        string memory currentBaseURI = _baseURI();

        return (
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        ".json"
                    )
                )
                : ""
        );
    }

    function setBaseURI(string memory _newBaseURI) public onlyAdmins {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function withdrawAll() external onlyOwner nonReentrant {
        (bool success, ) = payable(withdrawAddress).call{
            value: (address(this).balance)
        }("");
        require(success, "Failed to Send Ether");
    }

    // function setURIforTokenId(uint64 _tokenId, string memory _tokenURI)
    //     external
    //     onlyAdmins
    // {
    //     require(
    //         bytes(tokenIdToURI[_tokenId]).length > 0,
    //         "Token URI already set for tokenId"
    //     );
    //     tokenIdToURI[_tokenId] = _tokenURI;
    // }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function setWhitelistSale(bool _state) external onlyAdmins {
        require(
            publicSaleActive == false,
            "publicSale is active, please check "
        );
        whitelistSaleActive = _state;
    }

    function setpublicSale(bool _state) external onlyAdmins {
        require(
            whitelistSaleActive == false,
            "WhitelistSale is active, please check "
        );
        publicSaleActive = _state;
    }

    function SetPayoutAddress(address _payoutAddress) external onlyOwner {
        withdrawAddress = _payoutAddress;
    }

    function SetMaxMintAmount(uint8 _maxMintAmount) external onlyAdmins {
        maxMintAmount = _maxMintAmount;
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyAdmins {
        merkleRoot = _merkleRoot;
    }

    function updateOwner(address _newAddress) public onlyOwner {
        transferOwnership(_newAddress);
    }

    function addAdminAddress(address _adminAddress) public onlyAdmins {
        admins.push(_adminAddress);
        ownerByAddress[_adminAddress] = true;
    }

    function getAdmins() public view returns (address[] memory) {
        return admins;
    }
}
