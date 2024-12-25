<!-- 商品详情未优化 -->
<template>
    <div class="warpper">
        <van-swipe @change="onChange">
            <van-swipe-item v-for="(item, index) in product.sliderImageArr" :key="index">
                <!-- 替换url -->
                <!-- <van-image fit="scale-down" :src="imgUrls + item" width="100%" /> -->
                <van-image fit="scale-down" :src="item" width="100%" />
            </van-swipe-item>
            <!-- 自定义指示器 -->
            <template #indicator>
                <div class="custom-indicator" v-if="product.sliderImageArr">
                    {{ current + 1 }}/{{ product.sliderImageArr.length }}
                </div>
            </template>
        </van-swipe>


        <!-- 详情图end -->
        <van-row>
            <van-col span="24" class="detail">
                <font size="4" color="#ED6A0C" v-if="integral == 'true'">{{ product.integral }}积分</font>
                <template v-else>
                    <font size="4" color="#ED6A0C">￥</font>
                    <font size="6" color="#ED6A0C">{{ product.price }}</font>
                </template>
                <div style="float: right; text-align: center; margin-right: 5px; color: #909399">
                    {{ product.sales }}<br />
                    <span>销量</span>
                </div>
                <div style="float: right; text-align: center; margin-right: 5px; color: #909399">
                    {{ product.browse }}<br />
                    <span>浏览</span>
                </div>
                <div>
                    <p>
                        {{ product.storeInfo }}
                    </p>
                </div>
            </van-col>
            <van-col span="24" class="detail">
                <!-- <van-cell title="选择规格：" value="内容" label="描述信息" /> -->
                <van-cell is-link @click="show = true" :value="skuValue">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                        <span class="custom-title">选择规格：</span>
                    </template>
                </van-cell>
                <van-sku v-model="show" :sku="sku" :goods="goods" :hide-stock="sku.hide_stock"
                    @sku-selected="onByselect" @buy-clicked="onBuyClicked" @add-cart="onAddCartClicked">
                    <template #sku-header-price="props">
                        <div class="van-sku__goods-price" @click="test(props)">
                            <span class="van-sku__price-symbol" v-if="integral == 'true'">积分</span>
                            <span class="van-sku__price-num" v-if="integral == 'true' && props.selectedSkuComb">{{
                                props.selectedSkuComb.integral
                                }}</span>
                            <span class="van-sku__price-num"
                                v-if="integral == 'true' && props.selectedSkuComb == null">{{
                                    props.price
                                }}</span>
                            <span class="van-sku__price-symbol" v-if="integral == 'false'">￥</span>
                            <span class="van-sku__price-num" v-if="integral == 'false'">{{ props.price }}</span>
                        </div>
                    </template>
                    <template #sku-actions="props">
                        <div class="van-sku-actions" v-if="integral == 'true'">
                            <van-button square size="large" type="warning" @click="props.skuEventBus.$emit('sku:buy')">
                                积分兑换
                            </van-button>
                        </div>
                    </template>
                </van-sku>
            </van-col>
            <van-col span="24" class="detail">
                <van-cell value="图文详情:" />
                <div class="disc" v-html="$options.filters.chageUrl(product.description, imgUrls)"></div>
            </van-col>
            <!-- 评论 -->
            <!-- 评论end -->
        </van-row>
        <!-- 商品信息end -->
        <van-goods-action>
            <van-goods-action-icon icon="cart-o" text="购物车" to="/cart" />
            <van-goods-action-icon @click="selectGoods" :icon="product.userCollect ? 'star' : 'star-o'"
                :text="product.userCollect ? '已收藏' : '收藏'" :color="product.userCollect ? '#ff5000' : ''" />
            <van-goods-action-button type="warning" text="加入购物车" @click="show = true" v-if="integral == 'false'" />
            <van-goods-action-button type="danger" text="立即购买" @click="show = true" v-if="integral == 'false'" />
            <van-goods-action-button type="danger" text="立即兑换" @click="show = true" v-if="integral == 'true'" />
        </van-goods-action>
    </div>
</template>

<script>
import { getProduct } from '../../api/product.js'
import { addCart } from '../../api/cart.js'
import { collect, delCollect } from '../../api/collect.js'
export default {
    data() {
        return {
            replyCount: 0, // 评论条数
            reply: {},
            current: 0,
            limit: 0, // 条数
            integral: 'false', // 是否为积分
            showList: false,
            skuValue: '选择规格',
            product: {
                sliderImageArr: [
                    "https://tse3-mm.cn.bing.net/th/id/OIP-C.azIej7bJLFwzUlD5Mb939gHaEK?rs=1&pid=ImgDetMain",
                    "https://images.macrumors.com/t/-86QKkSqWCGpAXbijvH2_86xcnE=/2500x0/filters:no_upscale()/article-new/2022/01/iPhone-14-Mock-pill-and-hole-thumb.jpg",
                    "https://cdn.wccftech.com/wp-content/uploads/2024/02/iPHone-16-Pro-Max-title-1-728x388.jpg"
                ],
                integral: 100,
                price: 1999,
                sales: 100,
                browse: 99,
                storeInfo: "iPhone 16 Pro Max",
                description: "<img src='https://tse3-mm.cn.bing.net/th/id/OIP-C.1qr_4WiuuDW1P69jdMb8PQHaHa?rs=1&pid=ImgDetMain'></img><img src='https://tse3-mm.cn.bing.net/th/id/OIP-C.1qr_4WiuuDW1P69jdMb8PQHaHa?rs=1&pid=ImgDetMain'></img><img src='https://tse3-mm.cn.bing.net/th/id/OIP-C.1qr_4WiuuDW1P69jdMb8PQHaHa?rs=1&pid=ImgDetMain'></img><img src='https://tse3-mm.cn.bing.net/th/id/OIP-C.1qr_4WiuuDW1P69jdMb8PQHaHa?rs=1&pid=ImgDetMain'></img>",
                userCollect: false,// 是否收藏
            }, // 商品信息
            chosenCoupon: -1,
            show: false,//控制sku的显隐
            sku: {
                // 数据结构见下方文档
                tree: [
                    {
                        "v": [
                            {
                                "id": "8GB+256GB",
                                "name": "8GB+256GB"
                            },
                            {
                                "id": "12GB+512GB",
                                "name": "12GB+512GB"
                            }
                        ],
                        "k": "内存容量",
                        "k_s": "内存容量"
                    },
                    {
                        "v": [
                            {
                                "id": "黑色",
                                "name": "黑色"
                            },
                            {
                                "id": "白色",
                                "name": "白色"
                            }
                        ],
                        "k": "颜色",
                        "k_s": "颜色"
                    }
                ],
                // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
                list: [
                    {
                        "id": "1001",
                        "内存容量": "8GB+256GB",
                        "颜色": "黑色",
                        "price": 199900,
                        "integral": 500,
                        "stock_num": 50
                    },
                    {
                        "id": "1002",
                        "内存容量": "12GB+512GB",
                        "颜色": "白色",
                        "price": 299900,
                        "integral": 700,
                        "stock_num": 50
                    }
                ],

                price: '1999', // 默认价格（单位元）
                none_sku: false, // 是否无规格商品
                hide_stock: false // 是否隐藏剩余库存
            },
            goods: {
                // 默认商品 sku 缩略图
                picture: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.azIej7bJLFwzUlD5Mb939gHaEK?rs=1&pid=ImgDetMain'
            },
            imgUrls: "/api"
        }
    },
    created() {
        this.initPageData()//初始化数据与页面
        console.log("11111111", this.$route.query)
        if (this.$route.query.integral) {
            this.integral = this.$route.query.integral

        }
    },
    filters: {
        // 处理图片url
        chageUrl: function (htmlContent, baseUrl) {
            if (htmlContent) {
                var matchedImages = htmlContent
                var vueInstance = this
                // 匹配需要替换的url
                var imgPattern = /<img [^>]*src=['"]([^'"]+)[^>]*>/g
                var matchedStrings = matchedImages.match(imgPattern)
            }
            if (matchedStrings != null) {
                for (var i = 0; i < matchedStrings.length; i++) {
                    var imageSrc = matchedStrings[i].replace(imgPattern, '$1').replace(/\s+/g, '')
                    matchedImages = matchedImages.replace(new RegExp(imageSrc, 'g'), baseUrl + imageSrc)
                }
            }
            console.log(matchedImages)
            return matchedImages

        }
    },
    methods: {
        // 收藏请求
        selectGoods() {
            // 判断是否以及收藏了
            const data = this.product.userCollect
            console.log("收藏了吗:", data)
            const params = {
                id: this.$route.query.id,
                category: 'collect'
            }
            console.log("Collect params:", params)
            const callback = !data ? collect(params) : delCollect(params)
            callback.then(res => {
                if (res.status === 200) {
                    this.product.userCollect = !data
                    if (!data) this.$toast.success('收藏成功')
                }
            })
        },
        // 轮播图change事件
        onChange(index) {
            this.current = index
        },
        // 初始化数据和页面标题
        initPageData() {
            getProduct(this.$route.query.id).then(res => {
                console.log(res)
                console.log("商品属性", res.data.productValue)
                if (res.status == 200) {
                    // 基础数据的赋值
                    this.product = res.data.storeInfo // 商品信息
                    this.reply = res.data.reply // 商品评论
                    this.replyCount = res.data.replyCount// 评论条数
                    this.sku.stock_num = res.data.storeInfo.stock// 库存
                    this.goods.picture = this.imgUrls + res.data.storeInfo.image// 商品缩略图
                    // 处理是否为积分商品
                    if (this.integral == 'true') {
                        this.sku.price = res.data.storeInfo.integral
                    } else {
                        this.sku.price = res.data.storeInfo.price
                    }
                    // 处理商品属性sku的树形结构
                    res.data.productAttr.forEach((item, index) => {
                        const treeMap = {
                            v: []
                        }
                        treeMap.k = item.attrName
                        treeMap.k_s = item.attrName

                        item.attrValueArr.forEach((att, i) => {
                            const v = {}
                            v.id = att
                            v.name = att
                            treeMap.v.push(v)
                        })
                        this.sku.tree.push(treeMap)
                    })
                    // 处理商品属性sku的列表结构
                    for (const value in res.data.productValue) {
                        const list = {}
                        list.id = res.data.productValue[value].unique
                        const sk = res.data.productValue[value].sku.split(',')
                        for (const values in res.data.productValue) {
                            this.sku.tree.forEach((r, i) => {
                                list[r.k_s] = sk[i]
                            })
                        }
                        list.price = res.data.productValue[value].price * 100
                        list.integral = res.data.productValue[value].integral
                        list.stock_num = res.data.productValue[value].stock
                        this.sku.list.push(list)
                        console.log("处理后的列表",list)
                    }
                }
            })
            // 处理路由标题
            if (this.$route.query.integral == true) {
                this.$route.meta.title = '积分商品兑换'
                this.integral = 'true'
            } else {
                this.$route.meta.title = '商品详情'
                this.integral = 'false'
            }
        },
        onBuyClicked(data) {
            // 测试跳转 这行需要删除
            this.$router.push({
                name: 'createOrder',
                query: {
                    ids: 1,
                    integral: 0
                }
            })
            // addCart({
            //     cartNum: data.selectedNum,
            //     productId: this.$route.query.id,
            //     uniqueId: data.selectedSkuComb.id,//skulist里面的套餐的唯一id
            //     new: 0
            // }).then(res => {
            //     if (res.status == 200) {
            //         if (this.integral == 'true') {
            //             this.$router.push({
            //                 name: 'createOrder',
            //                 query: {
            //                     ids: res.data.cartId,
            //                     integral: 1
            //                 }
            //             })
            //         } else {
            //             this.$router.push({
            //                 name: 'createOrder',
            //                 query: {
            //                     ids: res.data.cartId,
            //                     integral: 0
            //                 }
            //             })
            //         }
            //     }
            // })
        },
        // 处理选择规格
        onByselect(skuValue) {
            console.log(skuValue)
            let list = ''
            this.sku.tree.forEach(res => {
                for (const value in skuValue.selectedSkuComb) {
                    if (res.k == value) {
                        list = list + skuValue.selectedSkuComb[value]
                    }
                }
            })
            this.skuValue = list
        },
        // 加入购物车
        onAddCartClicked(data) {
            addCart({
                cartNum: data.selectedNum,
                productId: this.$route.query.id,
                uniqueId: data.selectedSkuComb.id,
                new: 0
            }).then(res => {
                if (res.status == 200) {
                    this.$toast.success('加入购物车成功！')
                    this.show = false
                }
            })
        }
    }
}
</script>

<style scoped>
.disc {
    width: calc(100% - 30px);
    margin: 0 auto;
}

.disc /deep/ img {
    width: 100%;
}

.custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    color: #ffffff;
}

.warpper {
    background-color: #f8f8f8;
    padding: 8px;
    padding-bottom: 50px;
}

.img {
    width: 60px;
    height: 60px;
    margin: 10px;
}

.detail {
    margin-top: 10px;
    background-color: #ffffff;
    padding: 6px;
    border-radius: 8px;
}

.custom-title {
    margin: 8px;
}
</style>