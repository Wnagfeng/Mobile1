<template>
  <div class="wallet-container">
    <!-- 资产概览卡片 -->
    <div class="balance-card">
      <div class="balance-item">
        <span class="balance-label">总资产 (元)</span>
        <span class="balance-value">{{ walletInfo.balance }}</span>
      </div>
      <div class="balance-item">
        <span class="balance-label">累计充值 (元)</span>
        <span class="balance-value">{{ walletInfo.totalRecharge }}</span>
      </div>
      <div class="balance-item">
        <span class="balance-label">累计消费 (元)</span>
        <span class="balance-value">{{ walletInfo.totalSpent }}</span>
      </div>
    </div>

    <!-- 充值选项列表 -->
    <div class="recharge-list">
      <van-cell v-for="plan in rechargePlans" :key="plan.id" :title="formatRechargeTitle(plan)" icon="gold-coin-o"
        class="recharge-item">
        <template #right-icon>
          <van-button @click="handleRecharge(plan.id)" :loading="loadingId === plan.id" class="recharge-button"
            size="small">
            充值
          </van-button>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import recharge from '../../api/wallet'

export default {
  name: 'WalletRecharge',

  data() {
    return {
      // 钱包信息
      walletInfo: {
        balance: '5280.00',
        totalRecharge: '10000.00',
        totalSpent: '4720.00'
      },
      // 充值方案
      rechargePlans: [
        {
          id: 1,
          value: {
            price: '100',
            give_price: '10'
          }
        },
        {
          id: 2,
          value: {
            price: '200',
            give_price: '30'
          }
        },
        {
          id: 3,
          value: {
            price: '500',
            give_price: '100'
          }
        },
        {
          id: 4,
          value: {
            price: '1000',
            give_price: '300'
          }
        }
      ],
      loadingId: null // 记录正在充值的选项ID
    }
  },

  methods: {
    // 格式化充值标题
    formatRechargeTitle(plan) {
      return `充值￥${plan.value.price} 赠送￥${plan.value.give_price}`
    },

    // 获取充值配置
    async fetchRechargePlans() {
      try {
        const res = await recharge.prepaidPlan()
        if (res.status === 200) {
          this.rechargePlans = res.data.rechargePriceWays
        }
      } catch (error) {
        this.$toast.fail('获取充值方案失败')
      }
    },

    // 获取钱包数据
    async fetchWalletInfo() {
      try {
        const res = await recharge.getBalance()
        if (res.status === 200) {
          this.walletInfo = {
            balance: res.data.nowMoney,
            totalRecharge: res.data.recharge,
            totalSpent: res.data.orderStatusSum
          }
        }
      } catch (error) {
        this.$toast.fail('获取钱包信息失败')
      }
    },

    // 处理充值
    async handleRecharge(id) {
      this.loadingId = id
      try {
        const res = await recharge.prepaid({ rechar_id: id })
        if (res.status === 200) {
          this.$toast.success('充值成功')
          await this.fetchWalletInfo()
        } else {
          this.$toast(res.msg)
        }
      } catch (error) {
        this.$toast.fail('充值失败')
      } finally {
        this.loadingId = null
      }
    }
  },

  mounted() {
    this.fetchRechargePlans()
    this.fetchWalletInfo()
  }
}
</script>

<style lang="scss" scoped>
.wallet-container {
  padding: 16px;
  background-color: #f5f5f5;
  min-height: 100vh;

  .balance-card {
    display: flex;
    justify-content: space-around;
    padding: 20px 16px;
    background: linear-gradient(135deg, #1a1a1a 0%, #363636 100%);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .balance-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .balance-label {
        color: #ff9800;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .balance-value {
        color: #ffc107;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .recharge-list {
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;

    .recharge-item {
      margin-bottom: 1px;

      &:last-child {
        margin-bottom: 0;
      }

      .recharge-button {
        height: 32px;
        padding: 0 16px;
        background: linear-gradient(135deg, #ff4e50 0%, #f9d423 100%);
        border: none;
        border-radius: 16px;
        color: white;
        font-weight: 500;

        &.van-button--loading {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>