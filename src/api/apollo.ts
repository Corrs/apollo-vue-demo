import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink, concat } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { layer } from '@layui/layer-vue'
import { useUserStore } from '../store/user'
import createUploadLink from "apollo-upload-client/createUploadLink.mjs"

const BASE_URI = process.env.BASE_URI
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    const error = graphQLErrors[0]
    const classification = error.extensions?.classification ?? null
    if (classification === 'UNAUTHORIZED') {
      // todo 提示登录过期或未登录，调用退出登录方法
      console.log("登录过期或未登录")
      layer.msg("登录过期或未登录", { icon: 2 }, () => {
        const userInfoStore = useUserStore()
        userInfoStore.logout()
        // 这里没有办法用vue-router
        window.location.hash = '/login'
      })
    } else if (classification === 'FORBIDDEN') {
      const path = error.path?.values()?.next()?.value
      // todo 提示无访问权限
      console.log(`无访问【${path}】的权限`)
      layer.msg(`无访问【${path}】的权限`, { icon: 2 })
    } else if (classification === 'INTERNAL_ERROR') {
      console.log('业务异常')
      layer.msg(error.message, { icon: 2 })
    } else if (classification === 'ValidationError') {
      console.log('graphql校验异常', error.message)
      layer.msg('校验异常', { icon: 2 })
    }
  }
  if (networkError) {
    // todo 提示网络异常，请稍后
    console.log(`[Network error]: ${networkError}`)
  }
})

const httpLink = createHttpLink({ 
  uri: BASE_URI,
})
const authMiddleware = new ApolloLink((operation, forward) => {
  const user = localStorage.getItem('user')
  const captchaKey = localStorage.getItem('captchaKey')
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      timestamp: new Date().getTime(),
      captchaKey: captchaKey ? captchaKey : "",
      Authentication: user ? JSON.parse(user)?.token : ""
    }
  }))
  return forward(operation);
})

// Cache implementation
const cache = new InMemoryCache()

export const client = new ApolloClient({
  cache: cache,
  link: concat(authMiddleware, errorLink.concat(httpLink)),
  name: 'aus-call-center-client',
  version: '1.3',
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'network-only'
    },
  },
});

const uploadLink = createUploadLink({ uri: BASE_URI })
export const uploadClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, errorLink.concat(uploadLink))
})