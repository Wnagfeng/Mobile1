import request from '../utils/request'
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
// 订单state页面
//取消订单
export function cancelOrder(data) {
    return request({
        url: '/order/cancel',
        method: 'post',
        data
    })
}
//订单支付
export function payOrder(data) {
    return request({
        url: '/order/pay',
        method: 'post',
        data
    })
}
//订单收货
export function takeOrder(data) {
    return request({
        url: '/order/take',
        method: 'post',
        data
    })
}
//订单del
export function delOrder(data) {
    return request({
        url: '/order/del',
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
