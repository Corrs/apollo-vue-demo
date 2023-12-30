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
                userId
                email
                mobile
            }
        }
    }`
))
