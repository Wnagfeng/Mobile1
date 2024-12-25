<!-- 地址列表优化版本 -->
<template>
    <div class="address-container">
        <van-radio-group v-model="selectedAddressId">
            <van-cell v-for="(item, index) in addressList" :key="index" class="address-item">
                <template #icon>
                    <van-radio :name="item.id" disabled checked-color="#ee0a24" class="address-radio" />
                </template>

                <template #title>
                    <div class="address-title">
                        <span class="address-name">{{ item.name }}</span>
                        <span class="address-phone">{{ item.tel }}</span>
                        <van-tag v-if="selectedAddressId === item.id" type="danger"
                            class="address-default-tag">默认</van-tag>
                    </div>
                </template>

                <template #label>
                    <span class="address-detail">{{ item.address }}</span>
                </template>

                <template #right-icon>
                    <van-icon name="edit" size="20" class="address-edit-icon" @click="handleEditAddress(item.id)" />
                </template>
            </van-cell>
        </van-radio-group>

        <div class="address-add-button">
            <van-button type="danger" round @click="handleAddAddress">新增联系人</van-button>
        </div>

        <van-divider v-if="addressList.length >= pageLimit" @click="handleLoadMore" class="address-load-more">
            点击加载更多
        </van-divider>
    </div>
</template>

<script>
import { getAddress } from "@/api/address.js"

export default {
    name: 'AddressList',

    data() {
        return {
            selectedAddressId: 0,
            addressList: [],
            pageLimit: 10,
        }
    },

    created() {
        this.handleFetchAddresses()
    },

    methods: {
        handleLoadMore() {
            this.pageLimit += 10
            this.handleFetchAddresses()
        },
        async handleFetchAddresses() {
            try {
                const res = await getAddress({ limit: this.pageLimit })
                // 保存当前接口返回的数据
                this.currentList = res.data

                // 转换数据格式
                this.addressList = this.currentList.map(item => ({
                    id: item.id,
                    tel: item.phone,
                    address: `${item.province}${item.city}${item.district}${item.detail}`,
                    name: item.realName
                }))

                // 设置默认地址
                const defaultAddress = this.currentList.find(item => item.isDefault === 1)
                if (defaultAddress) {
                    this.selectedAddressId = defaultAddress.id
                }
            } catch (error) {
                console.error('获取地址列表失败:', error)
                this.$toast.fail('获取地址列表失败')
            }
        },

        handleAddAddress() {
            this.$router.push("/newContact")
        },

        handleEditAddress(id) {
            this.$router.push({
                name: 'NewContact',
                params: { id }
            })
        },
    },
}
</script>

<style scoped>
.address-container {
    margin-top: 8px;
    padding: 12px;
    background-color: #f7f8fa;
}

.address-item {
    margin-bottom: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.address-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.address-name {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
}

.address-phone {
    font-size: 14px;
    color: #666;
}

.address-detail {
    font-size: 14px;
    color: #999;
    line-height: 1.5;
}

.address-radio {
    padding: 16px 0;
}

.address-default-tag {
    margin-left: auto;
}

.address-edit-icon {
    color: #666;
    padding: 4px;
    cursor: pointer;
    transition: color 0.3s;
}

.address-edit-icon:hover {
    color: #ee0a24;
}

.address-add-button {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

.address-add-button :deep(.van-button) {
    width: 100%;
    height: 44px;
    font-size: 16px;
}

.address-load-more {
    margin: 16px 0;
    color: #666;
    font-size: 14px;
}

/* 适配底部按钮 */
.address-container {
    padding-bottom: 80px;
}
</style>