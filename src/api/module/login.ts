import { useLazyQuery, useMutation, provideApolloClient } from '@vue/apollo-composable'
import { client } from '../apollo'
import gql from 'graphql-tag'

export const loginCaptcha = provideApolloClient(client)(() => useLazyQuery(gql`
    query loginCaptcha{ 
        loginCaptcha {
            image
            key
        }
    }`
))

export const loginMutation = provideApolloClient(client)(() => useMutation(gql`
    mutation login($username: String!, $password: String!, $captcha: String!) {
        login(username: $username, password: $password, captcha: $captcha) {
            authenticationToken
            user {
                username
                realName
                avatar
                deptId
                superAdmin
                userId
                email
                mobile
            }
            permissions {
                id
                parentId
                name
                url
                sort
                type
                icon
                perms
            }
        }
    }`
))

export const logoutMutation = provideApolloClient(client)(() => useMutation(gql`mutation logout { logout }`))