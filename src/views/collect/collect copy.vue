<!-- 收藏和足迹优化版本 -->
<template>
    <div class="collection-wrapper">

        <van-empty description="空空如也!" v-if="productList.length < 1" />
        <div class="collection-container" v-if="productList.length > 0">
            <van-cell title=" " :value="managementText"
                @click="isManageMode == true ? isManageMode = false : isManageMode = true; managementText == '管理' ? managementText = '取消' : managementText = '管理'" />
            <van-checkbox-group v-model="selectedItems" ref="checkboxGroup">
                <van-grid :column-num="2">
                    <van-grid-item v-for="(item, index) in productList" :key="index">
                        <van-checkbox :name="item.pid" class="collection-checkbox" @click="handleToggleItem(item.pid)"
                            v-if="isManageMode">
                        </van-checkbox>
                        <router-link :to="'/productDetails?id=' + item.pid">
                            <van-image :src="baseImageUrl + item.image" class="collection-image" width="165"
                                height="150" />
                            <span class="collection-item-content">
                                <span>{{ item.storeName }}</span>

                                <div class="collection-price-spacing"></div>
                                <span style="color: #ff6700;">￥{{ item.price }}</span>

                            </span>
                        </router-link>
                    </van-grid-item>
                </van-grid>
            </van-checkbox-group>
            <van-divider @click="handleLoadMore" v-if="productList.length > 9">点击加载更多</van-divider>

            <van-submit-bar button-text="删除" @submit="handleSubmitDelete" v-if="isManageMode">
                <template #default>
                    <van-checkbox v-model="isChecked" class="collection-select-all" :value="isAllSelected"
                        @click="handleToggleAll(isSelectAll == false ? true : false)">全选</van-checkbox>
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
    name: 'CollectionPage',
    data() {
        return {
            isManageMode: false,
            managementText: "管理",
            productList: [
                {
                    pid: 1,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                },
                {
                    pid: 2,
                    image: "https://ts1.cn.mm.bing.net/th/id/R-C.0bb5b865aac87f09eda036384bee5335?rik=F2SVhS8ESYTDXA&riu=http%3a%2f%2fk.sinaimg.cn%2fn%2fsinakd20231130ac%2f178%2fw822h956%2f20231130%2f8ab0-7cac5b733beb2a6372b587707f2be3dc.jpg%2fw700d1q75cms.jpg%3fby%3dcms_fixed_width&ehk=xP2eCjeI4qfzndnq3BykPRCveOPhZWjImWQROlekSGg%3d&risl=&pid=ImgRaw&r=0",
                    storeName: "iPhone 16 Pro Max",
                    price: "12999",
                    otPrice: "13999",
                },
            ],
            isChecked: 0,
            selectedItems: [],
            pageLimit: 0,
            selectedList: [],
            baseImageUrl: this.$baseApi,
            isSelectAll: false,
            pageSize: 0,
        };
    },
    created() {
        this.handleLoadMore()
    },
    computed: {
        isAllSelected() {
            return this.selectedList.length === this.productList.length && this.productList.length > 0;
        }
    },
    methods: {

        handleLoadMore() {
            this.pageLimit += 10
            this.handleGetData(this.pageLimit)
        },
        handleGetData(pageLimit) {
            if (this.$route.query.type == "foot") {
                this.$route.meta.title = "我的足迹"
            } else {
                this.$route.meta.title = "我的收藏"
            }
            getCollect({
                type: this.$route.query.type,
                limit: pageLimit
            }).then(res => {
                this.productList = res.data
            })
        },
        handleToggleItem(productId) {
            const index = this.selectedList.indexOf(productId);

            if (index > -1) {
                this.selectedList.splice(index, 1);
                this.selectedItems = [...this.selectedList];
                this.isChecked = 0;
                this.isSelectAll = false;
            } else {
                this.selectedList.push(productId);
                this.selectedItems = [...this.selectedList];

                if (this.selectedList.length === this.productList.length) {
                    this.isChecked = 1;
                    this.isSelectAll = true;
                }
            }
        },
        handleSubmitDelete() {
            delCollects({
                category: this.$route.query.type,
                productIds: JSON.stringify(this.selectedList).replace('[', '').replace(']', '')
            }).then(res => {
                if (res.code == 200) {
                    this.$toast.success("删除成功！")
                    this.handleGetData();
                }
            })
        },
        handleToggleAll(isSelectAll) {
            this.$refs.checkboxGroup.toggleAll(isSelectAll);
            this.isSelectAll = isSelectAll;
            if (isSelectAll) {
                this.selectedList = this.productList.map(item => item.pid);
            } else {
                this.selectedList = [];
            }
            this.selectedItems = [...this.selectedList];
            this.isChecked = isSelectAll ? 1 : 0;
        },
    },
};
</script>
<style scoped>
.collection-wrapper {
    width: calc(100% - 10px);
    margin: 0 auto;
}

.collection-container {
    margin-top: 10px;
}

.collection-checkbox {
    top: 10px;
    position: absolute;
    z-index: 2;
}

.collection-image {
    margin-bottom: 8px;
}

.collection-item-content {
    display: block;
}

.collection-price-spacing {
    height: 8px;
}

.collection-select-all {
    margin-right: 48%;
}

.van-grid-item :deep(.van-grid-item__content--center) {
    align-items: flex-start;
    line-height: 20px;
}
</style>