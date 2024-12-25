
import request from '../utils/request'
//添加购物车
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