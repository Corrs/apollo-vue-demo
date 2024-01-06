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