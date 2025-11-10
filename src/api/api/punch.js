import request from '@/utils/request'

// 查询تغيير البصمة列表
export function listPunch(query) {
  return request({
    url: '/api/punch/list',
    method: 'get',
    params: query
  })
}

// 查询تغيير البصمة详细
export function getPunch(id) {
  return request({
    url: '/api/punch/' + id,
    method: 'get'
  })
}

// 新增تغيير البصمة
export function addPunch(data) {
  return request({
    url: '/api/punch',
    method: 'post',
    data: data
  })
}

// 修改تغيير البصمة
export function updatePunch(data) {
  return request({
    url: '/api/punch',
    method: 'put',
    data: data
  })
}

// 删除تغيير البصمة
export function delPunch(id) {
  return request({
    url: '/api/punch/' + id,
    method: 'delete'
  })
}
