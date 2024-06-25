export const keroseneDnftClaimAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "dnft",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "kerosene",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "price_",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "root_",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "DNFT",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IERC721Enumerable"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "KEROSENE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract ERC20"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "buyNote",
        "inputs": [
            {
                "name": "proof",
                "type": "bytes32[]",
                "internalType": "bytes32[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "merkleRoot",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "onERC721Received",
        "inputs": [
            {
                "name": "_operator",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_tokenId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "price",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "purchased",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setMerkleRoot",
        "inputs": [
            {
                "name": "root",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setPrice",
        "inputs": [
            {
                "name": "price_",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "sweepERC20",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
            {
                "name": "newOwner",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "newOwner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "AlreadyPurchased",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidProof",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotNote",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SoldOut",
        "inputs": []
    }
]