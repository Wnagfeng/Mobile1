/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/',
    component: () => import('../views/layouts/index.vue'),
    redirect: '/home',
    meta: {
        title: '首页',
        keepAlive: false
    },
    children: [
        {
            path: '/home',
            name: 'Home',
            component: () => import('../views/home/index.vue'),
            meta: {
                title: '首页',
                keepAlive: false,
                tabBar: true, // 是否显示底部标签栏 true 显示 false不显示
                navBar: false// 是否显示顶部导航栏 true 显示 false不显示
                // requireAuth:true //是否需要登录才能进
            }
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('../views/home/register.vue'),
            meta: {
                title: '注册',
                keepAlive: false,
                tabBar: false,
                navBar: false
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/home/login.vue'),
            meta: {
                title: '登录',
                keepAlive: false,
                tabBar: false,
                navBar: false
            }
        },

        {
            path: '/userIndex',
            name: 'User',
            component: () => import('../views/user/index.vue'),
            meta: {
                title: '',
                keepAlive: false,
                tabBar: true,
                navBar: false,
                requireAuth: false
            }
        },
        {
            path: '/nullPage',
            name: 'NullPage',
            component: () => import('../views/home/nullPage.vue'),
            meta: {
                title: '404',
                keepAlive: false,
                tabBar: true,
                navBar: false,
                requireAuth: false
            }
        },
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
        {
            path: '/productClassify',
            name: 'ProductClassify',
            component: () => import('../views/classify/productClassify.vue'),
            meta: {
                title: '商品分类',
                keepAlive: false,
                tabBar: true,
                navBar: true
            }
        },
        {
            path: '/Cart',
            name: 'Cart',
            component: () => import('../views/cart/cart.vue'),
            meta: {
                title: '购物车',
                keepAlive: false,
                tabBar: false,
                navBar: true,
                requireAuth: false
            }
        },
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
        },
        // 2.创建订单页面
        {
            path: '/createOrder',
            name: 'createOrder',
            component: () => import('../views/order/BalancePayment.vue'),
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
                requireAuth: false
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
        // 8.添加地址页面
        {
            path: '/newContact',
            name: 'NewContact',
            component: () => import('@/views/contactList/newContact'),
            meta: {
                title: '联系人',
                keepAlive: false,
                tabBar: false,
                navBar: true,
                requireAuth: false
            }
        },
        // 9.订单orderSatus页面
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
            }
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

    ]
}]
