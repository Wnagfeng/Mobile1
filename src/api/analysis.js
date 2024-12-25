import request from '../utils/request'
// 消费分析接口
export function getAnalysisData() {
    return request({
        url: '/userAnalysis',
        method: 'get'
    })
}