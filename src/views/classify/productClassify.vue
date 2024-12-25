<!-- 商品分类原版 -->
<template>
    <div style="margin-top: 10px;">
        <div class="va"></div>
        <van-row gutter="10">
            <van-col span="8" style="min-height: 300px;background-color: #fff;">
                <van-cell v-for="(item, index) in list" :title="item.cateName" :key="index"
                    @click="navclick(item.id, index)" :class="{ active: index == isActive }" />
            </van-col>
            <van-col span="15" style="min-height: 300px;background-color: #fff;margin-left:4px;">
                <van-grid :column-num="3" class="classify" :border="false">
                    <template v-for="(item, index) in data" v-if="data.length > 0">
                        <van-grid-item :to="'/ProductList?sid=' + item.id">
                            <van-image :src="imgUrls + item.pic" round />
                            <span>
                                <font size="2" color="">{{ item.cateName }}</font>
                            </span>
                        </van-grid-item>
                    </template>
                </van-grid>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import {
    getData
} from "@/api/productClassify.js"
export default {
    data() {
        return {
            activeIds: 1,
            style: null,
            list: [],
            isActive: false,
            active: 0,
            data: [],
            imgUrls: this.$baseApi,
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            getData().then(res => {
                this.list = res.data
                this.navclick(this.list[0].id)
            })
        },
        //获取右侧选中的商品的数据
        getItem(data) {
            this.$router.push({
                name: 'ProductList',
                query: {
                    sid: data.id
                }
            });
        },
        navclick(data, index) {
            this.isActive = index;
            let list = []
            this.list.forEach(r => {
                r.children.forEach(res => {
                    if (res.pid == data) {
                        list.push(res)
                    }
                })
            })
            this.data = list
        },

    }
};
</script>

<style scoped>
.va {
    background-color: #ffffff;
    height: 92%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;

}

.active /deep/ .van-cell__title span {
    padding-left: 5px;
    border-left: 4px solid #ff6634;

}
</style>
