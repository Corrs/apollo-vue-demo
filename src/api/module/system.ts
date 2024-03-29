import { useLazyQuery, useMutation, provideApolloClient, useSubscription } from '@vue/apollo-composable'
import { client } from '../apollo'
import gql from 'graphql-tag'

export const DEPTS = gql`
    query depts{ 
        depts {
            id
            name
            pid
            pname
            sort
        }
    }
`

/**
 * 查询部门树
 */
export const depts = provideApolloClient(client)(() => useLazyQuery(DEPTS))

/**
 * 新增部门
 */
export const addDept = provideApolloClient(client)(() => useMutation(gql`
    mutation addDept($dept: AddDeptDTO!){ 
        addDept(dept: $dept)
    }`, {
        refetchQueries: ['depts']
    }
))

/**
 * 删除部门
 */
export const remDept = provideApolloClient(client)(() => useMutation(gql`
    mutation remDept($id: Long!){ 
        remDept(id: $id)
    }`, {
        refetchQueries: ['depts']
    }
))

/**
 * 编辑部门
 */
export const editDept = provideApolloClient(client)(() => useMutation(gql`
    mutation editDept($dept: EditDeptDTO!){ 
        editDept(dept: $dept)
    }`, {
        refetchQueries: ['depts']
    }
))

/**
 * 登录日志查询
 */
export const loginLogsQuery = provideApolloClient(client)(() => useLazyQuery(gql`
    query loginLogs($cond: LogLoginQueryDTO!) {
        loginLogs(cond: $cond) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            total
            edges {
                cursor
                node {
                    id
                    username
                    operation
                    status
                    userAgent
                    ip
                    createTime
                }
            }
        }
    }`
))

/**
 * 操作日志查询
 */
export const operationLogsQuery = provideApolloClient(client)(() => useLazyQuery(gql`
    query operationLogs($p: Page! $query: OperationLogQueryDTO!) {
        operationLogs(p: $p, query: $query) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            total
            edges {
                cursor
                node {
                    id
                    username
                    operation
                    status
                    userAgent
                    ip
                    createTime
                    requestParams
                    requestTime
                }
            }
        }
    }`
))

/**
 * 字典管理分页查询gql
 */
const dictTypesGql = gql`
    query dictTypes($p: Page!, $query: DictTypeQueryDTO) {
        dictTypes(p: $p, query: $query) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            total
            edges {
                cursor
                node {
                    id
                    dictName
                    dictType
                    sort
                    remark
                    createTime
                }
            }
        }
    }
`

/**
 * 字典管理分页查询
 */
export const dictTypesQuery = provideApolloClient(client)(() => useLazyQuery(dictTypesGql))

/**
 * 新增字典
 */
export const addDictTypeMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addDictType($dictType: AddDictTypeDTO!){ 
        addDictType(dictType: $dictType)
    }`, {
        refetchQueries: ['dictTypes']
    }
))

/**
 * 编辑字典
 */
export const editDictTypeMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editDictType($dictType: EditDictTypeDTO!){ 
        editDictType(dictType: $dictType)
    }`, {
        refetchQueries: ['dictTypes']
    }
))

/**
 * 删除字典
 */
export const remDictTypeMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remDictType($id: Long!){ 
        remDictType(id: $id)
    }`, {
        refetchQueries: ['dictTypes']
    }
))

const dictDatasGql = gql`
    query dictDatas($p: Page!, $query: DictDataQueryDTO!) {
        dictDatas(p: $p, query: $query) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            total
            edges {
                cursor
                node {
                    id
                    dictLabel
                    dictValue
                    dictTypeId
                    sort
                    remark
                    createTime
                }
            }
        }
    }
`

/**
 * 字典数据分页查询
 */
export const dictDatasQuery = provideApolloClient(client)(() => useLazyQuery(dictDatasGql))

/**
 * 新增字典数据
 */
export const addDictDataMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addDictData($dictData: AddDictDataDTO!){ 
        addDictData(dictData: $dictData)
    }`, {
        refetchQueries: ['dictDatas']
    }
))

/**
 * 编辑字典数据
 */
export const editDictDataMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editDictData($dictData: EditDictDataDTO!){ 
        editDictData(dictData: $dictData)
    }`, {
        refetchQueries: ['dictDatas']
    }
))

/**
 * 删除字典数据
 */
export const remDictDataMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remDictData($ids: [Long!]!){ 
        remDictData(ids: $ids)
    }`, {
        refetchQueries: ['dictDatas']
    }
))

/**
 * 菜单查询 gql
 */
const menusGql = gql`
    query menus {
        menus {
            id
            name
            url
            perms
            icon
            type
            parentId
            sort
        }
    }
`

/**
 * 菜单查询
 */
export const menusQuery = provideApolloClient(client)(() => useLazyQuery(menusGql))

/**
 * 新增菜单
 */
export const addMenuMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addMenu($menu: AddMenuDTO!) {
        addMenu(menu: $menu)
    }`, {
        refetchQueries: ['menus']
    }
))

/**
 * 编辑菜单
 */
export const editMenuMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editMenu($menu: EditMenuDTO!) {
        editMenu(menu: $menu)
    }`, {
        refetchQueries: ['menus']
    }
))

/**
 * 删除菜单
 */
export const remMenuMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remMenu($id: Long!) {
        remMenu(id: $id)
    }`, {
      refetchQueries: ['menus']  
    }
))

/**
 * 角色查询 gql
 */
const rolesGql = gql`
    query roles($p: Page!, $roleName: String) {
        roles(p: $p, roleName: $roleName) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            total
            edges {
                cursor
                node {
                    id
                    roleName
                    remark
                    createTime
                }
            }
        }        
    }
`

/**
 * 角色查询
 */
export const rolesQuery = provideApolloClient(client)(() => useLazyQuery(rolesGql))

/**
 * 查询所有角色
 */
export const roleListQuery = provideApolloClient(client)(() => useLazyQuery(gql`
    query roleList {
        roleList {
            id
            roleName
            remark
            createTime
        }
    }`
))

/**
 * 新增角色
 */
export const addRoleMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addRole($role: AddRoleDTO!) {
        addRole(role: $role)
    }`, {
        refetchQueries: ['roles']
    }
))

/**
 * 编辑角色
 */
export const editRoleMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editRole($role: EditRoleDTO!) {
        editRole(role: $role)
    }`, {
        refetchQueries: ['roles']
    }
))

/**
 * 删除角色
 */
export const remRoleMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remRole($id: Long!) {
        remRole(id: $id)
    }`, {
        refetchQueries: ['roles']
    }
))

/**
 * 分配权限
 */
export const assignPermsMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation assignPerms($perms: AssignPermsDTO!) {
        assignPerms(perms: $perms)
    }`
))

/**
 * 查询角色分配的权限id集合
 */
export const rolePermsQuery = provideApolloClient(client)(() => useLazyQuery(gql`
    query rolePerms($roleId: Long!) {
        rolePerms(roleId: $roleId)
    }`
))

const usersGql = gql`
    query users($p: Page!, $query: UserQueryDTO!) {
        users(p: $p, query: $query) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            total
            edges {
                cursor
                node {
                    id
                    username
                    realName
                    gender
                    status
                    isDeleted
                    deptId
                    roleId
                    email
                    mobile
                    createTime
                }
            }
        }
    }
`

/**
 * 分页查询用户
 */
export const usersQuery = provideApolloClient(client)(() => useLazyQuery(usersGql))

/**
 * 新增用户
 */
export const addUserMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addUser($user:AddUserDTO!) {
        addUser(user: $user)
    }`, {
        refetchQueries: ['users']
    }
))

/**
 * 重置密码
 */
export const resetPasswordMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation resetPassword($userId: Long!) {
        resetPassword(userId: $userId)
    }`, {refetchQueries: ['users']}
))

/**
 * 删除用户
 */
export const remUserMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remUser($userId: Long!) {
        remUser(userId: $userId)
    }`, {refetchQueries: ['users']}
))

/**
 * 切换用户状态
 */
export const chgUserStatusMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation chgUserStatus($userId: Long!) {
        chgUserStatus(userId: $userId)
    }`, {refetchQueries: ['users']}
))

/**
 * 编辑用户
 */
export const editUserMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editUser($user: EditUserDTO!) {
        editUser(user: $user)
    }`,{
        refetchQueries: ['users']
    }
))

/**
 * 修改密码
 */
export const modifyPasswordMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation modifyPassword($pwd: ModifyPasswordDTO!) {
        modifyPassword(pwd: $pwd)
    }
`))

/**
 * 查询定时任务
 */
export const dynamicJobQuery = provideApolloClient(client)(() => useLazyQuery(gql`
    query dynamicJobs($page: Page!, $query: DynamicJobQueryDTO!) {
        dynamicJobs(page: $page, query: $query) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            total
            edges {
                cursor
                node {
                    id
                    jobName
                    jobGroup
                    jobClassName
                    status
                    jobData
                    description
                    triggerType
                    triggerRule
                    firstRuntime
                    createTime
                    updateTime
                }
            }
        }
    }
`))

/**
 * 删除定时任务
 */
export const remDynamicJobMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remDynamicJob($id: Long!) {
        remDynamicJob(id: $id)
    }`,{
        refetchQueries: ['dynamicJobs']
    }
))

/**
 * 修改定时任务
 */
export const editDynamicJobMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editDynamicJob($job: EditDynamicJobDTO!) {
        editDynamicJob(job: $job)
    }`,{
        refetchQueries: ['dynamicJobs']
    }
))

/**
 * 新增定时任务
 */
export const addDynamicJobMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addDynamicJob($job: AddDynamicJobDTO!) {
        addDynamicJob(job: $job)
    }`,{
        refetchQueries: ['dynamicJobs']
    }
))

/**
 * 切换定时任务运行状态
 */
export const switchDynamicJobMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation switchDynamicJob($id: Long!) {
        switchDynamicJob(id: $id)
    }`,{
        refetchQueries: ['dynamicJobs']
    }
))

export const greetingSubscription = (variables: any) => {
    return provideApolloClient(client)(() => useSubscription(gql`
        subscription greeting($id: Int) {
            greeting(id: $id)
        }`, 
        variables
    ))
}