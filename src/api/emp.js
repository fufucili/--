import request from '@/utils/request'

//分页条件查询
export const queryPageApi = (begin, end, gender, name, page, pageSize) => 
  request.get(`/emps?begin=${begin}&end=${end}&gender=${gender}&name=${name}&page=${page}&pageSize=${pageSize}`)

//新增员工
export const addApi = (emp) => request.post('/emps', emp)

//根据ID查询员工
export const queryInfoApi = (id) => request.get(`/emps/${id}`)

//更新员工
export const updateApi = (emp) => request.put(`/emps`, emp)

//删除员工
export const deleteApi = (ids) => request.delete(`/emps?ids=${ids}`)

//查询全部员工信息
export const queryAllApi = () => request.get('/emps/list') 

//修改密码
export const changePasswordApi = (pass) => request.put(`/emps/changePassword`, pass)
