<!-- 订单详情页面未优化 -->
<template>
    <div id="order">
        <van-overlay :show="isshowLoading">
            <div class="wrapper" @click.stop>
                <van-loading size="24px" color="#0094ff" vertical>加载中...</van-loading>
            </div>
        </van-overlay>
        <div class="top">
            <div v-if="OrderData.statusDto" class="title">{{ OrderData.statusDto.msg }}</div>
            <div class="user_address">
                <div style="font-size: 14px">
                    <span style="margin-right: 10px">{{ OrderData.realName }}</span><span>{{ OrderData.userPhone
                        }}</span>
                </div>
                <div style="margin-top: 10px; color: #999">
                    {{ OrderData.userAddress }}
                </div>
            </div>
        </div>
        <div class="content">
            <van-cell v-if="OrderData.statusDto" title="订单状态" :value="OrderData.statusDto.title" />
            <div class="order_list">
                <van-card v-for="item in OrderData.cartInfo" :key="item.id" :num="item.cartNum"
                    :desc="item.productInfo.storeInfo" :title="item.productInfo.storeName"
                    :thumb="$baseApi + item.productInfo.image">
                    <template #tags>
                        <van-tag plain type="danger">{{ item.productInfo.attrInfo.sku }}</van-tag>
                    </template>
                    <template #price> ￥{{ item.productInfo.price }} </template>
                </van-card>
            </div>
            <van-cell title="快递" :value="OrderData.deliveryName" />
            <van-cell title="订单号" :value="OrderData.orderId" />
            <van-cell title="下单时间" :value="OrderData.payTime" />
            <van-cell title="运费" :value="OrderData.freightPrice || '免运费'" />
            <van-cell title="优惠" :value="OrderData.couponPrice || '无优惠'" />
            <van-cell title="总金额" :value="OrderData.payPrice" />
            <van-cell v-if="OrderData.statusDto" title="支付方式" :value="OrderData.statusDto.payType" />
        </div>
    </div>
</template>
<script>
import { Loading } from 'vant'
import { Overlay } from 'vant'
import { order } from '../../api/order'
export default {
    // 注册Loading组件
    components: { [Loading.name]: Loading, [Overlay.name]: Overlay },
    data() {
        return {
            // 订单详情数据
            OrderData: {
                realName: "张三",
                userPhone: "13800138000",
                userAddress: "广东省深圳市南山区科技园路1号",
                orderId: "ORDER20240315001",
                payTime: "2024-03-15 14:30:00",
                freightPrice: "0.00",
                couponPrice: "10.00",
                payPrice: "299.00",
                deliveryName: "顺丰快递",
                statusDto: {
                    msg: "订单已发货",
                    title: "待收货",
                    payType: "余额支付",
                },
                cartInfo: [
                    {
                        id: 1,
                        cartNum: 2,
                        productInfo: {
                            storeName: "2024新款休闲运动鞋",
                            storeInfo: "时尚百搭，舒适透气",
                            image: "/uploads/product/2024/03/15/shoe.jpg",
                            price: "149.00",
                            attrInfo: {
                                sku: "黑色-42码"
                            }
                        }
                    },
                    {
                        id: 2,
                        cartNum: 1,
                        productInfo: {
                            storeName: "纯棉T恤",
                            storeInfo: "100%纯棉，柔软舒适",
                            image: "/uploads/product/2024/03/15/tshirt.jpg",
                            price: "69.00",
                            attrInfo: {
                                sku: "白色-L码"
                            }
                        }
                    }
                ]

            },
            isshowLoading: true
        }
    },
    methods: {
        // 获取数据
        FetchGetOrderDetailData() {
            this.isshowLoading = false
            order(this.$route.query.key).then(res => {
                this.isshowLoading = false
                if (res.status === 200) {
                    this.OrderData = res.data
                }
            })
        }
    },
    created() {
        console.log(this.$route.query.key)
        console.log($baseApi)
    },
    mounted() {
        if (!this.$route.query.key) {
            this.$router.push('/')
        }

        this.FetchGetOrderDetailData()
    }
}
</script>
<style lang="scss" scoped>
#order {
    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .top {
        background: url('../../static/userBg.png') no-repeat center center;
        height: 180px;

        .title {
            line-height: 90px;
            height: 100px;
            text-align: center;
            font-size: 18px;
            color: white;
        }

        .user_address {
            background-color: white;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            transform: translateY(1px);
            box-sizing: border-box;
            padding: 20px;
        }
    }

    .content {
        margin-top: 10px;

        .order_list {
            /deep/ .van-card__price {
                color: #ed6a0c;
                font-size: 18px;
            }
        }
    }
}
</style>