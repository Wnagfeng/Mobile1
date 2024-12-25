<template>
	<div class="warpper">
		<van-swipe @change="onChange">
			<van-swipe-item v-for="(item, index) in product.sliderImageArr" :key="index">
				<van-image fit="scale-down" :src="imgUrls + item" width="100%" />
			</van-swipe-item>
			<template #indicator>
				<div class="custom-indicator" v-if="product.sliderImageArr">
					{{ current + 1 }}/{{ product.sliderImageArr.length }}
				</div>
			</template>
		</van-swipe>
		<!-- 详情图end -->
		<van-row>
			<van-col span="24" class="detail">
				<font size="4" color="#ED6A0C" v-if="integral == 'true'">{{ product.integral }}积分</font>
				<template v-else>
					<font size="4" color="#ED6A0C">￥</font>
					<font size="6" color="#ED6A0C">{{ product.price }}</font>
				</template>
				<div style="float: right;text-align: center;margin-right: 5px;color: #909399;">
					{{ product.sales }}<br />
					<span>销量</span>
				</div>
				<div style="float: right;text-align: center;margin-right: 5px;color: #909399;">
					{{ product.browse }}<br />
					<span>浏览</span>
				</div>
				<div>
					<p>
						{{ product.storeInfo }}
					</p>
				</div>
			</van-col>
			<van-col span="24" class="detail">
				<!-- <van-cell title="选择规格：" value="内容" label="描述信息" /> -->
				<van-cell is-link @click="show = true" :value="skuValue">
					<!-- 使用 title 插槽来自定义标题 -->
					<template #title>
						<span class="custom-title">选择规格：</span>
					</template>
				</van-cell>
				<van-sku v-model="show" :sku="sku" :goods="goods" :hide-stock="sku.hide_stock"
					@sku-selected="onByselect" @buy-clicked="onBuyClicked" @add-cart="onAddCartClicked">
					<template #sku-header-price="props">
						<div class="van-sku__goods-price" @click="test(props)">
							<span class="van-sku__price-symbol" v-if="integral == 'true'">积分</span>
							<span class="van-sku__price-num" v-if="integral == 'true' && props.selectedSkuComb">{{
								props.selectedSkuComb.integral }}</span>
							<span class="van-sku__price-num"
								v-if="integral == 'true' && props.selectedSkuComb == null">{{
									props.price }}</span>
							<span class="van-sku__price-symbol" v-if="integral == 'false'">￥</span>
							<span class="van-sku__price-num" v-if="integral == 'false'">{{ props.price }}</span>
						</div>
					</template>
					<template #sku-actions="props">
						<div class="van-sku-actions" v-if="integral == 'true'">
							<van-button square size="large" type="warning" @click="props.skuEventBus.$emit('sku:buy')">
								积分兑换
							</van-button>
						</div>
					</template>
				</van-sku>
			</van-col>
			<van-col span="24" class="detail">
				<van-cell value="图文详情:" />
				<div class="disc" v-html="$options.filters.chageUrl(product.description, imgUrls)"></div>
			</van-col>
			<!-- 评论 -->
			<!-- 评论end -->
		</van-row>
		<!-- 商品信息end -->
		<van-goods-action>
			<van-goods-action-icon icon="cart-o" text="购物车" to="/cart" />
			<van-goods-action-icon icon="star" text="已收藏" color="#ff5000" v-if="product.userCollect" @click="collect" />
			<van-goods-action-icon icon="star-o" text="收藏" v-if="!product.userCollect" @click="collect" />
			<van-goods-action-button type="warning" text="加入购物车" @click="show = true" v-if="integral == 'false'" />
			<van-goods-action-button type="danger" text="立即购买" @click="show = true" v-if="integral == 'false'" />
			<van-goods-action-button type="danger" text="立即兑换" @click="show = true" v-if="integral == 'true'" />
		</van-goods-action>
	</div>
</template>

<script>
import {
	parseTime
} from "../../utils/index.js"
import {
	getProduct
} from "@/api/product.js"
import {
	addCart
} from "@/api/cart.js"
import {
	collect,
	delCollect
} from "@/api/collect.js"
import Axios from 'axios';
export default {
	data() {
		return {
			replyCount: 0, //评论条数
			reply: {},
			current: 0,
			limit: 0, //条数
			integral: 'false', //是否为积分
			showList: false,
			skuValue: '',
			product: {}, //商品信息
			chosenCoupon: -1,
			show: false,
			sku: {
				// 数据结构见下方文档
				tree: [],
				// 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
				list: [],
				price: '1.00', // 默认价格（单位元）
				none_sku: false, // 是否无规格商品
				hide_stock: false // 是否隐藏剩余库存
			},
			goods: {
				// 默认商品 sku 缩略图
				picture: 'https://img01.yzcdn.cn/1.jpg',
			},
			imgUrls: this.$baseApi
		};
	},
	created() {
		this.index()
		if (this.$route.query.integral) {
			this.integral = this.$route.query.integral
		}
	},
	filters: {
		chageUrl: function (data, url) {
			if (data) {
				var a = data
				var vm = this
				var b = /<img [^>]*src=['"]([^'"]+)[^>]*>/g;
				var s = a.match(b);
			}
			if (s != null) {
				for (var i = 0; i < s.length; i++) {
					var srcImg = s[i].replace(b, '$1').replace(/\s+/g, "");
					a = a.replace(new RegExp(srcImg, 'g'), url + srcImg);
				}
			}
			return a;
		}
	},
	methods: {
		onChange(index) {
			this.current = index;
		},
		collect() {
			if (this.product.userCollect) {
				//取消收藏
				delCollect({
					category: 'collect',
					id: this.$route.query.id
				}).then(res => {
					if (res.status == 200) {
						this.product.userCollect = false
					}
				})
			} else {
				//收藏
				collect({
					category: 'collect',
					id: this.$route.query.id
				}).then(res => {
					if (res.status == 200) {
						this.$toast.success("收藏成功")
						this.product.userCollect = true
					}
				})
			}
		},
		index() {
			// Axios.get("http://localhost:3000/api/product/detail/1")
			// 
			getProduct(this.$route.query.id).then(res => {
				if (res.status == 200) {
					this.product = res.data.storeInfo //商品信息
					this.reply = res.data.reply //商品评论
					this.replyCount = res.data.replyCount
					if (this.integral == 'true') {
						this.sku.price = res.data.storeInfo.integral
					} else {
						this.sku.price = res.data.storeInfo.price
					}
					this.sku.stock_num = res.data.storeInfo.stock
					this.goods.picture = this.imgUrls + res.data.storeInfo.image
					res.data.productAttr.forEach((item, index) => {
						let treeMap = {
							v: []
						}
						treeMap.k = item.attrName
						treeMap.k_s = item.attrName

						item.attrValueArr.forEach((att, i) => {
							let v = {}
							v.id = att
							v.name = att
							treeMap.v.push(v)
						})
						this.sku.tree.push(treeMap)
					})
					for (let value in res.data.productValue) {
						let list = {}
						list.id = res.data.productValue[value].unique
						let sk = res.data.productValue[value].sku.split(',')
						for (let values in res.data.productValue) {
							this.sku.tree.forEach((r, i) => {
								list[r.k_s] = sk[i]
							})
						}
						list.price = res.data.productValue[value].price * 100
						list.integral = res.data.productValue[value].integral
						list.stock_num = res.data.productValue[value].stock
						this.sku.list.push(list)
					}
				}
			})
			if (this.$route.query.integral == true) {
				this.$route.meta.title = "积分商品兑换"
				this.integral = 'true'
			} else {
				this.$route.meta.title = "商品详情"
				this.integral = 'false'
			}
		},
		parseTime,
		onBuyClicked(data) {
			addCart({
				cartNum: data.selectedNum,
				productId: this.$route.query.id,
				uniqueId: data.selectedSkuComb.id,
				new: 0,
			}).then(res => {
				if (res.status == 200) {
					if (this.integral == 'true') {
						this.$router.push({
							name: 'CreationOrder',
							query: {
								ids: res.data.cartId,
								integral: 1
							}
						});
					} else {
						this.$router.push({
							name: 'CreationOrder',
							query: {
								ids: res.data.cartId,
								integral: 0
							}
						});
					}
				}
			})
		},
		onByselect(skuValue) {
			let list = ''
			this.sku.tree.forEach(res => {
				for (let value in skuValue.selectedSkuComb) {
					if (res.k == value) {
						list = list + skuValue.selectedSkuComb[value]
					}
				}
			})
			this.skuValue = list
		},
		onAddCartClicked(data) {
			addCart({
				cartNum: data.selectedNum,
				productId: this.$route.query.id,
				uniqueId: data.selectedSkuComb.id,
				new: 0,
			}).then(res => {
				if (res.status == 200) {
					this.$toast.success("加入购物车成功！")
					this.show = false
				}
			})
		},

	},
};
</script>

<style scoped>
.disc {
	width: calc(100% - 30px);
	margin: 0 auto;
}

.disc /deep/ img {
	width: 100%;
}

.custom-indicator {
	position: absolute;
	right: 5px;
	bottom: 5px;
	padding: 2px 5px;
	font-size: 12px;
	background: rgba(0, 0, 0, 0.1);
	color: #FFFFFF;
}

.warpper {
	background-color: #F8F8F8;
	padding: 8px;
}

.img {
	width: 60px;
	height: 60px;
	margin: 10px;
}

.detail {
	margin-top: 10px;
	background-color: #FFFFFF;
	padding: 6px;
	border-radius: 8px;
}

.custom-title {
	margin: 8px;
}
</style>
