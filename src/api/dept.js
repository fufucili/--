import request from '@/utils/request'

//部门列表查询
export const queryAllApi = () =>  request.get('/depts');

//新增部门
export const addApi = (dept) => request.post('/depts', dept)

//根据ID查询部门
export const queryInfoApi = (id) => request.get(`/depts/${id}`)

//更新部门
export const updateApi = (dept) => request.put(`/depts`, dept)

//删除部门
export const deleteApi = (id) => request.delete(`/depts?id=${id}`)