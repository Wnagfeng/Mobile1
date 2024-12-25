
---

# Mobile Exercise Guide:memo:

```js
Written By CoderJoon
Time: 2024-09-19 —— 2024-09-24
```

***

### 0. About Replacements:pencil2:

I have labeled all the replacements I made.

```js
<!-- Replace url -->
```

### 1. Prerequisites:lock:

To practice this project, I downgraded the version on my local machine. Below are the environment requirements for running this `Mobile` project:

| Environment Type | Version Number |
| ---------------- | -------------- |
| Node             | ^14.17.6      |
| `Vant—UI`       | ^2.12.21      |
| `Vue—Router`    | ^3.0.1        |
| `Vue`           | ^2.5.2        |
| `Npm`           | 6.14.15       |

In addition to the above environment, it is recommended that you check file uploads and image displays before starting the practice; this is not a standard image display.

Backend:

https://github.com/Wnagfeng/StaticexampleBack

Frontend:

https://github.com/Wnagfeng/staticExample

### 2. Project Initialization:rocket:

```shell
npm install -g @vue/cli@4.5.13  `--- The last one that matches vue 2.5.14`
vue create Pc
```

### 3. About Routing:wrench:

In the `router.config.js` file, the host has configured `requireAuth` for some pages to perform login validation. I have turned this off; no verification is needed. You can switch it on later!

### 4. About API Requests :chart_with_upwards_trend:

Below are the API requests you might need to add yourself:

```js
//---------------------------------------------------------------------------------------------------
// home.js
// Home page recommendations
export function getBastList() {
	return request({
		url: '/index/bastList',
		method: 'get'
	})
}
// Home page "You might like"
export function getLike() {
	return request({
		url: '/index/like',
		method: 'get'
	})
}

//---------------------------------------------------------------------------------------------------
// cart.js
// Add to cart
export function addCart(data) {
    return request({
        url: '/cart/add',
        method: 'post',
        data
    })
}
// Get order and cart list
export function getCartList(data) {
    return request({
        url: '/cart/list',
        method: 'get',
        params: data
    })
}
// Modify cart
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
// collect.js
// Add to favorites
export function collect(data) {
    return request({
        url: '/collect/add',
        method: 'post',
        data
    })
}
// Delete from favorites
export function delCollect(data) {
    return request({
        url: '/collect/del',
        method: 'post',
        data
    })
}
// Get favorites list
export function getCollect(data) {
	return request({
		url: '/collect/user?type=' + data.type,
		method: 'get'
	})
}
// Batch delete favorites
export function delCollects(data) {
	return request({
		url: '/collect/dels/' + data.productIds,
		method: 'post',
		data
	})
}
//---------------------------------------------------------------------------------------------------
// product.js
// Get product details
export function getProduct(data) {
    return request({
        url: '/product/detail/' + data,
        method: 'get'
    })
}
// Get product list
export function getProductList(data) {
    return request({
        url: '/products',
        method: 'get',
        params: data
    })
}
//---------------------------------------------------------------------------------------------------
// address.js
// Add or modify address
export function editAddress(data) {
	return request({
		url: '/address/edit',
		method: 'post',
		data
	})
}
// Address list
export function getAddress(data) {
	return request({
		url: '/address/list',
		method: 'get',
		params: data
	})
}
// Get address details
export function getDataDetails(data) {
	return request({
		url: '/address/detail/' + data.id,
		method: 'get'
	})
}
// Delete address
export function delAddress(data) {
	return request({
		url: '/address/del',
		method: 'post',
		data
	})
}
//---------------------------------------------------------------------------------------------------
// order.js
// Get order list
export function getOrderList(data) {
    return request({
        url: '/order/list',
        method: 'get',
        params: data
    })
}
// Calculate order amount
export function getOrderSum(data) {
    return request({
        url: '/order/computed/' + data.key,
        method: 'post',
        data
    })
}
// Create order information
export function createOrder(data) {
	return request({
		url: '/order/create/' + data.key,
		method: 'post',
		data
	})
}
// Order confirmation
export function getOrderInfo(data) {
    return request({
        url: '/order/confirm',
        method: 'post',
        data
    })
}
// Order details
export function order(data) {
    return request({
        url: '/order/detail/' + data,
        method: 'get'
    })
}
//---------------------------------------------------------------------------------------------------
// discount.js
// Get order coupons
export function getOrderCoupons(data) {
    return request({
        url: '/coupons/order/' + data,
        method: 'get'
    })
}
//---------------------------------------------------------------------------------------------------
// search.js
// Query hot keywords
export function getSearchKeyword(data) {
    return request({
        url: '/search/keyword',
        method: 'get',
        params: data
    })
}

// Search products
export function products(data) {
    return request({
        url: '/products',
        method: 'get',
        params: data
    })
}
//---------------------------------------------------------------------------------------------------
// productClassify.js
// Get categories
export function getData() {
    return request({
        url: '/category',
        method: 'get'
    })
}
//---------------------------------------------------------------------------------------------------
// analysis.js
// Consumption analysis interface
export function getAnalysisData() {
    return request({
        url: '/userAnalysis',
        method: 'get'
    })
}
```

### 5. About Routing:sparkles:

Below are the routes you might need to add:

```js
 // Custom added routes
// 1. Product details page
{
    path: '/productDetails',
    name: 'ProductDetails',
    component: () => import('../views/productDetails/productDetails.vue'),
    meta: {
        title: 'Product Details',
        keepAlive: false,
        tabBar: false,
        navBar: true
    }
}
// 2. Create order page
{
    path: '/createOrder',
    name: 'createOrder',
    component: () => import('../views/order/createOrder.vue'),
    meta: {
        title: 'Create Order',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 3. Search page
{
    path: '/search',
    name: 'Search',
    component: () => import('../views/home/search.vue'),
    meta: {
        title: 'Search',
        keepAlive: false,
        tabBar: true,
        navBar: false
    }
},
// 4. All products page
{
    path: '/productList',
    name: 'ProductList',
    component: () => import('../views/productList/productList.vue'),
    meta: {
        title: 'Product List',
        keepAlive: false,
        tabBar: true,
        navBar: true
    }
},
// 5. My Wallet page
{
    path: '/wallet',
    name: 'Wallet',
    component: () => import('@/views/user/wallet'),
    meta: {
        title: 'My Wallet',
        keepAlive: false,
        tabBar: true,
        navBar: true,
        requireAuth: true
    }
},
// 6. My Favorites and Footprints page
{
    path: '/collect',
    name: 'Collect',
    component: () => import('../views/collect/collect.vue'),
    meta: {
        title: 'My Favorites',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false // Whether login is required
    }
},
// 7. Add Address page
{
    path: '/contactList',
    name: 'ContactList',
    component: () => import('@/views/contactList/contactList'),
    meta: {
        title: 'Contact List',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 8. Order page
{
    path: '/orderStatus',
    name: 'OrderStatus',
    component: () => import('@/views/order/orderStatus'),
    meta: {
        title: 'Order',
        keepAlive: false,
        tabBar: true,
        navBar: true,
        requireAuth: false
    }
},
// 9. Order details page
{
    path: '/orderDetail',
    name: 'OrderDetail',
    component: () => import('../views/order/orderDetail.vue'),
    meta: {
        title: 'Order Details',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 10. Payment successful page
{
    path: '/paySuccess',
    name: 'PaySuccess',
    component: () => import('@/views/order/paySuccess'),
    meta: {
        title: 'Payment Successful',
        keepAlive: false,
        tabBar: false,
        navBar: true,
        requireAuth: false
    }
},
// 11. Consumption analysis page
{
    path: "/analysis",
    name: "Analysis",
    component: () => import("../views/analysis/analysis.vue"),
    meta: {
        title: "Consumption Analysis",
        keepAlive: false,
        tabBar: true,
        navBar: true,
        requireAuth: false
    }
}
```

### 6. About the Product Details Page:rocket:

The selection of product specifications on this page can be a bit tricky due to the complexity of the data structure. Here is a detailed explanation:

#### 6.1 Prerequisites:bookmark:

To understand how the specifications are implemented, you first need to comprehend how the data is processed. We need to determine the format of the data we will be handling.

In the `ProductDetail.html` file under this project, I have provided a detailed explanation, including the filtering process. It is advisable to check it out.

#### 6.2 Detailed Explanation:green_heart:

If you understand how the data format is filtered and which data formats we need, I will provide a detailed explanation of the `vant` component `vant-sku`. Once you grasp this, it should not be difficult to implement functionality!

The essence of selecting specifications is to correlate the data; for example, if I currently have two packages, 8+128 and 12+512, along with color packages, they are ultimately filtered out from the `sku` object’s list, taking stock, unit price, and so on, and then sent to the backend for processing.

### 7. About `eslint`:bento:

Due to the use of unknown "spaghetti" code in this project, I had to disable all rules.

I added the rule `src/*` to `.eslintignore` to disable all rule checks under `src`.

### 8. Summary of Exercises:alien:

* ①：Implement the home page recommendations and "You might like" list layout in the mobile mall :white_check_mark:
* ②：Implement address management functionality in the mobile personal center​ :white_check_mark:
* ③：Implement the home page search functionality in the mobile terminal :white_check_mark:
* ④：Implement the product list functionality in the mobile mall :white_check_mark:
* ⑤：Implement consumption analysis in the mobile mall personal center (mandatory) :white_check_mark:
* ⑥：Implement order placement in the mobile mall :white_check_mark:
* ⑦：Implement shopping cart functionality in the mobile mall :white_check_mark:
* ⑧：Complete the recharge page for "My Wallet"​ :white_check_mark:
* ⑨：Complete the pages for "My Favorites" and "My Footprints"​ :white_check_mark:
* ⑩：Complete the mobile terminal order details page with five statuses :white_check_mark:

### 9. About the Create Order Page:zap:

This page may have two payment methods: one for purchasing products using balance, which does not require much explanation, and another for redeeming products using points, which requires point-based payment. To implement this page, I created three pages:

* `BalancePayment.vue` — Only for balance payment
* `createOrder.vue` — Both balance and point payments
* `IntegralPayment.vue` — Only for point payment

Which page to use will depend on the competition situation.

---

