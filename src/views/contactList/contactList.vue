<!-- 地址列表未优化版本 -->
<template>
    <div class="warpper">
        <van-radio-group v-model="radio">
            <van-cell center v-for="(item, index) in list" :key="index">
                <template #icon>
                    <van-radio :name="item.id" disabled checked-color="#ee0a24"></van-radio>
                </template>
                <template #title>
                    <span>{{ item.name }}</span>
                    <span class="custom-title">{{ item.tel }}</span>
                    <van-tag type="danger" v-if="radio == item.id">默认</van-tag>
                </template>
                <template #label>
                    <span class="">{{ item.address }}</span>
                </template>
                <template #right-icon>
                    <van-icon name="edit" size="20" @click="onEdit(item.id)" />
                </template>
            </van-cell>
        </van-radio-group>
        <div class="btn">
            <van-button type="danger" round @click=" onAdd()">新增联系人</van-button>
        </div>
        <van-divider v-if="list.length > 9" @click="move()">点击加载更多</van-divider>
    </div>
</template>

<script>
import {
    getAddress
} from "@/api/address.js"
export default {
    data() {
        return {
            radio: 0,
            chosenAddressId: '1',
            list: [
                {
                    id: 1,
                    name: '张三',
                    tel: '13811111111',
                    address: '北京市海淀区西二旗'
                }
            ],
            limit: 0,
        };
    },
    created() {
        this.getList()
    },
    methods: {
        move() {
            this.limit += 10
            this.getList(this.limit)
        },
        //获取地址列表
        getList(limit) {
            getAddress({
                limit: limit
            }).then(res => {
                this.list = []
                res.data.forEach(rs => {
                    let list = {}
                    list.id = rs.id
                    list.tel = rs.phone
                    list.address = rs.province + rs.city + rs.district + rs.detail
                    list.name = rs.realName
                    if (rs.isDefault == 1) {
                        this.radio = rs.id
                    }
                    this.list.push(list)
                })
            })
        },
        onAdd() {
            this.$router.push("/newContact");
        },
        onEdit(id) {
            this.$router.push({
                name: 'NewContact',
                params: {
                    id: id
                }
            });
        },
    },
};
</script>

<style scoped>
.warpper {
    margin-top: 7px;
    padding: 5px;

}


.custom-title {
    margin: 5px;
}

.van-cell__title {
    margin-left: 10px;
}

.btn button {
    width: 100%;
}

.btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px;
    background-color: #FFFFFF;
}
</style>
