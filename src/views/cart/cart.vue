<!-- 购物车优化后 -->
<template>
    <div class="cart-container">
        <van-submit-bar :price="money * 100" button-text="提交订单" @submit="handleSubmitOrder" tip="向左滑动商品可删除该商品！">
            <van-checkbox v-model="value" @click="handleSelectAll(ckAll == false ? true : false)">全选</van-checkbox>
        </van-submit-bar>
        <van-empty description="空空如也!" v-if="cartlist.length <= 0" />
        <div class="cart-list">
            <van-checkbox-group v-model="selectIdsList" ref="checkboxGroup">
                <van-swipe-cell class="cart-item" v-if="item.productInfo.isIntegral != 1 && item.combinationId == 0"
                    v-for="item in cartlist" :key="item.id">
                    <van-card :num="item.cartNum" :desc="item.productInfo.storeInfo" :title="item.productInfo.storeName"
                        :thumb="imgUrls + item.productInfo.image">
                        <template #tags>
                            <van-tag plain type="danger" style="margin-top: 10px;">{{ item.productInfo.attrInfo.sku }}
                            </van-tag>
                        </template>
                        <template #price>
                            <span v-if="!item.combinationId">
                                <span style="font-size: 15px;  color: red;">￥{{ item.truePrice }}</span>

                            </span>
                            <span v-if="item.combinationId">
                                <span style="font-size: 15px; color: red;">拼团价：￥{{ item.truePrice }}</span>
                            </span>
                        </template>
                        <template #footer>
                            <van-stepper v-model="item.cartNum" integer @change="handleQuantityChange"
                                value="changevalue" @plus="itemId = item.id" @minus="itemId = item.id"
                                @focus="itemId = item.id" />
                        </template>
                        <template #tag>
                            <van-checkbox :name="item.id"
                                @click="handleItemSelect(item.id, item.truePrice * item.cartNum)"
                                checked-color="#ee0a24"></van-checkbox>
                        </template>
                    </van-card>
                    <template #right>
                        <van-button square text="删除" type="danger" class="cart-delete-btn"
                            @click="handleDeleteItem(item.id)" />
                    </template>
                </van-swipe-cell>
            </van-checkbox-group>
        </div>
    </div>
</template>
<script>
import {
    getCartList,
    upCartNum,
    delCart
} from "../../api/cart"
export default {
    data() {
        return {
            changevalue: 0, //count
            cartlist: [
                {
                    id: 2,
                    productInfo: {
                        storeName: "商品A",
                        storeInfo: "商家A",
                        image: "https://example.com/imageA.jpg",
                        isIntegral: 0,
                        attrInfo: {
                            sku: "SKU-A",
                            price: 99.00
                        }
                    },
                    cartNum: 2, // 购物车中的数量
                    truePrice: 99.00, // 商品真实价格
                    combinationId: 0 // 是否为组合商品
                },
                {
                    id: 3,
                    productInfo: {
                        storeName: "商品A",
                        storeInfo: "商家A",
                        image: "https://example.com/imageA.jpg",
                        isIntegral: 0,
                        attrInfo: {
                            sku: "SKU-A",
                            price: 99.00
                        }
                    },
                    cartNum: 3, // 购物车中的数量
                    truePrice: 99.00, // 商品真实价格
                    combinationId: 0 // 是否为组合商品
                },
            ],
            value: false, //全选按钮
            money: 0, //总金额
        
            selectIdsList: [], //select list
            ckAll: false, //是否全选
            itemId: null, //商品id 
            imgUrls: this.$baseApi,
        };
    },
    created() {
        this.fetchCartList()
    },
    methods: {
        // 获取购物车列表
        async fetchCartList() {
            try {
                const res = await getCartList();
                this.cartlist = res.data.valid;
            } catch (error) {
                this.$toast.fail('获取购物车失败');
            }
        },

        // 切换商品选中状态
        handleItemSelect(itemId, itemPrice) {
            const index = this.selectIdsList.indexOf(itemId);
            if (index > -1) {
                this.selectIdsList.splice(index, 1);
                this.money -= itemPrice;
            } else {
                this.selectIdsList.push(itemId);
                this.money += itemPrice;
            }

            // 更新全选状态
            const validItems = this.cartlist.filter(item =>
                !item.productInfo.isIntegral && !item.combinationId
            );
            this.value = validItems.length > 0 && this.selectIdsList.length === validItems.length;
        },

        // 更新商品数量
        async handleQuantityChange(value) {
            this.recalculateTotalPrice();

            if (value > 0 && this.itemId) {
                this.$toast.loading({ forbidClick: true });
                try {
                    await upCartNum({
                        number: value,
                        id: this.itemId
                    });
                    this.changevalue = value;
                } catch (error) {
                    this.$toast.fail('更新数量失败');
                }
            }
        },

        // 重新计算总价
        recalculateTotalPrice() {
            this.money = this.cartlist.reduce((total, item, index) => {
                return this.selectIdsList[index] === item.id ?
                    total + (item.truePrice * item.cartNum) : total;
            }, 0);
        },

        // 提交订单
        handleSubmitOrder() {
            if (!this.selectIdsList.length) {
                return this.$toast.fail("至少选择一件商品！");
            }

            const query = {
                ids: this.selectIdsList.length === 1 ?
                    this.selectIdsList[0] :
                    this.selectIdsList.toString()
            };

            this.$router.push({
                name: 'createOrder',
                query
            });
        },

        // 删除购物车商品
        async handleDeleteItem(itemId) {
            try {
                const res = await delCart({ ids: [itemId] });
                if (res.status) {
                    await this.fetchCartList();
                    this.$toast.success('删除成功');
                }
            } catch (error) {
                this.$toast.fail('删除失败');
            }
        },

        // 切换全选状态
        handleSelectAll(isSelected) {
            this.$refs.checkboxGroup.toggleAll(isSelected);
            this.ckAll = isSelected;
            this.selectIdsList = [];
            this.money = 0;
       

            if (isSelected) {
                this.cartlist.forEach(item => {
                    this.money += item.productInfo.attrInfo.price * item.cartNum;
                    this.selectIdsList.push(item.id);
                });
            }
        },
    }
};
</script>

<style scoped>
.cart-container {
    position: absolute;
    left: 0px;
    right: 0px;
    height: 80%;
    background: #fff;
}

.cart-list {
    background-color: #FFFFFF;
    padding: 10px;
}

.cart-delete-btn {
    height: 100%;
}

.cart-item {
    margin-top: 5px;
}
</style>
