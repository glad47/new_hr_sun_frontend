import request from '@/utils/request'

// 查询طلبات الإجازات列表
export function listLeave(query) {
  return request({
    url: '/api/leave/list',
    method: 'get',
    params: query
  })
}

// 查询طلبات الإجازات详细
export function getLeave(id) {
  return request({
    url: '/api/leave/' + id,
    method: 'get'
  })
}

// 新增طلبات الإجازات
export function addLeave(data) {
  return request({
    url: '/api/leave',
    method: 'post',
    data: data
  })
}

// 修改طلبات الإجازات
export function updateLeave(data) {
  return request({
    url: '/api/leave',
    method: 'put',
    data: data
  })
}

// 删除طلبات الإجازات
export function delLeave(id) {
  return request({
    url: '/api/leave/' + id,
    method: 'delete'
  })
}
