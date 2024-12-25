<!-- 搜索页面优化后 -->
<template>
    <div class="search-container">
        <van-sticky :offset-top="0">
            <van-search v-model="value" background="red" shape="round" placeholder="请输入搜索关键词" @search="onSearch"
                @cancel="onCancel" />
        </van-sticky>

        <div class="search-section">
            <div>最近搜索：</div>
            <van-tag v-for="(item, index) in hKeyword" :key="index" @click="keyword(item)" color="#eeeeee"
                text-color="#333" size="large" class="search-tag">
                {{ item }}
            </van-tag>
        </div>

        <van-divider />

        <div class="search-section">
            <div>热门搜索：</div>
            <van-tag v-for="item in keyList" :key="item" @click="keyword(item)" color="#eeeeee" text-color="#b6b6b6"
                size="large" class="search-tag">
                {{ item }}
            </van-tag>
        </div>

        <div class="product-grid">
            <van-grid :column-num="2" :gutter="10">
                <van-grid-item v-for="(item, index) in productList" :key="index" :to="'/productDetails/?id=' + item.id">
                    <div class="product-card">
                        <van-image :src="imgUrls + item.image" class="product-image" />
                        <div class="product-info">
                            <div class="product-name">{{ item.storeName }}</div>
                            <div class="price-info">
                                <span class="current-price">￥{{ formatPrice(item.price) }}</span>
                                <span class="original-price">￥{{ formatPrice(item.otPrice) }}</span>
                            </div>
                        </div>
                    </div>
                </van-grid-item>
            </van-grid>
        </div>

        <van-empty v-if="productList.length < 1" image="error" description="没有搜到该商品,换个关键字试试吧!" />
    </div>
</template>

<script>
import {
    getSearchKeyword,
    products
} from "@/api/search.js"
export default {
    data() {
        return {
            value: '',
            keyList: [
                "111"
            ],
            imgUrls: this.$baseApi,
            productList: [
                {
                    id: 1,
                    image: "https://img.yzcdn.cn/public_files/2019/07/16/c5d5d9d5c7d5d9d5.jpg",
                    storeName: "商品名称1",
                    price: 100,
                    otPrice: 120

                }
            ],
            hKeyword: [
                "222"

            ] //搜索历史
        };
    },
    created() {
        this.getKeyword()
        this.getHkeyword() //获取历史记录

    },
    methods: {
        formatPrice(price) {
            return Number(price).toFixed(2)
        },
        keyword(data) {
            this.value = data
            this.onSearch(data)
        },
        //获取热门关键字
        getKeyword() {
            getSearchKeyword().then(res => {
                this.keyList = res.data
            })
        },
        onSearch(val) {
            products({
                keyword: val
            }).then(res => {
                this.updateSearchHistory(val)
                this.productList = res.data.content
            })
        },

        updateSearchHistory(val) {
            this.hKeyword = [val, ...this.hKeyword]
            this.hKeyword = [...new Set(this.hKeyword)]
            if (this.hKeyword.length > 10) {
                this.hKeyword = this.hKeyword.slice(0, 10)
            }
            const user = JSON.parse(sessionStorage.getItem("user"))
            if (user) {
                localStorage.setItem(user.username, this.hKeyword)
            }
        },
        //获取历史

        getHkeyword() {
            this.hKeyword = []
            const user = JSON.parse(sessionStorage.getItem("user"))
            if (user) {
                const history = localStorage.getItem(user.username)
                this.hKeyword = history ? history.split(',') : []
            }
        },
        onCancel() {
            this.$toast('取消')
        },
    },
};
</script>

<style scoped lang="less">
.search-container {
    min-height: 100vh;
    background-color: #fff;
}

.search-section {
    padding: 15px;

    .search-tag {
        margin: 5px;
    }
}

.product-grid {
    margin-top: 10px;
}

.product-card {
    width: 100%;
    padding: 8px;

    .product-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }

    .product-info {
        padding: 8px 0;

        .product-name {
            font-size: 14px;
            line-height: 1.4;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .price-info {
            display: flex;
            align-items: center;
            gap: 8px;

            .current-price {
                color: #ff8001;
                font-size: 16px;
                font-weight: bold;
            }

            .original-price {
                color: #C0C4CC;
                font-size: 12px;
                text-decoration: line-through;
            }
        }
    }
}
</style>
