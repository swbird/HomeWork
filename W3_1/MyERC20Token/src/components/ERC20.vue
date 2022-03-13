<script>
import { ethers } from 'ethers'

import birdTokenAddr from '../../../deployments/bscTest/BirdToken.json'
import birdTokenAbi from '../../../artifacts/contracts/BirdToken.sol/Bird.json'

import valutAddr from '../../../deployments/bscTest/valut.json'
import valutAbi from '../../../artifacts/contracts/Valut.sol/Valut.json'

// import { premitTypedDate } from "../typedData.js";

export default {

  name: 'birdToken',

  data() {
    return {

      recipient: null,
      amount: null,
      balance: null,
      depositeAmount: null,
      withdrawAmount: null,

      name: null,
      decimal: null,
      symbol: null,
      supply: null,

      valut_balance: null,

      stakeAmount: null,

    }
  },

  async created() {
    await this.initAccount()
    this.initContract()
    this.getInfo();
    this.getNonce();
  },

  methods: {
    async initAccount(){
      if(window.ethereum) {
        console.log("initAccount");
        try{
          this.accounts = await window.ethereum.enable()
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];
          this.currProvider = window.ethereum;
          this.provider = new ethers.providers.Web3Provider(window.ethereum);

          this.signer = this.provider.getSigner()
          let network = await this.provider.getNetwork()
          this.chainId = network.chainId;
          console.log("chainId:", this.chainId); 

        } catch(error){
          console.log("User denied account access", error)
        }
      }else{
        console.log("Need install MetaMask")
      }
    },

    async initContract() {
      this.birdToken = new ethers.Contract(birdTokenAddr.address, 
        birdTokenAbi.abi, this.signer);

      this.valut = new ethers.Contract(valutAddr.address, 
        valutAbi.abi, this.signer);
      console.log("init contract successful");

    }, 

     getInfo() {
      this.birdToken.name().then((r) => {
        this.name = r;
      })
      this.birdToken.decimals().then((r) => {
        this.decimal = r;
      })
      this.birdToken.symbol().then((r) => {
        this.symbol = r;
      })
      this.birdToken.totalSupply().then((r) => {
        this.supply = ethers.utils.formatUnits(r, 18);
      })

      this.birdToken.balanceOf(this.account).then((r) => {
        this.balance = ethers.utils.formatUnits(r, 18);
      })

      this.valut.userAssestinfo(this.account).then((r) => {
        this.valut_balance = ethers.utils.formatUnits(r, 18);
      })


      
    },

    async getNonce() {
      this.provider.getTransactionCount(this.account).then((transactionCount) => {
      console.log("发送交易总数: " + transactionCount);
      this.nonce = transactionCount;
    });
    },


    transfer() {
      let amount = ethers.utils.parseUnits(this.amount, 18);
      this.birdToken.transfer(this.recipient, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.getInfo();
      })
    },
    approve(){
      let amount = ethers.utils.parseUnits("10", 70);
      this.birdToken.approve(valutAddr.address, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.getInfo();
      })
    },
    cancel_approve(){
      let amount = ethers.utils.parseUnits("0", 0);
      this.birdToken.approve(valutAddr.address, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.getInfo();
      })
    },
    deposite() {
      let depositeAmount = ethers.utils.parseUnits(this.depositeAmount, 18);
      console.log(depositeAmount);
      this.valut.deposite(depositeAmount).then((r) => {
        console.log(r);  // 返回值不是true
        this.getInfo();
      })
    },
    withdraw() {
      let withdrawAmount = ethers.utils.parseUnits(this.withdrawAmount, 18);
      console.log(withdrawAmount);
      this.valut.withdraw(withdrawAmount).then((r) => {
        console.log(r);  // 返回值不是true
        this.getInfo();
      })
    }

    // permitStake() {
    //   this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);
      
    //   let amount =  ethers.utils.parseUnits(this.stakeAmount).toString();
      

    //   let msgParams = premitTypedDate("ERC2612", 
    //     erc2612Addr.address,
    //     this.account, bankAddr.address, amount, this.deadline, this.chainId, this.nonce);
      
    //   console.log("msgParams:" + msgParams)

    //   this.currProvider.sendAsync({
    //     method: 'eth_signTypedData_v4',
    //     params: [this.account, msgParams],
    //     from: this.account
    //   }, (err, sign) => {
    //     this.sign = sign.result;
    //     console.log(this.sign)

    //     //  椭圆曲线签名签名的值:
    //     // r = 签名的前 32 字节
    //     // s = 签名的第2个32 字节
    //     // v = 签名的最后一个字节

    //     let r = '0x' + this.sign.substring(2).substring(0, 64);
    //     let s = '0x' + this.sign.substring(2).substring(64, 128);
    //     let v = '0x' + this.sign.substring(2).substring(128, 130);

    //     this.bank.permitDeposit(this.account, amount, this.deadline, v, r, s, {
    //             from: this.account
    //           }).then(() => {
    //             this.getInfo();
    //             this.getNonce();
    //         })
    //   });
    // }
  }
}


</script>

<template>
  <div >

      <div>
        <br /> Token名称 : {{ name  }}
        <br /> Token符号 : {{  symbol }}
        <br /> Token精度 : {{  decimal }}
        <br /> Token发行量 : {{  supply }}
        <br /> 我的余额 : {{ balance  }}
        <br /> 我的Nonce : {{ nonce  }}
        <br /> 我的valut存款余额: {{valut_balance}}
      </div>

      <div >
        
        <br />存款金额
        <input type="text" v-model="depositeAmount" />
        <!-- <br /> -->
        <br />取款金额:
        <input type="text" v-model="withdrawAmount" />
        <br />
        <br />
        <button @click="approve()"> 授权token到合约 </button>
        <button @click="cancel_approve()"> 取消token授权 </button>
        <br />
        <button @click="deposite()"> 向Valut中存款  </button>
        <button @click="withdraw()"> 从Valut中取款  </button>
      </div>

    <!-- <div >
      <input v-model="stakeAmount" placeholder="输入质押量"/>
      <button @click="deposite()">离线授权存款</button>
    </div> -->

  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

div {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
