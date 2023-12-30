import { useLazyQuery, useMutation, provideApolloClient } from '@vue/apollo-composable'
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