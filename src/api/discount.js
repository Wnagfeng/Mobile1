import request from '../utils/request'
//获取订单优惠券
export function getOrderCoupons(data) {
    return request({
        url: '/coupons/order/' + data,
        method: 'get'

    })
}