import request from '@/utils/request'

// 查询الموظفون列表
export function listEmp(query) {
  return request({
    url: '/api/emp/list',
    method: 'get',
    params: query
  })
}


export function listSalary(query) {
  return request({
    url: '/api/emp/listSalary',
    method: 'get',
    params: query
  })
}

// 查询الموظفون详细
export function getEmp(id) {
  return request({
    url: '/api/emp/' + id,
    method: 'get'
  })
}

// 新增الموظفون
export function addEmp(data) {
  return request({
    url: '/api/emp',
    method: 'post',
    data: data
  })
}

// 修改الموظفون
export function updateEmp(data) {
  return request({
    url: '/api/emp',
    method: 'put',
    data: data
  })
}

// 删除الموظفون
export function delEmp(id) {
  return request({
    url: '/api/emp/' + id,
    method: 'delete'
  })
}
