<!-- 商品列表优化后 -->
<template>
    <div class="product-list">
        <!-- 标签栏 -->
        <van-sticky :offset-top="10">
            <van-tabs sticky title-active-color="red" color="#fff" @click="handleTabClick">
                <van-tab title="综合" name="comprehensive" />
                <van-tab name="price">
                    <template #title>
                        价格
                        <van-icon name="sort" />
                    </template>
                </van-tab>
                <van-tab title="新品" name="new" />
            </van-tabs>
        </van-sticky>

        <!-- 空状态展示 -->
        <van-empty v-if="list.length < 1" description="空空如也!" />

        <!-- 商品列表 -->
        <div class="product-grid">
            <van-grid :column-num="2" :gutter="10">
                <van-grid-item v-for="item in list" :key="item.id"
                    :to="`/productDetails?id=${item.id}&integral=${integral}`">
                    <van-image :src="imgUrls + item.image" height="140" />
                    <div class="product-info">
                        <div class="product-name">{{ item.storeName }}</div>
                        <div class="product-price" :class="{ 'integral-price': integral }">
                            {{ integral ? `${item.integral}积分` : `￥${item.price}` }}
                        </div>
                    </div>
                </van-grid-item>
            </van-grid>

            <!-- 加载更多按钮 -->
            <div v-if="list.length > 9" class="load-more" @click="loadMore">
                点击加载更多
            </div>
        </div>
    </div>
</template>

<script>
import { getProductList } from "../../api/product.js"

export default {
    data() {
        return {
            integral: false,
            list: [

            ],
            imgUrls: this.$baseApi,
            priceSort: 'desc',
            pageSize: 10,
            currentFilter: {
                type: null,
                value: null
            }
        }
    },

    created() {
        this.fetchProducts()
        // 添加标题处理
        if (this.$route.query.integral) {
            this.$route.meta.title = "积分商品"
            this.integral = true
        } else {
            this.$route.meta.title = "商品列表"
            this.integral = false
        }
    },

    methods: {
        async fetchProducts() {
            const params = {
                sid: this.$route.query.sid || '',
                isIntegral: this.$route.query.integral ? 1 : 0,
                limit: this.pageSize,
                [this.currentFilter.type]: this.currentFilter.value
            }

            try {
                const res = await getProductList(params)
                this.list = res.data.content
            } catch (error) {
                console.error('获取商品列表失败:', error)
            }
        },

        loadMore() {
            this.pageSize += 10
            this.fetchProducts()
        },

        handleTabClick(name) {
            console.log("获取数据去了")
            switch (name) {
                case 'comprehensive':
                    this.updateFilter(null, null)
                    break
                case 'price':
                    this.priceSort = this.priceSort === 'desc' ? 'asc' : 'desc'
                    this.updateFilter('priceOrder', this.priceSort)
                    break
                case 'new':
                    this.updateFilter('news', 1)
                    break
            }
        },

        updateFilter(type, value) {
            this.pageSize = 10
            this.currentFilter = { type, value }
            this.fetchProducts()
        }
    }
}
</script>

<style scoped>
.product-list {
    background-color: #F8F8F8;
    padding: 5px 5px 70px;
}

.product-grid {
    margin-top: 10px;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.product-name {
    font-size: 14px;
    color: #333;
}

.product-price {
    font-size: 16px;
    color: #ff8001;
    font-weight: bold;
}

.load-more {
    margin-top: 15px;
    text-align: center;
    color: #333;
    padding: 10px;
    cursor: pointer;
}
</style>