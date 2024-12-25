//添加收藏
import request from '../utils/request'
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
