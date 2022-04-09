pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";


contract GOV {
    using SafeMath for uint;
    address[] public DAOMembers; // 管理成员
    mapping(address => bool) public isDAOMember; // 是否是dao成员
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations; // 确认数
    }
    uint public numConfirmationsRequired;  // 可以通过提案所需的确认数
    // mapping from tx index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed; // 记录每个提案的每个owner是否已确认

    Transaction[] public transactions;

    modifier onlyDAOMember() {
            require(isDAOMember[msg.sender], "not owner");
            _;
    }
    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address[] memory _DAOMembers, uint _numConfirmationsRequired) {
        require(_DAOMembers.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _DAOMembers.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _DAOMembers.length; i++) {
            address DAOMember = _DAOMembers[i];

            require(DAOMember != address(0), "invalid owner");
            require(!isDAOMember[DAOMember], "owner not unique");

            isDAOMember[DAOMember] = true;
            DAOMembers.push(DAOMember);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
        // console.log(numConfirmationsRequired);
        // console.log("DAOMembers0: %s", DAOMembers[0]);
    }

    receive() external payable{
        // recive asset eth
    }
    function submitTransaction(
        address _to,
        uint _value,
        bytes memory _data
    ) public onlyDAOMember {
        uint txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );
    }

    function confirmTransaction(uint _txIndex)
        public
        onlyDAOMember
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

    }

    function executeTransaction(uint _txIndex)
        public
        onlyDAOMember
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;
        // console.log("target address balance=>%s",transaction.to.balance);
        
        (bool success, bytes memory returnData) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        // console.log("transaction.to=%s, value=%s",transaction.to, transaction.value);
        // console.logBytes(transaction.data);
        require(success, string(returnData));

    }

    function revokeConfirmation(uint _txIndex)
        public
        onlyDAOMember
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

    }

    function getDAOMembers() public view returns (address[] memory ) {
        return DAOMembers;
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex)
        public
        view
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}

