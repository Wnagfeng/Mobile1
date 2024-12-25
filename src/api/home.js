import request from '@/utils/request'

// 首页数据
export function getData() {
  return request({
    url: '/index',
    method: 'get'
  })
}

// 首页轮播图
export function getBanner() {
  return request({
    url: '/index/banner',
    method: 'get'
  })
}

// 首页  菜单
export function getMenus() {
  return request({
    url: '/index/menus',
    method: 'get'
  })
}
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

export default {
  getData,
  getMenus,
  getBanner
}
