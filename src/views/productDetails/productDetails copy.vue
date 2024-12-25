<!-- 商品详情优化版本  -->
<template>
    <div class="goods-detail-wrapper">
        <van-swipe @change="handleSwipeChange">
            <van-swipe-item v-for="(image, index) in product.sliderImageArr" :key="index">
                <van-image fit="scale-down" :src="image" width="100%" />
            </van-swipe-item>
            <template #indicator>
                <div class="swipe-indicator" v-if="product.sliderImageArr">
                    {{ currentSwipe + 1 }}/{{ product.sliderImageArr.length }}
                </div>
            </template>
        </van-swipe>
        <van-row>
            <van-col span="24" class="goods-info">
                <template v-if="isIntegralProduct">
                    <span class="fontColor" style=" font-size: 5px;">{{ product.integral }}积分</span>
                </template>
                <template v-else>
                    <span class="fontColor" style="font-size: 35px;">￥</span>
                    <span class="fontColor" style="font-size: 35px;">{{ product.price }}</span>
                </template>
                <div class="goods-stats">
                    <div class="stats-item">
                        {{ product.sales }}<br />
                        <span>销量</span>
                    </div>
                    <div class="stats-item">
                        {{ product.browse }}<br />
                        <span>浏览</span>
                    </div>
                </div>

                <div class="goods-title">
                    <span>{{ product.storeInfo }}</span>
                </div>
            </van-col>
            <van-col span="24" class="detail">
                <van-cell is-link @click="showSkuSelector = true" :value="selectedSkuText">
                    <template #title>
                        <span class="custom-title">选择规格：</span>
                    </template>
                </van-cell>
                <van-sku v-model="showSkuSelector" :sku="skuData" :goods="goodsData" :hide-stock="skuData.hide_stock"
                    @sku-selected="handleSkuSelect" @buy-clicked="handleBuyClick" @add-cart="handleAddToCart">
                    <template #sku-header-price="props">
                        <div class="goodsPrice">
                            <span v-if="isIntegralProduct">积分</span>
                            <span v-if="isIntegralProduct && props.selectedSkuComb">
                                {{ props.selectedSkuComb.integral }}
                            </span>
                            <span v-if="isIntegralProduct && !props.selectedSkuComb">
                                {{ props.price }}
                            </span>
                            <span v-if="!isIntegralProduct">￥</span>
                            <span style=" font-size: 30px;" v-if="!isIntegralProduct">{{ props.price }}</span>
                        </div>
                    </template>
                    <template #sku-actions="props" v-if="isIntegralProduct">
                        <div>
                            <van-button square size="large" type="warning" @click="props.skuEventBus.$emit('sku:buy')">
                                积分兑换
                            </van-button>
                        </div>
                    </template>
                </van-sku>
            </van-col>
            <van-col span="24" class="detail">
                <van-cell value="图文详情:" />
                <div class="ImgList" v-html="formatImageUrl(product.description)"></div>
            </van-col>
        </van-row>
        <van-goods-action>
            <van-goods-action-icon icon="cart-o" text="购物车" to="/cart" />
            <van-goods-action-icon @click="handleCollect" :icon="product.userCollect ? 'star' : 'star-o'"
                :text="product.userCollect ? '已收藏' : '收藏'" :color="product.userCollect ? '#ff5000' : ''" />
            <template v-if="!isIntegralProduct">
                <van-goods-action-button type="warning" text="加入购物车" @click="showSkuSelector = true" />
                <van-goods-action-button type="danger" text="立即购买" @click="showSkuSelector = true" />
            </template>
            <van-goods-action-button v-else type="danger" text="立即兑换" @click="showSkuSelector = true" />
        </van-goods-action>
    </div>
</template>

<script>
import { getProduct } from '../../api/product.js'
import { addCart } from '../../api/cart.js'
import { collect, delCollect } from '../../api/collect.js'
import Axios from 'axios';
export default {
    name: 'GoodsDetail',
    data() {
        return {
            currentSwipe: 0,
            replyCount: 0,
            reply: {},
            limit: 0,
            integral: 'false',
            showSkuSelector: false,
            selectedSkuText: '选择规格',
            imgBaseUrl: "https://tse3-mm.cn.bing.net/",//貌似这里需要手写 自己观察一下
            product: {},
            skuData: {
                tree: [],
                list: [],
                price: 0,
                none_sku: false,
                hide_stock: false
            },
            // 缩略图
            goodsData: {
                picture: ''
            }
        }
    },
    computed: {
        isIntegralProduct() {
            return this.integral === 'true'
        }
    },
    created() {
        this.integral = this.$route.query.integral === 'true'
        console.log('integral:', this.integral)
        console.log('integralRouter:', this.$route.query)
        this.initializeData()
    },
    methods: {
        // 初始化数据
        async initializeData() {
            await this.fetchProductData()
        },
        async fetchProductData() {
            try {
                const response = await getProduct(this.$route.query.id)
                if (response.status === 200) {
                    this.handleProductData(response.data)
                }
            } catch (error) {
                console.error('获取商品数据失败:', error)
            }
        },
        handleProductData(data) {
            const { storeInfo, reply, replyCount, productAttr, productValue } = data.data
            this.product = storeInfo
            this.reply = reply
            this.replyCount = replyCount
            this.skuData.stock_num = storeInfo.stock
            this.goodsData.picture = this.imgBaseUrl + storeInfo.image
            this.skuData.price = this.isIntegralProduct ? storeInfo.integral : storeInfo.price

            this.skuData.tree = []
            this.skuData.list = []
            this.buildSkuTree(productAttr)
            this.buildSkuList(productValue)
        },
        buildSkuTree(productAttr) {
            productAttr.forEach(item => {
                const treeNode = {
                    v: [],
                    k: item.attrName,
                    k_s: item.attrName
                }
                item.attrValueArr.forEach(att => {
                    treeNode.v.push({
                        id: att,
                        name: att
                    })
                })
                this.skuData.tree.push(treeNode)
            })
        },
        buildSkuList(productValue) {
            for (const key in productValue) {
                const item = productValue[key]
                const list = {}
                list.id = item.unique
                const sk = item.sku.split(',')
                this.skuData.tree.forEach((r, i) => {
                    list[r.k_s] = sk[i]
                })
                list.price = item.price * 100
                list.integral = item.integral
                list.stock_num = item.stock
                this.skuData.list.push(list)
            }
        },
        handleSwipeChange(index) {
            this.currentSwipe = index
        },
        async handleCollect() {
            const isCollected = this.product.userCollect
            const params = {
                id: this.$route.query.id,
                category: 'collect'
            }

            try {
                const response = await (isCollected ? delCollect(params) : collect(params))
                if (response.status === 200) {
                    this.product.userCollect = !isCollected
                    if (!isCollected) {
                        this.$toast.success('收藏成功')
                    }
                }
            } catch (error) {
                console.error('收藏操作失败:', error)
            }
        },
        handleSkuSelect(skuData) {
            let list = ''
            this.skuData.tree.forEach(res => {
                for (const value in skuData.selectedSkuComb) {
                    if (res.k === value) {
                        list = list + skuData.selectedSkuComb[value]
                    }
                }
            })
            this.selectedSkuText = list
        },
        async handleBuyClick(data) {
            console.log("cartNum", data.selectedNum)
            console.log("productId", this.$route.query.id)
            console.log("uniqueId", data.selectedSkuComb.id)

            // 需要先加入购物车然后再去购买
            addCart({
                cartNum: data.selectedNum,
                productId: this.$route.query.id,
                uniqueId: data.selectedSkuComb.id,
                new: 0,
            }).then(res => {
                if (res.status == 200) {
                    if (this.integral == 'true') {
                        this.$router.push({
                            name: 'createOrder',
                            query: {
                                ids: res.data.cartId,
                                integral: 1
                            }
                        });
                    } else {
                        this.$router.push({
                            name: 'createOrder',
                            query: {
                                ids: res.data.cartId,
                                integral: 0
                            }
                        });
                    }
                }
            })
        },
        async handleAddToCart(data) {
            try {
                const cartData = {
                    cartNum: data.selectedNum,
                    productId: this.$route.query.id,
                    uniqueId: data.selectedSkuComb.id,
                    new: 0
                }

                const response = await addCart(cartData)
                if (response.status === 200) {
                    this.$toast.success('加入购物车成功！')
                    this.showSkuSelector = false
                }
            } catch (error) {
                console.error('加入购物车失败:', error)
            }
        },
        formatImageUrl(htmlContent) {
            if (!htmlContent) return ''
            const imgPattern = /src=['"]([^'"]+)['"]/g
            return htmlContent.replace(imgPattern, (match, src) => {
                // 如果已经是完整的URL，直接返回
                if (src.startsWith('http://') || src.startsWith('https://')) {
                    return match
                }
                if (src.startsWith('/')) {
                    const baseUrl = this.imgBaseUrl.endsWith('/')
                        ? this.imgBaseUrl.slice(0, -1)
                        : this.imgBaseUrl
                    return `src="${baseUrl}${src}"`
                }
                return `src="${this.imgBaseUrl}/${src}"`
            })
        }
    }
}

</script>

<style scoped>
.fontColor {
    color: #ff6700;
}

.goods-detail-wrapper {
    background-color: #f8f8f8;
    padding: 8px;
    padding-bottom: 50px;
}

.swipe-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    color: #ffffff;
}

.goods-info {
    margin-top: 10px;
    background-color: #ffffff;
    padding: 6px;
    border-radius: 8px;
}

.goods-stats {
    float: right;
    text-align: center;
    color: #909399;
    display: flex;
}

.stats-item {
    margin-right: 5px;
}

.goods-title {
    margin-top: 20px;
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

.ImgList {
    width: calc(100% - 30px);
    margin: 0 auto;
}

.ImgList /deep/ img {
    width: 100%;
}

.goodsPrice {
    color: red;
}
</style>