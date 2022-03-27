pragma solidity 0.6.0;


interface IScore{
    function getStudentScore(address student) external view returns (uint);
    function setScore(address student,uint score) external;
}

contract Teacher{
    address private IScoreAddress = address(0x45bD31a5A182534F3c808fE40c2f9cA11113c4FA);
    IScore studentScore = IScore(IScoreAddress);

    function setStudentScore(address student, uint score) external{
        studentScore.setScore(student,score);
    }

    function setStudentScoreByLowlevelcall(address student, uint score) external {
        bytes memory payload = abi.encodeWithSignature("setScore(address,uint256)", student,score);
            (bool success, bytes memory returnData) = IScoreAddress.call(payload);
            require(success, string(returnData));
    }
}   