<!-- 订单状态优化版本 -->
<template>
    <div>
        <van-tabs v-model="activeTabStatus" @click="handelNavClick" sticky>
            <template v-for="nav in navList">
                <van-tab :title="nav.text" :name="nav.status">
                    <template v-if="OrderListData.length > 0">
                        <div class="order" v-for="(item, index) in OrderListData" :key="index">
                            <template v-for="iten in item.cartInfo" >
                                <van-cell :title="item.createTime" :border="false" :value="nav.text"
                                    v-if="iten.isReply === 0" />
                                <van-cell :title="item.createTime" :border="false" value=" " v-else />
                                <van-card class="order-card" :num="iten.cartNum" :price="item.payPrice"
                                    :desc="iten.productInfo.storeInfo" :title="iten.productInfo.storeName"
                                    :thumb="imgUrls + iten.productInfo.image">
                                    <template #price>
                                        <span v-if="iten.productInfo.isIntegral === 1">
                                            <span class="integral">{{ iten.productInfo.attrInfo.integral }}</span>
                                            <span class="integral-unit">积分</span>

                                        </span>
                                        <span v-else>
                                            <span class="price-unit" v-if="item.combinationId === 0">￥</span>
                                            <span class="price-unit" v-else>团购价￥</span>
                                            <span class="price">{{ iten.truePrice }}</span>
                                        </span>
                                    </template>
                                    <template #tags>
                                        <van-tag plain type="danger">{{ iten.productInfo.attrInfo.sku }}</van-tag>
                                    </template>
                                    <template #footer>
                                        <template v-for="action in FilterMapKey(item, iten)">
                                            <van-button class="btn" v-bind="action.attrs" @click="action.handler">
                                                {{ action.text }}
                                            </van-button>
                                        </template>
                                    </template>
                                </van-card>
                                <van-divider class="divider" />
                            </template>
                        </div>
                        <van-divider v-if="OrderListData.length > 9" @click="handelloadMoreClick(nav.status)">点击加载更多</van-divider>
                    </template>
                    <template v-else>
                        <van-empty description="空空如也!" />
                    </template>
                </van-tab>
            </template>
        </van-tabs>

        <van-popup v-model="show" round position="bottom" class="popup">
            <van-radio-group v-model="paymentMethod " v-if="payInfo.payIntegral === 0">
                <van-cell class="radio-cell" center icon="shop-o">
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
                <van-cell class="radio-cell" center icon="shop-o">
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
            <van-radio-group v-else>
                <van-cell class="radio-cell" center icon="shop-o">
                    <template #title>
                        <span class="custom-title">积分支付</span>
                    </template>
                    <template #right-icon>
                        <van-radio name="1"></van-radio>
                    </template>
                </van-cell>
            </van-radio-group>
            <van-button block type="danger" class="btn-confirm" @click="handelpayClick">确定</van-button>
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
} from "@/api/order.js";
import { getBalance } from "@/api/wallet.js";

export default {
    data() {
        return {
            userAccount: { nowMoney: 1999 },
            imgUrls: this.$baseApi,
            paymentMethod : "1",
            status: 0,
            show: false,
            navList: [
                { status: "0", text: "待付款" },
                { status: "1", text: "待发货" },
                { status: "2", text: "待收货" },
                { status: "3", text: "待评价" },
                { status: "4", text: "已完成" }
            ],
            activeTabStatus: this.$route.query.type,
            limit: 10,
            OrderListData: [
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
            payInfo: {}
        };
    },
    created() {
        this.fetchgetordertypeList(this.activeTabStatus);
        console.log(this.$route.query.type)
        this.fetchgetorderBalance();
    },
    methods: {
        takeOrder(id) {
            takeOrder({ uni: id }).then(res => {
                if (res.status === 200) {
                    this.$toast.success("收货成功");
                    this.activeTabStatus = 3;
                    this.fetchgetordertypeList(this.activeTabStatus);
                }
            });
        },
        fetchgetorderBalance() {
            getBalance().then(res => {
                this.userAccount = res.data;
            });
        },
        handelpayClick() {
            payOrder({
                uni: this.payInfo.orderId,
                from: "h5",
                paytype: this.payInfo.payIntegral === 0 ? "yue" : "integral"
            }).then(res => {
                if (res.status === 200) {
                    this.$toast.success("支付成功");
                    this.fetchgetordertypeList(this.$route.query.type);
                    this.show = false;
                }
            });
        },
        handelcancelclick(id) {
            cancelOrder({ id }).then(res => {
                if (res.status === 200) {
                    this.$toast.success("取消成功");
                    this.fetchgetordertypeList(this.$route.query.type);
                }
            });
        },
        handelDeleteClick(id) {
            delOrder({ uni: id }).then(res => {
                if (res.status === 200) {
                    this.$toast.success("删除成功");
                    this.fetchgetordertypeList(this.$route.query.type);
                }
            });
        },
        handelNavClick(name) {
            this.fetchgetordertypeList(name);
        },
        fetchgetordertypeList(name, limit = this.limit) {
            getOrderList({ type: name, limit }).then(res => {
                this.OrderListData = res.data.content;
            });
        },
        handelloadMoreClick(type) {
            if (this.status !== type) {
                this.limit = 0;
            }
            this.limit += 10;
            this.status = type;
            this.fetchgetordertypeList(type);
        },
        FilterMapKey(item, iten) {
            const actions = [];
            if (item.statusDto.type === 0) {
                actions.push(
                    { text: "立即付款", attrs: {}, handler: () => { this.payInfo = item; this.show = true; } },
                    { text: "取消订单", attrs: {}, handler: () => this.handelcancelclick(item.orderId) }
                );
            }
            if (item.combinationId !== 0) {
                actions.push({ text: "查看团购", attrs: { to: `/groupBookOk?groupId=${item.pinkId}` } });
            }
            if (item.statusDto.type === 1) {
                actions.push({ text: "提醒发货", attrs: {}, handler: () => this.$toast.success("已提醒卖家发货！") });
            }
            if (item.statusDto.type === 2) {
                actions.push({ text: "确认收货", attrs: {}, handler: () => this.takeOrder(item.orderId) });
            }
            if (item.statusDto.type === 3) {
                actions.push({ text: "去评价", attrs: { to: `/review?unique=${iten.unique}` } });
            }
            actions.push({ text: "立即查看", attrs: { to: `/orderDetail?key=${item.unique}` } });
            if (item.statusDto.type === 4) {
                actions.push({ text: "删除订单", attrs: {}, handler: () => this.handelDeleteClick(item.orderId) });
            }
            return actions;
        }
    }
};
</script>

<style scoped>
.order {
    margin-top: 10px;
    background-color: #FFFFFF;
}

.order-card {
    background-color: #FFFFFF;
}

.btn {
    height: 30px;
    border-radius: 7px;
}

.divider {
    width: calc(100% - 50px);
    margin: 0 auto;
}

.popup {
    height: 30%;
}

.radio-cell {
    padding: 10px 15px;
}

.custom-title {
    font-size: 14px;
}

.btn-confirm {
    width: calc(100% - 30px);
    margin: 10px auto;
}

.integral {
    font-size: 16px;
    color: #ED6A0C;
}

.integral-unit {
    font-size: 14px;
    color: #ED6A0C;
}

.price-unit {
    font-size: 14px;
    color: #ED6A0C;
}

.price {
    font-size: 16px;
    color: #ED6A0C;
}
</style>