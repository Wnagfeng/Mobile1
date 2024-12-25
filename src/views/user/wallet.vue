<template>
  <div id="recharge">
    <div class="user_money">
      <div>
        <span>总资产 (元)</span><span>{{ userMoney.nowMoney }}</span>
      </div>
      <div>
        <span>累计充值(元)</span><span>{{ userMoney.recharge }}</span>
      </div>
      <div>
        <span>累计消费(元)</span><span>{{ userMoney.orderStatusSum }}</span>
      </div>
    </div>
    <div class="to_recharge">
      <van-cell v-for="item in rechargeConfig" :key="item.id"
        :title="`充值￥${item.value.price} 赠送￥${item.value.give_price}`" icon="shop-o">
        <template #right-icon>
          <van-button @click="prepaid(item.id)" :loading="loading">充值</van-button>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import recharge from '../../api/wallet'
export default {
  data() {
    return {
      userMoney: {},
      rechargeConfig: {},
      loading: false
    }
  },
  created() { },
  methods: {
    // 获取充值配置
    prepaidPlan() {
      recharge.prepaidPlan().then(res => {
        if (res.status === 200) {
          this.rechargeConfig = res.data.rechargePriceWays
        }
      })
    },
    // 获取钱包数据
    getBalance() {
      recharge.getBalance().then(res => {
        if (res.status === 200) {
          this.userMoney = res.data
        }
      })
    },
    // 充值请求
    prepaid(id) {
      this.loading = true
      recharge
        .prepaid({
          rechar_id: id
        })
        .then(res => {
          this.loading = false
          if (res.status === 200) {
            this.$toast.success('充值成功')
            this.getBalance()
          } else this.$toast(res.msg)
        })
    }
  },
  mounted() {
    this.prepaidPlan()
    this.getBalance()
  }
}
</script>
<style lang="scss" scoped>
#recharge {
  box-sizing: border-box;
  padding: 15px;

  .user_money {
    box-sizing: border-box;
    border-radius: 8px;
    background-color: black;
    color: #ff8001;
    display: flex;
    justify-content: center;
    padding: 10px 15px;

    >div {
      height: 40px;
      flex: 1;
      display: flex;
      text-align: center;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .to_recharge {
    margin-top: 15px;

    button {
      border: 0;
      height: 25px;
      background: red;
      color: white;
      border-radius: 16px;
    }

    .van-button--loading {
      background-color: #ff0000ad;
    }
  }
}
</style>
