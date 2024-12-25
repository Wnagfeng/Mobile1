<!-- 订单详情优化版本 -->
<template>
    <div id="order">
        <van-overlay :show="show" @click="show = false">
            <div class="loading-wrapper">
                <van-loading size="30px" color="skyblue" vertical>加载中...</van-loading>
            </div>
        </van-overlay>

        <div class="top">
            <div v-if="orderDetail.statusDto" class="title">{{ orderDetail.statusDto.msg }}</div>
            <div class="user-address">
                <div>
                    <span class="user-info">{{ orderDetail.realName }}</span>
                    <span class="user-info">{{ orderDetail.userPhone }}</span>
                </div>
                <div class="user-address-detail">{{ orderDetail.userAddress }}</div>
            </div>
        </div>

        <div class="content">
            <van-cell v-if="orderDetail.statusDto" title="订单状态" :value="orderDetail.statusDto.title" />

            <div class="order-list">
                <van-card v-for="item in orderDetail.cartInfo" :key="item.id" :num="item.cartNum"
                    :desc="item.productInfo.storeInfo" :title="item.productInfo.storeName"
                    :thumb="item.productInfo.image">
                    <template #tags>
                        <van-tag plain type="danger">{{ item.productInfo.attrInfo.sku }}</van-tag>
                    </template>
                    <template #price>￥{{ item.productInfo.price }}</template>
                </van-card>
            </div>

            <van-cell title="快递" :value="orderDetail.deliveryName" />
            <van-cell title="订单号" :value="orderDetail.orderId" />
            <van-cell title="下单时间" :value="orderDetail.payTime" />
            <van-cell title="运费" :value="orderDetail.freightPrice || '免运费'" />
            <van-cell title="优惠" :value="orderDetail.couponPrice || '无优惠'" />
            <van-cell title="总金额" :value="orderDetail.payPrice" />
            <van-cell v-if="orderDetail.statusDto" title="支付方式" :value="orderDetail.statusDto.payType" />
        </div>
    </div>
</template>

<script>
import { Loading, Overlay } from 'vant';
import { order } from '../../api/order';

export default {
    components: { Loading, Overlay },
    data() {
        return {
            // 订单详情数据
            orderDetail: {},
            show: true
        };
    },
    methods: {
        async FetchGetOrderDetailData() {
            try {
                const res = await order(this.$route.query.key);
                if (res.status === 200) {
                    console.log("获取订单详情成功", res.data);
                    this.orderDetail = res.data;
                    this.show = false;
                }
            } catch (error) {
                console.error("获取订单详情失败", error);
                this.show = false;
            }
        }
    },
    mounted() {
        if (!this.$route.query.key) {
            this.$router.push('/');
        } else {
            this.FetchGetOrderDetailData();
        }
    }

};

</script>
<style lang="scss" scoped>
#order {
    .loading-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .top {
        background: url('../../static/userBg.png') no-repeat center center;
        background-size: cover;
        height: 180px;
        padding: 0px;

        .title {
            font-size: 18px;
            color: white;
            text-align: center;
            line-height: 90px;
        }

        .user-address {
            background-color: white;
            border-radius: 16px 16px 0 0;
            padding: 20px;
            margin-top: 10px;
            box-sizing: border-box;

            .user-info {
                font-size: 14px;
                color: #333;
                margin-right: 10px;
            }

            .user-address-detail {
                margin-top: 10px;
                color: #999;
            }
        }
    }

    .content {
        padding: 10px;

        .order-list {
            margin-top: 15px;
        }

        .van-card__price {
            color: #ed6a0c;
            font-size: 18px;
        }
    }
}
</style>
