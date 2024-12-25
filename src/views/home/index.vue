<!-- home -->
<template>
    <div>
        <div class='warpper'>
            <van-sticky :offset-top='0'>
                <van-search background='#fff' shape='round' placeholder='请输入搜索关键词' @focus="onfocus" />
            </van-sticky>
            <!-- 搜索end -->
            <van-swipe :autoplay='3000' class='my-swipe' style='margin-top: 5px;'>
                <van-swipe-item v-for='(image, index) in slideshowList' :key='index'>
                    <!-- 替换url -->
                    <!-- <img v-lazy='imgUrls + image.pic' /> -->
                    <img :src='imgUrls + image.pic' />
                </van-swipe-item>
            </van-swipe>
            <!-- 轮播图end -->
            <div style='background-color: #FFFFFF;margin-top: 5px;'>
                <div style='margin-top: 5px;'>
                    <van-grid :column-num='4' :border='false'>
                        <template v-for='item in menus'>
                            <van-grid-item :to='item.url' v-bind:key='item.id'>
                                <!-- 替换url -->
                                <!-- <van-image width='50' height='50' :src='imgUrls + item.pic' /> -->
                                <van-image width='50' height='50' :src='item.pic' />
                                <span>
                                    <font size='3' color=''>{{ item.name }}</font>
                                </span>
                            </van-grid-item>
                        </template>
                    </van-grid>
                </div>
            </div>
            <!-- 宫格end -->
            <!--精品推荐：  -->
            <div style="width: 100%; background-color: #ffffff; margin-top: 10px">
                <div style="height: 28px; line-height: 35px; padding: 5px">
                    <font size="3">精品推荐：</font>
                </div>
                <div style="margin-top: 10px">
                    <van-grid :column-num="2" :border="false">
                        <van-grid-item v-for="(item, index) in bastList" :key="index"
                            :to="'/productDetails?id=' + item.id">
                            <!-- 替换url -->
                            <!-- <van-image :src="imgUrls + item.image" height="140" /> -->
                            <van-image :src="item.image" height="140" />
                            <span>
                                <font size="2">{{ item.storeName }}</font>
                            </span>
                            <span>
                                <font size="4" color="#ff8001">￥{{ item.price }}</font>
                                <font size="2" color="#C0C4CC" style="text-decoration: line-through">￥{{ item.otPrice }}
                                </font>
                            </span>
                        </van-grid-item>
                    </van-grid>
                </div>
            </div>
            <!-- 猜你喜欢 -->
            <div class="user_like">
                <div style="font-size: 14px">猜你喜欢:</div>
                <!-- 替换url -->
                <!-- <van-card v-for="item in userLike" @click="$router.push(`productDetails?id=${item.id}&integral=false`)"
                    :key="item.id" tag="Like" :desc="item.storeInfo" :title="item.storeName"
                    :thumb="$baseApi + item.image" :origin-price="item.otPrice">
                    <template #price> ￥{{ item.price }} </template>
                </van-card> -->
                <van-card v-for="item in userLike" @click="$router.push(`productDetails?id=${item.id}&integral=false`)"
                    :key="item.id" tag="Like" :desc="item.storeInfo" :title="item.storeName" :thumb="item.image"
                    :origin-price="item.otPrice">
                    <template #price> ￥{{ item.price }} </template>
                </van-card>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getMenus,
    getBanner,
    getBastList,
    getLike
} from '../../api/home'

export default {
    data() {
        return {
            imgUrls: this.$baseApi,
            // 菜单
            menus: [
                {
                    id: 1,
                    pic: "https://pic.616pic.com/ys_bnew_img/00/22/68/gHR9fEBhr0.jpg",
                    name: "全部商品",
                    url: "/productList"
                },
                {
                    id: 2,
                    pic: "https://bpic.588ku.com/element_water_img/19/06/07/a5d21d5f763a0f6c57c4dcff5602d5e0.jpg",
                    name: "优惠券",
                    url: ""
                },
                {
                    id: 3,
                    pic: "https://bpic.588ku.com/element_origin_min_pic/19/06/15/5c9393a9511bf93624249c6eb1f93b5a.jpg",
                    name: "积分商品",
                    url: ""
                },
                {
                    id: 4,
                    pic: 'https://img.ixintu.com/download/jpg/20201126/2a2733242dd9eda5472cd7b41ec2e9fa_512_512.jpg!con',
                    name: "积分签到",
                    url: ""
                }
            ],
            // 轮播图
            slideshowList: [
                {
                    id: 1,
                    pic: "https://tse3-mm.cn.bing.net/th/id/OIP-C.azIej7bJLFwzUlD5Mb939gHaEK?rs=1&pid=ImgDetMain",
                },
                {
                    id: 2,
                    pic: "https://images.macrumors.com/t/-86QKkSqWCGpAXbijvH2_86xcnE=/2500x0/filters:no_upscale()/article-new/2022/01/iPhone-14-Mock-pill-and-hole-thumb.jpg"
                },
                {
                    id: 3,
                    pic: "https://cdn.wccftech.com/wp-content/uploads/2024/02/iPHone-16-Pro-Max-title-1-728x388.jpg"
                }
            ],
            // 精品推荐
            bastList: [
                {
                    id: 1,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                },
                {
                    id: 2,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                },
                {
                    id: 3,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                },
                {
                    id: 4,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                },
                {
                    id: 5,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                },
                {
                    id: 6,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                }
            ],
            // 猜你喜欢
            userLike: [
                {
                    id: 1,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                    storeInfo: "苹果官方旗舰店"
                },
                {
                    id: 2,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                    storeInfo: "苹果官方旗舰店"
                },
                {
                    id: 3,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                    storeInfo: "苹果官方旗舰店"
                },
                {
                    id: 4,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                    storeInfo: "苹果官方旗舰店"
                },
                {
                    id: 5,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                    storeInfo: "苹果官方旗舰店"
                },
                {
                    id: 6,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                    storeInfo: "苹果官方旗舰店"
                }
            ]
        }
    },
    created() {
        // this.getData()
        console.log("this.$baseApi", this.$baseApi)
    },
    methods: {
        getData() {
            console.log("BaseUrl", this.$baseApi)
            getMenus().then(res => {
                this.menus = res.data
            })
            getBanner().then(res => {
                this.slideshowList = res.data
            })
            getBastList().then(res => {
                this.bastList = res.data
            })
            getLike().then(res => {
                this.userLike = res.data
            })
        },
        // 搜索
        onfocus() {
            this.$router.push('/search')
        }
    }
}
</script>
<style lang='scss' scoped>
.warpper {
    background-color: #F8F8F8;
    padding: 5px;
    padding-bottom: 130px;
}

.my-swipe .van-swipe-item img {
    width: 100%;
    height: 200px;
}

.my-swipe {
    margin-top: 5px;
    margin-bottom: 7px;
    height: 180px;
}

// 滚动条
.item {
    margin: 5px;
    width: 31.3%;
    white-space: nowrap;
    display: inline-block;
}

.scroll {
    padding: 5px;
    margin-top: 8px;
    background-color: #fff;
    text-align: center;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
}

::-webkit-scrollbar {
    display: none;
}

// 滚动条
.grid2 /deep/ .van-hairline {
    align-items: flex-start;
}

.grid2 {
    background-color: #f8f8f8;
    margin-top: 8px;
}

.colon {
    display: inline-block;
    margin: 0 4px;
    color: #ee0a24;
}

.block {
    display: inline-block;
    margin-left: 8px;
    height: 18px;
    width: 18px;
    color: #fff;
    font-size: 5px;
    text-align: center;
    background-color: #ff8001;
}

.classifys {
    height: 35px;
    line-height: 35px;
    padding: 15px;
}

.activity {
    background-color: #ffffff;
    margin-top: 10px;
    padding: 5px;
}

.activity-col {
    padding: 10px;
    background-color: #ffe3ce;
}

.user_like {
    box-sizing: border-box;
    padding: 5px;
    margin-top: 10px;
    background-color: white;

    >div {
        background-color: white;
    }

    /deep/ .van-card__price {
        color: #ed6a0c;
        font-size: 16px;
    }
}
</style>