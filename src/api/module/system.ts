import { useLazyQuery, useMutation, useQuery, provideApolloClient } from '@vue/apollo-composable'
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
        addDept(dept: $dept) {
            id
            name
            pid
            pname
            sort
        }
    }`
))

/**
 * 删除部门
 */
export const remDept = provideApolloClient(client)(() => useMutation(gql`
    mutation remDept($id: Long!){ 
        remDept(id: $id)
    }`
))

/**
 * 编辑部门
 */
export const editDept = provideApolloClient(client)(() => useMutation(gql`
    mutation editDept($dept: EditDeptDTO!){ 
        editDept(dept: $dept) {
            id
            name
            pid
            pname
            sort
        }
    }`
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
    }`, {
        cond: {
            username: '',
            status: null,
            startTime: null,
            endTime: null,
            current: 1,
            limit: 10
        }
    }
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
    }`, {
        p: {
            current: 1,
            limit: 10
        },
        query: {
            startTime: '',
            endTime: '',
            status: null
        }
    }
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
export const dictTypesQuery = provideApolloClient(client)(() => useLazyQuery(dictTypesGql, {
        p: {
            current: 1,
            limit: 10
        },
        query: {
            dictName: '',
            dictType: ''
        }
    }
))

/**
 * 新增字典
 */
export const addDictTypeMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addDictType($dictType: AddDictTypeDTO!){ 
        addDictType(dictType: $dictType)
    }`, {
        refetchQueries: [dictTypesGql, 'dictTypes']
    }
))

/**
 * 编辑字典
 */
export const editDictTypeMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editDictType($dictType: EditDictTypeDTO!){ 
        editDictType(dictType: $dictType)
    }`, {
        refetchQueries: [dictTypesGql, 'dictTypes']
    }
))

/**
 * 删除字典
 */
export const remDictTypeMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remDictType($id: Long!){ 
        remDictType(id: $id)
    }`, {
        refetchQueries: [dictTypesGql, 'dictTypes']
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
export const dictDatasQuery = provideApolloClient(client)(() => useLazyQuery(dictDatasGql, {
    p: {
        current: 1,
        limit: 10
    },
    query: {
        dictTypeId: 0,
        dictLabel: '',
        dictValue: ''
    }
}
))

/**
 * 新增字典数据
 */
export const addDictDataMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addDictData($dictData: AddDictDataDTO!){ 
        addDictData(dictData: $dictData)
    }`, {
        refetchQueries: [dictDatasGql, 'dictDatas']
    }
))

/**
 * 编辑字典数据
 */
export const editDictDataMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editDictData($dictData: EditDictDataDTO!){ 
        editDictData(dictData: $dictData)
    }`, {
        refetchQueries: [dictDatasGql, 'dictDatas']
    }
))

/**
 * 删除字典数据
 */
export const remDictDataMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remDictData($ids: [Long!]!){ 
        remDictData(ids: $ids)
    }`, {
        refetchQueries: [dictDatasGql, 'dictDatas']
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
        refetchQueries: [menusGql, 'menus']
    }
))

/**
 * 编辑菜单
 */
export const editMenuMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editMenu($menu: EditMenuDTO!) {
        editMenu(menu: $menu)
    }`, {
        refetchQueries: [menusGql, 'menus']
    }
))

/**
 * 删除菜单
 */
export const remMenuMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remMenu($id: Long!) {
        remMenu(id: $id)
    }`, {
      refetchQueries: [menusGql, 'menus']  
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
export const rolesQuery = provideApolloClient(client)(() => useLazyQuery(rolesGql, {
    p: {
        current: 1,
        limit: 10
    },
    roleName: '' 
}))

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
        refetchQueries: [rolesGql, 'roles']
    }
))

/**
 * 编辑角色
 */
export const editRoleMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editRole($role: EditRoleDTO!) {
        editRole(role: $role)
    }`, {
        refetchQueries: [rolesGql, 'roles']
    }
))

/**
 * 删除角色
 */
export const remRoleMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remRole($id: Long!) {
        remRole(id: $id)
    }`, {
        refetchQueries: [rolesGql, 'roles']
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
    }`, {
        roleId: 0
    }
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
export const usersQuery = provideApolloClient(client)(() => useLazyQuery(usersGql, {
    p: {
        current: 1,
        limit: 10
    },
    query: {}
}))

/**
 * 新增用户
 */
export const addUserMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation addUser($user:AddUserDTO!) {
        addUser(user: $user)
    }`, {
        refetchQueries: [usersGql, 'users']
    }
))

/**
 * 重置密码
 */
export const resetPasswordMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation resetPassword($userId: Long!) {
        resetPassword(userId: $userId)
    }`, {refetchQueries: [usersGql, 'users']}
))

/**
 * 删除用户
 */
export const remUserMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation remUser($userId: Long!) {
        remUser(userId: $userId)
    }`, {refetchQueries: [usersGql, 'users']}
))

/**
 * 切换用户状态
 */
export const chgUserStatusMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation chgUserStatus($userId: Long!) {
        chgUserStatus(userId: $userId)
    }`, {refetchQueries: [usersGql, 'users']}
))

/**
 * 编辑用户
 */
export const editUserMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation editUser($user: EditUserDTO!) {
        editUser(user: $user)
    }`,{
        refetchQueries: [usersGql, 'users']
    }
))