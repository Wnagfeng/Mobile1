<!--余额支付或者积分支付页面优化  -->
<template>
    <div class="payment-container">
        <!-- 收货地址部分 -->
        <section class="address-section">
            <van-cell is-link @click="isAddressPopupVisible = true" v-if="!addressInfo">
                <template #title>
                    <span class="address-title">请选择地址</span>
                </template>
            </van-cell>
            <van-cell is-link @click="isAddressPopupVisible = true" v-if="addressInfo">
                <template #title>
                    <span class="address-name">{{ addressInfo.realName }}</span>
                    <span class="address-phone">{{ addressInfo.phone }}</span>
                </template>
                <template #label>
                    <span class="address-detail">
                        {{ addressInfo.province + ' ' + addressInfo.district + ' ' + addressInfo.city }}
                    </span>
                </template>
            </van-cell>
        </section>

        <!-- 地址选择弹窗 -->
        <van-popup v-model="isAddressPopupVisible" round position="bottom" class="address-popup">
            <van-contact-card type="add" @click="handelAddaddressClick" class="add-contact" />
            <template v-for="item in UserAddressList">
                <van-contact-card type="edit" :name="item.realName" :tel="item.phone" @click="Chroreoneaddress(item)"
                    class="contact-item" />
            </template>
        </van-popup>

        <!-- 积分OrPrice -->
        <section class="product-list" v-if="cartInfo.length > 0">
            <template v-for="item in cartInfo">
                <van-card :num="item.cartNum" :desc="item.productInfo.storeInfo" :title="item.productInfo.storeName"
                    :thumb="Baseimgurl + item.productInfo.image" class="product-card">
                    <template #price>
                        <span class="price-wrapper" v-if="item.productInfo.isIntegral == 1">
                            <span class="currency">积分</span>
                            <span class="amount">{{ item.productInfo.attrInfo.integral }}</span>
                        </span>
                        <span class="price-wrapper" v-else>
                            <span class="currency">￥</span>
                            <span class="amount">{{ item.truePrice }}</span>
                        </span>
                    </template>
                    <template #tags>
                        <van-tag plain type="danger" class="sku-tag">
                            {{ item.productInfo.attrInfo.sku }}
                        </van-tag>
                    </template>
                </van-card>
            </template>
        </section>

        <!-- 优惠券选择 -->
        <van-cell title="优惠券" is-link @click="isCouponPopupVisible = true">
            <template #default v-if="availableCouponsInFo">
                <span class="coupon-price">已减{{ availableCouponsInFo.couponPrice }}</span>
            </template>
        </van-cell>
        <van-popup v-model="isCouponPopupVisible" round position="bottom" class="coupon-popup">
            <van-cell center class="discount" v-for="(item, index) in availableCoupons" :key="index"
                @click="handelchoseOrderCoupons(item)">
                <template #title>
                    <span>{{ item.couponTitle }}</span><br />
                    <span class="coupon-condition">满{{ item.useMinPrice }}减{{ item.couponPrice }}</span>
                </template>
                <template #label>
                    <span class="coupon-expire">{{ item.endTime }} 到期</span>
                </template>
                <template #icon>
                    <span class="price-symbol">￥</span>
                    <span class="price-amount">{{ item.couponPrice }}</span>
                </template>
            </van-cell>
        </van-popup>

        <!-- 价格信息部分 -->
        <section class="price-section">
            <van-cell title="商品价格" :value="priceInfo.result.totalPrice" class="price-item" />
            <van-cell title="优惠" :value="priceInfo.result.couponPrice" class="price-item" />
            <van-cell title="运费" :value="priceInfo.result.payPostage > 0 ? priceInfo.result.payPostage : '免邮费'"
                class="price-item" />
            <van-field v-model="remark" label="备注" placeholder="请输入备注" class="remark-input" />
        </section>

        <!-- 支付方式选择 -->
        <section class="payment-method" v-if="!enableIntegral">
            <van-radio-group v-model="paymentMethod" class="method-list">
                <van-cell center icon="shop-o" class="method-item">
                    <template #title>
                        <span class="method-name">余额</span>
                    </template>
                    <template #label>
                        <span class="balance-amount">￥{{ userInfo.nowMoney }}</span>
                    </template>
                    <template #right-icon>
                        <van-radio name="yue" class="method-radio"></van-radio>
                    </template>
                </van-cell>
                <van-cell center icon="shop-o" class="method-item">
                    <template #title>
                        <span class="method-name">微信</span>
                    </template>
                    <template #label>
                        <span class="method-status">暂未开通</span>
                    </template>
                    <template #right-icon>
                        <van-radio name="wechat" disabled class="method-radio"></van-radio>
                    </template>
                </van-cell>
            </van-radio-group>
        </section>
        <section class="payment-method" v-else>
            <van-radio-group v-model="paymentMethod" class="method-list">
                <van-cell center icon="shop-o">
                    <template #title>
                        <span class="balance-name">剩余积分</span>
                    </template>
                    <template #default>
                        <span class="balance-amount">{{ userInfo.integral }}</span>
                    </template>
                    <template #right-icon>
                        <van-radio name="integral"></van-radio>
                    </template>
                </van-cell>
            </van-radio-group>
        </section>

        <van-submit-bar v-if="priceInfo.result && !enableIntegral" :price="priceInfo.result.payPrice * 100"
            button-text="提交订单" @submit="HandelcreateOrderClirk" />
        <van-submit-bar v-if="priceInfo.result && enableIntegral" :price="priceInfo.result.payIntegral * 100"
            button-text="提交订单" @submit="HandelcreateOrderClirk" />
    </div>
</template>

<script>
import {
    getAddress
} from "@/api/address.js"
import {
    getOrderInfo,
    getOrderSum,
    createOrder
} from "@/api/order.js"
import {
    getOrderCoupons
} from "@/api/discount.js"

import Axios from "axios";

export default {
    data() {
        return {
            isAddressPopupVisible: false,
            remark: null,
            isCouponPopupVisible: false,
            availableCoupons: [],//优惠券
            availableCouponsInFo: {},
            addressInfo: null,
            UserAddressList: [],
            UserOrderKey: '',
            priceInfo: { result: {} },
            userInfo: {},
            cartInfo: [],
            paymentMethod: "yue",
            loading: false,
            enableIntegral: false,
            Baseimgurl: "https://example.com/images/",
        };
    },

    created() {
        this.enableIntegral = this.$route.query.integral == 1
        this.paymentMethod = this.enableIntegral ? 'integral' : 'yue'  // 判断支付方式
        console.log("integral", this.enableIntegral)
        console.log("paymentMethod:", this.paymentMethod)


        this.fetchgetorder()// get order infos
        this.fetchgetOrderCoupons() //get order coupons

    },

    methods: {
        // 查询联系人
        async fetchgetAddressList() {
            console.log("getAddressList")
            try {
                console.log("getAddressList")
                const res = await getAddress()

                console.log("getAddressList", res.data.data)
                if (res.data) {
                    console.log("getAddressList", res.data)
                    this.UserAddressList = res.data.data
                    console.log("getAddressList1", res.UserAddressList)
                    if (this.UserAddressList.length === 0) {
                        this.$toast('请添加地址信息')
                        setTimeout(() => {
                            this.$router.push("/newContact")
                        }, 2000)
                    }
                }
            } catch (error) {
                this.$toast('获取地址列表失败')
                console.error(error)
            }
        },

        // 获取订单信息
        async fetchgetorder() {
            try {
                const res = await getOrderInfo({
                    cartId: this.$route.query.ids
                })


                if (res.data) {
                    const { cartInfo, addressInfo, usableCoupon, orderKey, userInfo } = res.data.data

                    this.cartInfo = cartInfo
                    this.addressInfo = addressInfo
                    this.availableCouponsInFo = usableCoupon
                    this.UserOrderKey = orderKey
                    this.userInfo = userInfo

                    this.fetchsumOrder() // get order sum

                    if (addressInfo.id == 0) {
                        this.$toast('请添加地址信息')
                        setTimeout(() => {
                            this.$router.push("/newContact")
                        }, 2000)
                    }

                    // if (this.UserAddressList.length == 0) {
                    //     this.$toast('请添加地址信息')
                    //     setTimeout(() => {
                    //         this.$router.push("/newContact")
                    //     }, 2000)
                    // }

                    await this.fetchgetAddressList() // get address list

                }
            } catch (error) {
                this.$toast('获取订单信息失败')
                console.error(error)
            }
        },

        // 获取订单优惠券
        async fetchgetOrderCoupons() {
            try {
                const res = await getOrderCoupons(this.$route.query.ids)
              
                if (res.data) {
                    this.availableCoupons = res.data.data
                }
            } catch (error) {
                this.$toast('获取优惠券失败')
                console.error(error)
            }
        },

        // 选择优惠券
        handelchoseOrderCoupons(data) {
            this.isCouponPopupVisible = false
            this.availableCouponsInFo = data
            this.fetchsumOrder()
        },

        // 计算订单金额
        async fetchsumOrder() {
            console.log("计算订单金额")
            try {
                if (!this.addressInfo) return

                const params = {
                    key: this.UserOrderKey,
                    addressId: this.addressInfo.id,
                    couponId: this.availableCouponsInFo?.id || null,
                    payType: this.paymentMethod, // 使用选择的支付方式,
                    shipping_type: 1, // 1: 快递 2: 自提
                }

                const res = await getOrderSum(params)
             
                console.log("计算订单金额数：", res.data)
                if (res.data) {
                    console.log("计算订单金额数：", res.data)
                    this.priceInfo = res.data.data
                    this.loading = true
                }
            } catch (error) {
                this.$toast('计算订单金额失败')
                console.error(error)
            }
        },

        // 提交订单
        async HandelcreateOrderClirk() {
            try {
                // !this.addressInfo ? (this.$toast('请您添加地址信息！'), false) : true
                if (!this.addressInfo) {
                    this.$toast('请您添加地址信息！')
                    return
                }

                const params = {
                    key: this.UserOrderKey,
                    addressId: this.addressInfo.id,
                    couponId: this.availableCouponsInFo?.id || 0,
                    from: 'h5',
                    mark: this.remark,// 备注
                    useIntegral: this.enableIntegral ? 1 : 0,
                    payType: this.enableIntegral ? 'integral' : 'yue',
                    shippingType: 1,
                    pinkId: 0,
                }

                const res = await createOrder(params)
                if (res.status === 200) {
                    this.$router.push('/paySuccess')
                }
            } catch (error) {
                this.$toast('提交订单失败')
                console.error(error)
            }
        },
        // add address
        handelAddaddressClick() {
            this.$router.push("/contactList")
        },

        //chose one address
        Chroreoneaddress(data) {
            this.isAddressPopupVisible = false
            this.addressInfo = data
            this.sumOrder()
        },
    },
}
</script>

<style lang="scss" scoped>
.payment-container {
    padding: 15px;
    background: #f7f8fa;

    .address-section {
        margin-bottom: 12px;
        border-radius: 8px;
        overflow: hidden;

        .address-name {
            font-size: 16px;
            font-weight: 500;
        }

        .address-phone {
            margin-left: 12px;
            color: #666;
        }

        .address-detail {
            color: #999;
            font-size: 14px;
        }
    }

    .address-popup {
        height: 40%;

        .add-contact {
            margin: 12px;
        }

        .contact-item {
            margin: 8px 12px;
            border-radius: 8px;
        }
    }

    .product-list {
        .product-card {
            margin-bottom: 12px;
            background: #fff;

            .price-wrapper {
                .currency {
                    font-size: 14px;
                    color: #ED6A0C;
                }

                .amount {
                    font-size: 16px;
                    color: #ED6A0C;
                    font-weight: 500;
                }
            }

            .sku-tag {
                margin-top: 4px;
            }
        }
    }

    .price-section {
        margin: 12px 0;
        border-radius: 8px;
        overflow: hidden;

        .price-item {
            background: #fff;
        }

        .remark-input {
            background: #fff;
        }
    }

    .payment-method {
        margin-top: 12px;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;

        .method-item {
            .method-name {
                font-size: 15px;
                font-weight: 500;
            }

            .balance-amount {
                color: #666;
            }

            .method-status {
                color: #999;
            }
        }
    }

    .submit-bar {
        :deep(.van-submit-bar__text) {
            font-size: 15px;
        }

        :deep(.van-submit-bar__button) {
            background: #ED6A0C;
        }
    }

    .coupon-popup {
        height: 30%;
        background: #f5f5f5;

        .discount {
            margin: 8px 12px;
            border-radius: 8px;
            background: #fff;
        }
    }
}

.coupon-price {
    color: #cccccc;
    font-size: 12px;
}

.coupon-expire {
    color: #ff5a5f;
    font-size: 14px;
}

.price-symbol {
    color: #ff5a5f;
    font-size: 12px;
}

.price-amount {
    color: #ff5a5f;
    font-size: 24px;
}

.coupon-condition {
    color: #cccccc;
    font-size: 12px;
}
</style>