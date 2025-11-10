import request from '@/utils/request'

// 查询الخصومات列表
export function listDedection(query) {
  return request({
    url: '/api/dedection/list',
    method: 'get',
    params: query
  })
}

// 查询الخصومات详细
export function getDedection(id) {
  return request({
    url: '/api/dedection/' + id,
    method: 'get'
  })
}

// 新增الخصومات
export function addDedection(data) {
  return request({
    url: '/api/dedection',
    method: 'post',
    data: data
  })
}

// 修改الخصومات
export function updateDedection(data) {
  return request({
    url: '/api/dedection',
    method: 'put',
    data: data
  })
}

// 删除الخصومات
export function delDedection(id) {
  return request({
    url: '/api/dedection/' + id,
    method: 'delete'
  })
}
