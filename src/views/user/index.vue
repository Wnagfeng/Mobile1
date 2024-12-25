<template>
    <div>
        <div class="top-1">
            <van-row>
                <van-col span="24">
                    <van-icon name="setting-o" size="30" color="#ffffff" style="float: right;margin: 3px;" />
                </van-col>
                <van-col span="24">
                    <van-image style="float: left;margin-bottom: 60px;" round fit="cover" alt="头像" width="100px"
                        height="100px" :src="imgUrls + '/file/' + getUserInfo.avatar" :alt="getUserInfo.nickname">
                        <template v-slot:error>{{ getUserInfo.nickname }}</template>
                    </van-image>
                    <span class="tit">
                        <font size="4" v-if="getUserInfo">{{ getUserInfo.nickname }}</font>
                        <font size="4" v-else>登录/注册</font>
                    </span>
                </van-col>
                <div class="tab">
                    <div>
                        <span>
                            <font color="#ee436a" size="4">{{ getUserInfo.nowMoney }}</font>
                        </span></br>
                        <span>
                            <font color="#F8F6FC">余额</font>
                        </span>
                    </div>
                    <div>
                        <span>
                            <font color="#ee436a" size="4">{{ getUserInfo.couponCount }}</font>
                        </span></br>
                        <span>
                            <font color="#F8F6FC">优惠券</font>
                        </span>
                    </div>
                    <div>
                        <span>
                            <font color="#ee436a" size="4">{{ getUserInfo.payCount }}</font>
                        </span></br>
                        <span>
                            <font color="#F8F6FC">购买数</font>
                        </span>
                    </div>
                    <div>
                        <span>
                            <font color="#ee436a" size="4">{{ getUserInfo.integral }}</font>
                        </span></br>
                        <span>
                            <font color="#F8F6FC">积分</font>
                        </span>
                    </div>
                </div>
            </van-row>
        </div>
        <div class="grid">
            <van-grid :column-num="5" square :border="false">
                <van-grid-item to="/orderSatus?type=0">
                    <van-icon name="shop-o" size="30" />
                    <span>
                        <font size="2">未支付</font>
                    </span>
                </van-grid-item>
                <van-grid-item to="/orderSatus?type=1">
                    <van-icon name="logistics" size="30" />
                    <span>
                        <font size="2">待发货</font>
                    </span>
                </van-grid-item>
                <van-grid-item to="/orderSatus?type=2">
                    <van-icon name="goods-collect-o" size="30" />
                    <span>
                        <font size="2">待收货</font>
                    </span>
                </van-grid-item>
                <van-grid-item to="/orderSatus?type=3">
                    <van-icon name="cart-o" size="30" />
                    <span>
                        <font size="2">待评价</font>
                    </span>
                </van-grid-item>
                <van-grid-item to="/orderSatus?type=4">
                    <van-icon name="cart-o" size="30" />
                    <span>
                        <font size="2">已完成</font>
                    </span>
                </van-grid-item>
            </van-grid>
        </div>
        <div class="info">
            <van-cell is-link title="地址管理" icon="location" to="/contactList" />
            <van-cell is-link title="我的钱包" icon="paid" to="/wallet" />
            <van-cell is-link title="我的收藏" icon="goods-collect" to="/collect?type=collect" />
            <van-cell is-link title="我的足迹" icon="underway" to="/collect?type=foot" />
            <van-cell is-link title="消费分析" icon="balance-list" to="/analysis" />
            <van-cell is-link title="修改密码" icon="setting" to="/rpwd" />

            <van-button block type="danger" style="margin-top: 15px;" @click="logout">退出登录</van-button>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import {
    getUserInfo,
    loginOut
} from "@/api/login.js"
export default {
    data() {
        return {
            getUserInfo: {},
            imgUrls: this.$baseApi
        };
    },
    created() {
        this.getUser()
    },
    methods: {
        getUser() {
            getUserInfo().then(res => {
                this.getUserInfo = res.data
            })
        },
        logout() {
            loginOut().then(res => {

                this.$router.push("/login")
                Cookies.set("Token", "", -1)
                sessionStorage.clear();
            })
        }

    },
}
</script>

<style scoped>
.top-1 {
    background-image: url(../../static/userBg.png);
    padding: 15px;
    border-bottom-right-radius: 16%;
    border-bottom-left-radius: 16%;
    position: relative;
}

.tit {
    color: #E4E7ED;
    display: block;
    height: 100%;
    float: left;
    line-height: 100px;
    margin-left: 20px;
}

.tab {
    position: absolute;
    background-color: #4399FC;
    height: 60px;
    width: calc(100% - 30px);
    line-height: 23px;
    border-radius: 5px;
    background-color: #3e171f;
    bottom: 0px;
}

.tab div {
    text-align: center;
    margin-top: 8px;
    width: 25%;
    float: left;
}

.grid {
    width: calc(100% - 30px);
    background-color: #ffffff;
    margin: 15px auto;
}

.info {
    width: calc(100% - 30px);
    margin: 0 auto;
}

.info /deep/ .van-icon-gold-coin {
    color: #e07472;
}

.info /deep/ .van-icon-location {
    color: #5fcda2;
}

.info /deep/ .van-icon-gem {
    color: #9789f7;
}

.info /deep/ .van-icon-coupon {
    color: #ee883b;
}

.info /deep/ .van-icon-goods-collect {
    color: #54b4ef;
}

.info /deep/ .van-icon-setting {
    color: #e07472;
}

.info /deep/ .van-icon-paid {
    color: #f8807e;
}

.info /deep/ .van-icon-underway {
    color: #f8807e;
}
</style>
