<!-- 商品分类优化版本 -->
<template>
    <div class="category-container">
        <van-row>
            <!-- 左侧分类列表 -->
            <van-col span="8">
                <van-cell v-for="(item, index) in list" :key="item.id" :title="item.cateName"
                    :class="{ active: index === activeIndex }" @click="handleCategoryClick(item.id, index)" />
            </van-col>

            <!-- 右侧商品网格 -->
            <van-col span="16">
                <van-grid :column-num="3" :border="false">
                    <van-grid-item v-for="item in subCategories" :key="item.id" :to="`/ProductList?sid=${item.id}`">
                        <!-- 替换url -->
                        <!-- <van-image :src="imgUrls + item.pic" round /> -->
                        <van-image :src="item.pic" round />
                        <div class="item-name">{{ item.cateName }}</div>
                    </van-grid-item>
                </van-grid>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import { getData } from "@/api/productClassify.js"

export default {
    data() {
        return {
            list: [],
            subCategories: [],
            activeIndex: 0,
            imgUrls: this.$baseApi,
        }
    },

    created() {
        this.fetchCategories()
    },

    methods: {
        async fetchCategories() {
            const res = await getData()
            this.list = res.data
            if (this.list.length) {
                this.handleCategoryClick(this.list[0].id, 0)
            }
        },

        handleCategoryClick(categoryId, index) {
            // 更新激活的索引，用于控制左侧菜单项的选中状态样式
            this.activeIndex = index;

            // 获取并更新右侧子分类数据
            const selectedCategory = this.list.find(item => item.id === categoryId);
            this.subCategories = selectedCategory ? selectedCategory.children : [];
        }
    }
}
</script>

<style scoped>
.category-container {
    background: #fff;
    min-height: 300px;
}

.active {
    position: relative;
    font-weight: bold;
}

.van-cell {
    position: relative;
    padding: 10px 16px !important;
    padding-left: 28px !important;
    /* 预留左侧指示条的位置 */
    line-height: 24px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.active::before {
    content: '';
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background-color: #ff6634;
}

.item-name {
    font-size: 14px;
    margin-top: 4px;
}
</style>