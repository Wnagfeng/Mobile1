<!-- 商品列表未优化版本 -->
<template>
	<div class="warpper">

		<van-tabs sticky title-active-color="red" color="#fff" @click="onClick">
			<van-tab title="综合" name="1"></van-tab>
			<van-tab name="2">
				<template #title>
					价格
					<van-icon name="sort" />
				</template>
			</van-tab>
			<van-tab title="新品" name="3"></van-tab>
			<!-- <van-tab  name="4">	<template #title>
					销量
					<van-icon name="sort" />
				</template>
			</van-tab> -->
		</van-tabs>
		<template v-if="list.length<1">
			<van-empty description="空空如也!" />
		</template>
		<div style="margin-top: 10px;">
			<van-grid :column-num="2" :gutter="10">
				<van-grid-item v-for="(item, index) in list" :key="index"
					:to="'/productDetails?id='+item.id+'&integral='+integral">
					<van-image :src="imgUrls+item.image" height="140" />
					<span>
						<font size="2">{{ item.storeName }}</font>
					</span>
					<span>
						<font size="4" color="#ff8001" v-if="integral">{{item.integral}}积分</font>
						<font size="4" color="#ff8001" v-else>￥{{ item.price }}</font>
					</span>
				</van-grid-item>
			</van-grid>

			<van-divider v-if="list.length>9" @click="move(name,val)">点击加载更多</van-divider>
		</div>
	</div>
</template>

<script>
	import {
		getProductList
	} from "@/api/product.js"
	export default {
		data() {
			return {
				integral: false,
				list: [],
				imgUrls: this.$baseApi,
				salesSort: 'desc',
				limit: 10,
				priceOrder: 'desc',
				name: null,
				val: null
			};
		},
		created() {
			this.index()
		},
		methods: {
			goto(data) {
				this.$router.push({
					name: 'ProductDetails',
					query: {
						integral: data
					}
				});
			},
			onClick(name, title) {
				if (name == 1) {
					this.move()
				} else if (name == 2) {
					if (this.priceSort == 'desc') {
						this.priceSort = 'asc'
						this.move('priceOrder', 'desc')
					} else {
						this.priceSort = 'desc'
						this.move('priceOrder', 'asc')
					}
				} else if (name == 3) {
					this.move('news', 1)
				} else if (name == 4) {
					if (this.salesSort == 'desc') {
						this.salesSort = 'asc'
						this.move('salesSort', 'desc')
					} else {
						this.salesSort = 'desc'
						this.move('salesSort', 'asc')
					}
				}
			},
			move(name, val) {
				if (this.name == name) {
					this.limit += 10
				} else {
					this.limit = 0
					this.limit += 10
				}
				this.name = name
				this.val = val
				this.index(name, val, this.limit)
			},
			index(name, val, limit) {
				let map = {}
				map['sid'] = this.$route.query.sid ? this.$route.query.sid : ''
				map['isIntegral'] = this.$route.query.integral ? 1 : 0
				map[name] = val
				map['limit'] = limit
				getProductList(map).then(res => {
					this.list = res.data.content
				})

				if (this.$route.query.integral) {
					this.$route.meta.title = "积分商品"
					this.integral = true
				} else {
					this.$route.meta.title = "商品列表"
					this.integral = false
				}
			}
		},
	};
</script>

<style scoped>
	.warpper {
		background-color: #F8F8F8;
		padding: 5px;
	}
</style>
