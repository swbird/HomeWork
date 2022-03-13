pragma solidity 0.6.0;



contract Score {
    mapping (address=>bool) private isTeacher;
    mapping (address=>uint) private studentScore;
    event scoreChanged(address student, uint newScore);
    constructor () public {
        isTeacher[msg.sender] = true; // 设置owner为默认管理员
    }
    
    modifier onlyTeacher_call() {
        require(isTeacher[tx.origin], "caller is not the teacher");
        _;
    }

    function setScore(address student,uint score) external onlyTeacher_call {
        require(score<=100,'error:score exceed maxScore!');
        studentScore[student] = score;
        emit scoreChanged(student,score);
    }

    function getStudentScore(address student) public view returns (uint){
        return studentScore[student];
    }

}


