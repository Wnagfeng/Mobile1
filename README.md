# Mobile练习指南:memo:：

```js
Write By CoderJoon
Time: 2024-09-19 —— 2024-09-24
```

***



### 0.关于替换:pencil2:：

我做的替换全都打了标注

```js
<!-- 替换url -->
```

### 1.前置条件:lock:：

为了练习该项目我对本机进行了版本降级 以下是该`Mobile`项目运行所需的环境：

| 环境类型     | 版本号   |
| ------------ | -------- |
| Node         | ^14.17.6 |
| `Vant—Ui`    | ^2.12.21 |
| `Vue—Router` | ^3.0.1   |
| `Vue`        | ^2.5.2`  |
| `Npm`        | 6.14.15  |

你除了需要准备以上环境以外，建议在开始练习以前还需要去先去看看 文件上传和图片的展示，不是普通的展示图片。

后端：

https://github.com/Wnagfeng/StaticexampleBack

前端：

https://github.com/Wnagfeng/staticExample

### 2.项目初始化:rocket:：

```shell
npm install -g @vue/cli@4.5.13  `---最后一个与vue2.5.14匹配的cli`
vue create Pc
```

### 3.关于路由:wrench: ：

在`router.config.js`文件中，主办方对齐进行了`requireAuth`配置，目的是对部分页面做登录验证，这里我关闭，不需要验证，后期打开开关即可！

### 4.关于请求 :chart_with_upwards_trend:：

以下是你可能需要自己添加的API请求：

```js
//---------------------------------------------------------------------------------------------------
// home.js
//首页 精品推荐
export function getBastList() {
	return request({
		url: '/index/bastList',
		method: 'get'
	})
}
//首页  猜你喜欢
export function getLike() {
	return request({
		url: '/index/like',
		method: 'get'
	})
}

//---------------------------------------------------------------------------------------------------
//cart.js
//加入购物车
export function addCart(data) {
    return request({
        url: '/cart/add',
        method: 'post',
        data
    })
}
//查询订单和购物车列表
export function getCartList(data) {
    return request({
        url: '/cart/list',
        method: 'get',
        params: data
    })
}
//修改购物车
export function upCartNum(data) {
    return request({
        url: '/cart/num',
        method: 'post',
        data
    })
}
export function delCart(data) {
	return request({
		url: '/cart/del',
		method: 'post',
		data
	})
}
//---------------------------------------------------------------------------------------------------
//collect.js
//添加收藏
export function collect(data) {
    return request({
        url: '/collect/add',
        method: 'post',
        data

    })
}
//删除收藏
export function delCollect(data) {
    return request({
        url: '/collect/del',
        method: 'post',
        data

    })
}
//查询收藏列表
export function getCollect(data) {
	return request({
		url: '/collect/user?type=' + data.type,
		method: 'get'

	})
}
//删除收藏批量
export function delCollects(data) {
	return request({
		url: '/collect/dels/' + data.productIds,
		method: 'post',
		data

	})
}
//---------------------------------------------------------------------------------------------------
//product.js
//获取商品详情
export function getProduct(data) {
    return request({
        url: '/product/detail/' + data,
        method: 'get'
    })
}
//获取商品列表
export function getProductList(data) {
    return request({
        url: '/products',
        method: 'get',
        params: data
    })
}
//---------------------------------------------------------------------------------------------------
//address.js
//添加或修改地址
export function editAddress(data) {
	return request({
		url: '/address/edit',
		method: 'post',
		data
	})
}
//地址列表
export function getAddress(data) {
	return request({
		url: '/address/list',
		method: 'get',
		params: data
	})
}
//获取地址详情
export function getDataDetails(data) {
	return request({
		url: '/address/detail/' + data.id,
		method: 'get'
	})
}
// 删除地址
export function delAddress(data) {
	return request({
		url: '/address/del',
		method: 'post',
		data
	})
}
//---------------------------------------------------------------------------------------------------
//order.js
//获取订单列表
export function getOrderList(data) {
    return request({
        url: '/order/list',
        method: 'get',
        params: data
    })
}
//计算订单金额
export function getOrderSum(data) {
    return request({
        url: '/order/computed/' + data.key,
        method: 'post',
        data
    })
}
//创建订单信息
export function createOrder(data) {
	return request({
		url: '/order/create/' + data.key,
		method: 'post',
		data
	})
}
//订单确认
export function getOrderInfo(data) {
    return request({
        url: '/order/confirm',
        method: 'post',
        data
    })
}
// 订单详情
export function order(data) {
    return request({
        url: '/order/detail/' + data,
        method: 'get'

    })
}
//---------------------------------------------------------------------------------------------------
//discount.js
//获取订单优惠券
export function getOrderCoupons(data) {
    return request({
        url: '/coupons/order/' + data,
        method: 'get'

    })
}
//---------------------------------------------------------------------------------------------------
//search.js
//查询热门关键字
export function getSearchKeyword(data) {
    return request({
        url: '/search/keyword',
        method: 'get',
        params: data
    })
}

//搜索商品
export function products(data) {
    return request({
        url: '/products',
        method: 'get',
        params: data
    })
}
//---------------------------------------------------------------------------------------------------
//productClassify.js
// 获取分类
export function getData() {
    return request({
        url: '/category',
        method: 'get'
    })
}
//---------------------------------------------------------------------------------------------------
//analysis.js
// 消费分析接口
export function getAnalysisData() {
    return request({
        url: '/userAnalysis',
        method: 'get'
    })
}
```

### 5.关于路由:sparkles::

以下是你可能需要添加的路由：

```js
 // 自己添加的路由
// 1.商品详情页面
{
    path: '/productDetails',
    name: 'ProductDetails',
    component: () => import('../views/productDetails/productDetails.vue'),
    meta: {
        title: '商品详情',
        keepAlive: false,
        tabBar: false,
        navBar: true
    }
}
// 2.创建订单页面
{
    path: '/createOrder',
    name: 'createOrder',
    component: () => import('../views/order/createOrder.vue'),
    meta: {
        title: '创建订单',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 3.搜索页面
{
    path: '/search',
    name: 'Search',
    component: () => import('../views/home/search.vue'),
    meta: {
        title: '搜索',
        keepAlive: false,
        tabBar: true,
        navBar: false
    }
},
// 4.全部商品页面
{
    path: '/productList',
    name: 'ProductList',
    component: () => import('../views/productList/productList.vue'),
    meta: {
        title: '商品列表',
        keepAlive: false,
        tabBar: true,
        navBar: true
    }
},
// 5.我的钱包页面
{
    path: '/wallet',
    name: 'Wallet',
    component: () => import('@/views/user/wallet'),
    meta: {
        title: '我的钱包',
        keepAlive: false,
        tabBar: true,
        navBar: true,
        requireAuth: true
    }
},
 // 6.我的收藏和足迹页面
{
    path: '/collect',
    name: 'Collect',
    component: () => import('../views/collect/collect.vue'),
    meta: {
        title: '我的收藏',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false //是否需要登录才能进
    }
},
// 7.添加地址页面
{
    path: '/contactList',
    name: 'ContactList',
    component: () => import('@/views/contactList/contactList'),
    meta: {
        title: '联系人列表',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 9.订单页面
{
path: '/orderSatus',
name: 'OrderSatus',
component: () => import('@/views/order/orderSatus'),
meta: {
    title: '订单',
    keepAlive: false,
    tabBar: true,
    navBar: true,
    requireAuth: false
},
// 10.订单详情页面
{
    path: '/orderDetail',
    name: 'OrderDetail',
    component: () => import('../views/order/orderDetail.vue'),
    meta: {
        title: '订单详情',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 11.订单支付成功页面
{
    path: '/paySuccess',
    name: 'PaySuccess',
    component: () => import('@/views/order/paySuccess'),
    meta: {
        title: '支付成功',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 12.消费分析页面
{
    path: "/analysis",
    name: "Analysis",
    component: () => import("../views/analysis/analysis.vue"),
    meta: {
        title: "消费分析",
        keepAlive: false,
        tabBar: true,
        navBar: true,
        requireAuth: false
    }
}
```

### 6.关于商品详情页面:rocket: ：​

该页面中的选择商品规格有点小难度，主要是复杂在数据结构上，这里做出详细的解析：

#### 6.1前置条件:bookmark:：

想要明白这个规格是怎么实现的，首先你需要明白数据是如何处理的，我们需要处理为什么格式的数据等。

在本项目下的 `ProductDetail.html` 中我做了详细的解析，包括过滤过程！建议看一看。

#### 6.2详细解析:green_heart:：

如果你已经明白了数据格式是如何过滤的，以及我们需要哪些数据格式，这里我对`vant`中的`vant-sku`组件做一个详细的解析，功能实现就问题就不大了！

规格的选择本质上就是对数据的对应处理，比如我当前有两个套餐，8+128 12+512 套餐 加上颜色的套餐，最终他是在`sku`这个对象中的list中过滤出符合这个套餐的 库存 单价等各种数据，然后统一发送给后端做处理。

### 7.关于`eslint`:bento::

由于该项目中使用了不知名的屎山代码，我只能禁用所有的规则了

我在`.eslintignore` 下面添加了 `src/*` 规则禁用了所有的`src`下面的规则检查

### 8.练习题汇总:alien:：

* ①：移动商城实现首页精品推荐、猜你喜欢列表布局 :white_check_mark:
*  ②：移动端个人中心实现地址管理功能​ :white_check_mark:
* ③：移动端实现首页搜索功能  :white_check_mark:
* ④：移动商城端实现商品列表功能  :white_check_mark:
* ⑤：移动商城实现个人中心消费分析(必考) :white_check_mark:
* ⑥：移动商城实现商品下单 :white_check_mark:
* ⑦：移动商城实现购物车 :white_check_mark:
* ⑧：完成我的钱包充值页面​ :white_check_mark:
* ⑨：完成我的收藏和我的足迹页面​ :white_check_mark:
*  ⑩：完成移动端订单详情，五种状态页面 :white_check_mark:

### 9.关于创建订单页面:zap:：

该页面可能有两种支付方式一种是使用余额支付的商品购买逻辑，没啥好说的，一种是通过积分兑换的商品，需要使用积分支付，为了实现该页面我做了三个页面：

* `BalancePayment.vue` --- 仅使用余额支付
* `createOrder.vue` --- 余额和积分支付都有
* `IntegralPayment.vue` --- 仅使用积分支付

这三个页面具体使用那个还是要根据比赛情况而定。

