<!-- add地址未优化版本 -->
<template>
    <div class="warpper">
        <van-field v-model="real_name" label="联系人" required placeholder="请输入" />
        <van-field v-model="phone" type="tel" label="手机号" required placeholder="请输入" />
        <van-field v-model="address" readonly label="选择地址" placeholder="请选择" @focus="addressShow = true" />

        <van-popup v-model="addressShow" round position="bottom" :style="{ height: '40%' }">
            <van-area title="请选择" :area-list="areaList" @confirm="openPopup" />
        </van-popup>
        <van-field v-model="detail" required label="详细地址" placeholder="请输入" />
        <van-field v-model="post_code" label="收货邮政编码" placeholder="请输入" />
        <van-cell title="设为默认" icon="shop-o" class="checkeds">
            <template #right-icon>
                <van-switch v-model="checked" size="24px" />
            </template>
        </van-cell>
        <div class="btn">
            <van-button type="danger" round block @click="submit">提交</van-button>
            <van-button type="warning" round block @click="del()" style="margin-top: 15px;" v-if="show">删除</van-button>
        </div>
    </div>
</template>

<script>
import {
    areaList
} from '@vant/area-data';
import {
    getDataDetails,
    delAddress,
    editAddress
} from "@/api/address.js"
export default {
    data() {
        return {
            checked: false,
            address: null,
            addressShow: false,
            areaList: areaList,
            real_name: null,
            phone: null,
            detail: null,
            post_code: null,
            addressList: [],
            editingContact: {},
            show: false
        };
    },
    created() {
        this.getData()
    },
    methods: {
        //新增 
        getData() {
            if (this.$route.params.id) {
                this.show = true
                getDataDetails({
                    id: this.$route.params.id
                }).then(res => {

                    this.real_name = res.data.realName
                    this.phone = res.data.phone
                    this.detail = res.data.detail
                    this.post_code = res.data.postCode
                    this.address = res.data.province + ',' + res.data.city + ',' + res.data.district
                    if (res.data.isDefault == 1) {
                        this.checked = true
                    }
                    this.addressList = [{
                        name: res.data.province
                    }, {
                        name: res.data.city
                    }, {
                        name: res.data.district
                    }]
                })
            }
        },


        submit() {
            let addressInfo = {
                id: this.$route.params.id == null ? null : this.$route.params.id,
                real_name: this.real_name,
                phone: this.phone,
                detail: this.detail,
                post_code: this.post_code,
                is_default: this.checked,
                address: {
                    province: this.addressList[0]?.name || "",
                    city: this.addressList[2]?.name || "",
                    district: this.addressList[1]?.name || "",
                }

            }
            // Validation
            if (!addressInfo.real_name) {
                this.$toast("请填写收货人姓名");
                return;
            }
            // 13开头 
            const isValidPhone = (phone) => /^1[3-9]\d{9}$/.test(phone);

            if (!isValidPhone(addressInfo.phone)) {
                this.$toast("请填正确的电话号码");
                return;
            }

            if (!addressInfo.detail) {
                this.$toast("请填写详细地址");
                return;
            }

            editAddress(addressInfo).then(res => {
                if (res.status == 200) {
                    this.$toast("操作成功！")
                    this.$router.back()
                }
            })

        },
        del() {
            delAddress({
                id: this.$route.params.id
            }).then(res => {
                if (res.status == 200) {
                    this.$toast("操作成功！")
                    this.$router.back()
                }
            })
        },
        //选取地址
        openPopup(data) {
            let address = ""
            for (let i = 0; i < data.length; i++) {
                if (i == data.length - 1) {
                    address = address + data[i].name
                } else {
                    address = address + data[i].name + ","
                }
            }
            this.address = address
            this.addressList = data
            this.addressShow = false
        },
    },
};
</script>

<style scoped>
.warpper {
    margin-top: 7px;
    padding: 5px;
}

.checkeds {
    margin-top: 10px;
}

.btn {
    width: calc(100% - 20px);
    margin: 30px auto;
}
</style>
