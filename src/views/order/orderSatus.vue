<!-- 订单状态未优化 -->
<template>
    <div>
        <van-tabs v-model="activeName" @click="onClick" sticky>
            <template v-for="nav in navList">
                <van-tab :title="nav.text" :name="nav.status">
                    <!-- 判断是否为空 -->
                    <template v-if="orderList.length > 0">
                        <div class="order" v-for="(item, index) in orderList" :key="index">
                            <template v-for="cartItem in item.cartInfo">
                                <!-- 是否渲染评论 -->
                                <van-cell :title="item.createTime" :border="false" :value="nav.text"
                                    v-if="cartItem.isReply == 0" />
                                <!-- 不需要渲染评论 -->
                                <van-cell :title="item.createTime" :border="false" value=" " v-else />
                                <van-card style="background-color: #FFFFFF;" :num="cartItem.cartNum"
                                    :price="item.payPrice" :desc="cartItem.productInfo.storeInfo"
                                    :title="cartItem.productInfo.storeName"
                                    :thumb="imgUrls + cartItem.productInfo.image">
                                    <template #price>
                                        <!-- 是否为积分商品 -->
                                        <span v-if="cartItem.productInfo.isIntegral == 1">
                                            <font size="4" color="#ED6A0C">{{ cartItem.productInfo.attrInfo.integral }}
                                            </font>
                                            <font size="3" color="#ED6A0C">积分</font>
                                        </span>
                                        <!-- 不是积分商品 -->
                                        <span v-else>
                                            <font size="3" color="#ED6A0C" v-if="item.combinationId == 0">￥</font>
                                            <font size="3" color="#ED6A0C" v-if="item.combinationId != 0">团购价￥</font>
                                            <font size="4" color="#ED6A0C">{{ cartItem.truePrice }}</font>
                                        </span>
                                    </template>
                                    <template #tags>
                                        <van-tag plain type="danger">{{ cartItem.productInfo.attrInfo.sku }}</van-tag>
                                    </template>
                                    <template #footer>
                                        <!-- 根据01234 显示不同的按钮 -->
                                        <!-- 点击立即付款把item赋值给payInfo，show为true 做一下弹窗 -->
                                        <van-button v-if="item.statusDto.type == 0" class="btn"
                                            @click="payInfo = item; show = true">立即付款</van-button>
                                        <van-button v-if="item.statusDto.type == 0" class="btn"
                                            @click="cancelOrder(item.orderId)">取消订单</van-button>
                                        <van-button v-if="item.combinationId != 0" class="btn"
                                            :to="'/groupBookOk?groupId=' + item.pinkId">查看团购</van-button>
                                        <van-button v-if="item.statusDto.type == 1" class="btn"
                                            @click="$toast.success('已提醒卖家发货！')">提醒发货</van-button>
                                        <van-button v-if="item.statusDto.type == 2" class="btn"
                                            @click="takeOrder(item.orderId)">确认收货</van-button>
                                        <van-button v-if="item.statusDto.type == 3" class="btn"
                                            :to="'/review?unique=' + cartItem.unique">去评价</van-button>
                                        <van-button class="btn"
                                            :to="'/orderDetail?key=' + item.unique">立即查看</van-button>
                                        <van-button v-if="item.statusDto.type == 4" class="btn"
                                            @click="delOrder(item.orderId)">删除订单</van-button>
                                    </template>
                                </van-card>
                                <van-divider :style="{ width: 'calc(100% - 50px)', margin: '0 auto' }" />
                            </template>
                        </div>
                        <van-divider v-if="orderList.length > 9" @click="move(nav.status)">点击加载更多</van-divider>
                    </template>
                    <template v-else>
                        <van-empty description="空空如也!" />
                    </template>
                </van-tab>
            </template>
        </van-tabs>


        <van-popup v-model="show" round position="bottom" :style="{ height: '30%' }">
            <!-- 使用余额支付 -->
            <van-radio-group v-model="radio" v-if="payInfo.payIntegral == 0">
                <van-cell center icon="shop-o">
                    <template #title>
                        <span class="custom-title">余额</span>
                    </template>
                    <template #label>
                        <span class="custom-title">￥{{ userAccount.nowMoney }}</span>
                    </template>
                    <template #right-icon>
                        <van-radio name="1"></van-radio>
                    </template>
                </van-cell>
                <van-cell center icon="shop-o">
                    <template #title>
                        <span class="custom-title">微信</span>
                    </template>
                    <template #label>
                        <span class="custom-title">暂未开通</span>
                    </template>
                    <template #right-icon>
                        <van-radio name="1" disabled></van-radio>
                    </template>
                </van-cell>
            </van-radio-group>
            <!-- 使用积分支付 -->
            <van-radio-group v-model="radio" v-else>
                <van-cell center icon="shop-o">
                    <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                    <template #title>
                        <span class="custom-title">积分支付</span>
                    </template>
                    <template #right-icon>
                        <van-radio name="1"></van-radio>
                    </template>
                </van-cell>
            </van-radio-group>
            <van-button block type="danger" class="btns" @click="pay()">确定</van-button>
        </van-popup>

    </div>
</template>

<script>
import {
    getOrderList,
    cancelOrder,
    payOrder,
    takeOrder,
    delOrder
} from "@/api/order.js"
import {
    getBalance
} from "@/api/wallet.js"
export default {
    data() {
        return {
            userAccount: {
                nowMoney: 1999,
            },
            imgUrls: this.$baseApi,
            radio: "1",
            status: 0,
            show: false,
            navList: [{
                status: 0,
                text: "待付款",
            },
            {
                status: 1,
                text: "待发货",
            },
            {
                status: 2,
                text: "待收货",
            },
            {
                status: 3,
                text: "待评价",
            },
            {
                status: 4,
                text: "已完成",
            },
            ],
            activeName: this.$route.query.type * 1,
            limit: 0,
            orderList: [
                {
                    unique: 1,
                    orderId: 1,
                    createDate: "2021-01-01 12:00:00",
                    payPrice: 100,
                    statusDto: {
                        type: 3
                    },
                    combinationId: 0,
                    payIntegral: 0,
                    isIntegral: 0,
                    cartInfo: [
                        {
                            cartNum: 1,
                            truePrice: 100,
                            productInfo: {
                                storeName: "测试店铺",
                                storeInfo: "测试地址",
                                image: "https://img.yzcdn.cn/upload_files/2019/08/13/5d50d9d5a1d5d9d5.jpg",
                                isIntegral: 0,
                                payIntegral: 0,
                                attrInfo: {
                                    sku: "123456"
                                }
                            }
                        }
                    ]


                }
            ],
            payInfo: {

            }
        };
    },
    created() {
        this.getList(this.$route.query.type)
        this.getBalance()
    },
    methods: {
        //收货
        takeOrder(id) {
            takeOrder({
                uni: id
            }).then(res => {
                if (res.status == 200) {
                    this.$toast.success("收货成功")
                    this.activeName = 3
                    this.getList(this.activeName)
                }
            })
        },
        //我的钱包数据
        getBalance() {
            getBalance().then(res => {
                this.userAccount = res.data
            })
        },
        pay() {
            payOrder({
                uni: this.payInfo.orderId,
                from: 'h5',
                paytype: this.payInfo.payIntegral == 0 ? 'yue' : 'integral'
            }).then(res => {
                if (res.status == 200) {
                    this.$toast.success("支付成功")
                    this.getList(this.$route.query.type)
                    this.show = false
                }
            })


        },
        //取消订单
        cancelOrder(id) {
            cancelOrder({
                id: id
            }).then(res => {
                if (res.status == 200) {
                    this.$toast.success("取消成功")
                    this.getList(this.$route.query.type)
                }
            })
        },
        delOrder(id) {
            delOrder({
                uni: id
            }).then(res => {
                if (res.status == 200) {
                    this.$toast.success("删除成功")
                    this.getList(this.$route.query.type)
                }
            })
        },

        //name为van-tab的name
        onClick(name, title) {
            this.getList(name)
        },
        getList(name, limit) {
            getOrderList({
                type: name,
                limit: limit
            }).then(res => {
                this.orderList = res.data.content
            })
        },
        move(type) {
            if (this.status == type) {
                this.limit += 10
            } else {
                this.limit = 0
                this.limit += 10
            }
            this.status = type
            this.limit += 10
            this.getList(type, this.limit)
        }
    },
};
</script>

<style scoped>
.order {
    margin-top: 10px;
    background-color: #FFFFFF;
}

.order .btn {
    height: 30px;
    border-radius: 7px;
}

.btns {
    width: calc(100% - 30px);
    margin: 10px auto;
}
</style>
