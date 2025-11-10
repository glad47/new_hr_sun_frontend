import request from '@/utils/request'

// 查询الاستذان列表
export function listRequest(query) {
  return request({
    url: '/api/request/list',
    method: 'get',
    params: query
  })
}

// 查询الاستذان详细
export function getRequest(id) {
  return request({
    url: '/api/request/' + id,
    method: 'get'
  })
}

// 新增الاستذان
export function addRequest(data) {
  return request({
    url: '/api/request',
    method: 'post',
    data: data
  })
}

// 修改الاستذان
export function updateRequest(data) {
  return request({
    url: '/api/request',
    method: 'put',
    data: data
  })
}

// 删除الاستذان
export function delRequest(id) {
  return request({
    url: '/api/request/' + id,
    method: 'delete'
  })
}
