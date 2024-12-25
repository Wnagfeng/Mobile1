<!-- 收藏和足迹未优化版本 -->
<template>
    <div class="warpper">
        <van-empty description="空空如也!" v-if="data.length < 1" />
        <div style="margin-top: 10px;" v-if="data.length > 0">
            <van-cell title=" " style="background-color: ;" :value="text"
                @click="isshow == true ? isshow = false : isshow = true; text == '管理' ? text = '取消' : text = '管理'" />
            <van-checkbox-group v-model="result" ref="checkboxGroup">
                <van-grid :column-num="2">
                    <van-grid-item v-for="(item, index) in data" :key="index">
                        <van-checkbox :name="item.pid" class="ckbox" @click="toggle(item.pid)" v-if="isshow">
                        </van-checkbox>
                        <router-link :to="'/productDetails?id=' + item.pid">
                            <van-image :src="imgUrls + item.image" width="165" height="150" />
                            <span>
                                <font size="2">{{ item.storeName }}</font>
                                <div style="height:8px;"></div>
                                <font size="4" color="#ff8001">￥{{ item.price }}</font>
                            </span>
                        </router-link>
                    </van-grid-item>
                </van-grid>
            </van-checkbox-group>
            <van-divider @click="move" v-if="data.length > 9">点击加载更多</van-divider>

            <van-submit-bar button-text="删除" @submit="onSubmit" v-if="isshow">
                <template #default>
                    <van-checkbox v-model="checked" style="margin-right: 48%;"
                        @click="toggleAll(ckAll == false ? true : false)">全选</van-checkbox>
                </template>
            </van-submit-bar>
        </div>

    </div>
</template>

<script>
import {
    getCollect,
    delCollects
} from "@/api/collect"
export default {
    data() {
        return {
            isshow: false,
            text: "管理",
            data: [],
            checked: 0,
            result: [],
            limit: 0,
            list: [],
            imgUrls: this.$baseApi,
            ckAll: false,
            value: 2,
        };
    },
    created() {
        this.move()
    },
    methods: {
        move() {
            this.limit += 10
            this.getData(this.limit)
        },
        getData(limit) {
            if (this.$route.query.type == "foot") {
                this.$route.meta.title = "我的足迹"
            } else {
                this.$route.meta.title = "我的收藏"
            }
            getCollect({
                type: this.$route.query.type,
                limit: limit
            }).then(res => {
                this.data = res.data
            })
        },
        //获取点击的name 复选框
        toggle(name) {
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i] == name) {
                    this.list.splice(i, 1);
                    name = null
                    return
                }
            }
            if (name != null) {
                this.list.push(name)
            }
        },
        //提交按钮
        onSubmit() {
            delCollects({
                category: this.$route.query.type,
                productIds: JSON.stringify(this.list).replace('[', '').replace(']', '')
            }).then(res => {
                this.$toast.success("删除成功！")
                this.getData();
            })
        },
        toggleAll(ckAll) {
            this.$refs.checkboxGroup.toggleAll(ckAll);
            this.ckAll = ckAll
            this.list = this.result
        },
    },
};
</script>

<style scoped>
.warpper {
    width: calc(100% - 10px);
    margin: 0 auto;
}

.van-grid-item /deep/.van-grid-item__content--center {
    align-items: flex-start;
    line-height: 20px;
}

.van-grid-item .van-image {
    margin-bottom: 8px;
}

.ckbox {
    top: 10px;
    position: absolute;
    z-index: 2;
}
</style>
