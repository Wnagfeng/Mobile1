<!-- add地址优化版本 -->
<template>
	<div class="address-edit-container">
		<!-- 基本信息表单 -->
		<van-field v-model="addressForm.realName" label="联系人" required placeholder="请输入联系人姓名" />

		<van-field v-model="addressForm.phone" type="tel" label="手机号" required placeholder="请输入手机号码" />

		<van-field v-model="addressForm.regionText" readonly label="选择地址" placeholder="请选择所在地区"
			@focus="handleShowAreaPicker" />

		<!-- 地区选择弹窗 -->
		<van-popup v-model="isAreaPickerVisible" round position="bottom" :style="{ height: '40%' }">
			<van-area title="请选择地区" :area-list="areaList" @confirm="handleAreaConfirm"
				@cancel="isAreaPickerVisible = false" />
		</van-popup>

		<van-field v-model="addressForm.detail" required label="详细地址" placeholder="请输入详细地址" />

		<van-field v-model="addressForm.postCode" label="邮政编码" placeholder="请输入邮政编码" />

		<!-- 默认地址设置 -->
		<van-cell title="设为默认" icon="shop-o" class="address-default-setting">
			<template #right-icon>
				<van-switch v-model="addressForm.isDefault" size="24px" />
			</template>
		</van-cell>

		<!-- 操作按钮 -->
		<div class="address-edit-buttons">
			<van-button type="danger" round block @click="handleSubmit">保存地址</van-button>

			<van-button v-if="isEditMode" type="warning" round block @click="handleDelete"
				class="address-delete-button">删除地址</van-button>
		</div>
	</div>
</template>

<script>
import { getDataDetails, delAddress, getAddressList, editAddress } from "@/api/address.js"

export default {
	name: 'AddressEdit',

	data() {
		return {
			addressForm: {
				realName: '',
				phone: '',
				regionText: '',
				detail: '',
				postCode: '',
				isDefault: false,
				regions: [] // 存储省市区对象
			},
			isAreaPickerVisible: false,
			areaList: null,
			isEditMode: false,
			addressId: null
		}
	},

	created() {
		this.init()
	},

	methods: {
		async init() {
			await this.handleFetchAreaList()

			const addressId = this.$route.params.id
			if (addressId) {
				this.isEditMode = true
				this.addressId = addressId
				await this.handleFetchAddressDetail(addressId)
			}
		},

		async handleFetchAreaList() {
			try {
				const res = await getAddressList()
				this.areaList = res.data
			} catch (error) {
				this.$toast.fail('获取地区列表失败')
				console.error('获取地区列表失败:', error)
			}
		},

		async handleFetchAddressDetail(id) {
			try {
				const res = await getDataDetails({ id })
				const { data } = res

				this.addressForm = {
					realName: data.realName,
					phone: data.phone,
					detail: data.detail,
					postCode: data.postCode,
					isDefault: data.isDefault === 1,
					regionText: `${data.province},${data.city},${data.district}`,
					regions: [
						{ name: data.province },
						{ name: data.city },
						{ name: data.district }
					]
				}
			} catch (error) {
				this.$toast.fail('获取地址详情失败')
				console.error('获取地址详情失败:', error)
			}
		},

		handleShowAreaPicker() {
			this.isAreaPickerVisible = true
		},

		handleAreaConfirm(areas) {
			this.addressForm.regions = areas
			this.addressForm.regionText = areas.map(area => area.name).join(',')
			this.isAreaPickerVisible = false
		},

		validateForm() {
			const { realName, phone, detail, regions } = this.addressForm

			if (!realName) {
				this.$toast('请填写收货人姓名')
				return false
			}

			if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(phone)) {
				this.$toast('请填写正确的手机号码')
				return false
			}

			if (!regions.length) {
				this.$toast('请选择所在地区')
				return false
			}

			if (!detail) {
				this.$toast('请填写详细地址')
				return false
			}

			return true
		},

		async handleSubmit() {
			if (!this.validateForm()) return

			try {
				const addressData = {
					id: this.addressId,
					real_name: this.addressForm.realName,
					phone: this.addressForm.phone,
					detail: this.addressForm.detail,
					post_code: this.addressForm.postCode,
					is_default: this.addressForm.isDefault,
					address: {
						province: this.addressForm.regions[0].name,
						city: this.addressForm.regions[1].name,
						district: this.addressForm.regions[2].name,
					}
				}

				const res = await editAddress(addressData)
				if (res.status === 200) {
					this.$toast.success('保存成功')
					this.$router.back()
				}
			} catch (error) {
				this.$toast.fail('保存失败')
				console.error('保存地址失败:', error)
			}
		},

		async handleDelete() {
			try {
				const res = await delAddress({ id: this.addressId })
				if (res.status === 200) {
					this.$toast.success('删除成功')
					this.$router.back()
				}
			} catch (error) {
				this.$toast.fail('删除失败')
				console.error('删除地址失败:', error)
			}
		}
	}
}
</script>

<style scoped>
.address-edit-container {
	padding: 12px;
	background-color: #f7f8fa;
}

.address-default-setting {
	margin-top: 16px;
	background-color: #fff;
	border-radius: 8px;
}

.address-edit-buttons {
	margin: 24px 16px;
}

.address-delete-button {
	margin-top: 12px;
}

/* 表单项样式优化 */
:deep(.van-field) {
	margin-bottom: 8px;
	background-color: #fff;
	border-radius: 8px;
}

:deep(.van-field__label) {
	width: 80px;
	color: #323233;
}

:deep(.van-cell::after) {
	display: none;
}

/* 按钮样式优化 */
:deep(.van-button) {
	height: 44px;
	font-size: 16px;
	font-weight: 500;
}

/* 开关样式优化 */
:deep(.van-switch) {
	margin-right: 4px;
}
</style>