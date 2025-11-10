import request from '@/utils/request'

// 查询الإضافات列表
export function listAddition(query) {
  return request({
    url: '/api/addition/list',
    method: 'get',
    params: query
  })
}

// 查询الإضافات详细
export function getAddition(id) {
  return request({
    url: '/api/addition/' + id,
    method: 'get'
  })
}

// 新增الإضافات
export function addAddition(data) {
  return request({
    url: '/api/addition',
    method: 'post',
    data: data
  })
}

// 修改الإضافات
export function updateAddition(data) {
  return request({
    url: '/api/addition',
    method: 'put',
    data: data
  })
}

// 删除الإضافات
export function delAddition(id) {
  return request({
    url: '/api/addition/' + id,
    method: 'delete'
  })
}
