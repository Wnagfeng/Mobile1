import request from '../utils/request'
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