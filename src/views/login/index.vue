<template>
  <div class="login-wrap">
    <div class="login-root">
      <div class="login-main">
        <img class="login-one-ball"
          src="https://assets.codehub.cn/micro-frontend/login/fca1d5960ccf0dfc8e32719d8a1d80d2.png" />
        <img class="login-two-ball"
          src="https://assets.codehub.cn/micro-frontend/login/4bcf705dad662b33a4fc24aaa67f6234.png" />
        <div class="login-container">
          <div class="login-side">
            <div class="login-bg-title">
              <h1>澳洲呼叫中心</h1>

              <h3 style="margin: 20px auto">
                管理平台
              </h3>
            </div>
          </div>
          <div class="login-ID">
            <div style="font-size: 22px; margin-bottom: 30px; margin-top: 80px; text-align: center;">
              <!-- 🎯 Sign in -->登录
            </div>
            <div style="height: 250px">
              <lay-form-item :label-width="0">
                <lay-input :allow-clear="true" prefix-icon="layui-icon-username" placeholder="用户名"
                  v-model="loginForm.username"></lay-input>
              </lay-form-item>
              <lay-form-item :label-width="0">
                <lay-input :allow-clear="true" prefix-icon="layui-icon-password" placeholder="密码" password
                  type="password" v-model="loginForm.password"></lay-input>
              </lay-form-item>
              <lay-form-item :label-width="0">
                <div style="width: 264px; display: inline-block">
                  <lay-input :allow-clear="true" prefix-icon="layui-icon-vercode" placeholder="验证码"
                    v-model="loginForm.captcha"></lay-input>
                </div>

                <lay-space class="login-captach" @click="refetchCaptcha()" >
                  <lay-tooltip content="点击刷新验证码，验证码有效期5分钟">
                    <img style="width: 100%" :src="captchaResult?.loginCaptcha?.image" alt="获取验证码" />
                  </lay-tooltip>
                </lay-space>
                <!-- <div class="login-captach" title="点击刷新验证码" @click="refetchCaptcha()">
                  <img style="width: 100%" :src="captchaResult?.loginCaptcha?.image" alt="获取验证码" />
                </div> -->
              </lay-form-item>
              <!-- <lay-checkbox value="" name="like" v-model="remember" skin="primary" label="1">记住密码</lay-checkbox> -->
              <lay-form-item :label-width="0">
                <lay-button style="margin-top: 20px" type="primary" :loading="loging" :fluid="true"
                  loadingIcon="layui-icon-loading" @click="loginSubmit">登录</lay-button>
              </lay-form-item>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { loginCaptcha, loginMutation } from '../../api/module/login'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import md5 from 'js-md5'
import { layer } from '@layui/layer-vue'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const method = ref('1')
    const remember = ref(false)
    const loginForm = reactive({
      username: '',
      password: '',
      captcha: ''
    })
    const CAPTCHA_KEY = 'captchaKey'

    const { result: captchaResult, refetch: refetchCaptcha, load: loadCaptcha } = loginCaptcha
    onMounted(() => {
      userStore.clear()
      loadCaptcha() || refetchCaptcha()
    })
    watch(captchaResult, value => {
      // 缓存captchaKey，在请求头中携带，登录成功后删除
      localStorage.setItem(CAPTCHA_KEY, value?.loginCaptcha?.key)
    })

    const { mutate: login, onDone: loginDone, loading: loginLoading, onError: loginError } = loginMutation

    const loginSubmit = async () => {
      const loginParam = {
        ...loginForm,
        password: md5(md5(loginForm.password))
      }
      login(loginParam)
      loginDone(result => {
        const data = result.data?.login
        if (data) {
          layer.msg("登录成功", { icon: 1 }, async () => {
            localStorage.removeItem(CAPTCHA_KEY)
            userStore.userInfo = data.user
            userStore.token = data.authenticationToken
            userStore.loadMenusAndPermissions(data.permissions)
            router.push('/')
          })
        }
      })
      loginError(err => {
        const graphQLErrors = err.graphQLErrors
        if (graphQLErrors?.length??0) {
          const gError = graphQLErrors[0]
          const errCode = gError.extensions?.errCode
          if (errCode === 'LOGIN_CAPTCHA_EXPIRE' || errCode === 'LOGIN_CAPTCHA_FAIL') {
            // 验证码过期
            refetchCaptcha()
          }
        }
      })
    }

    return {
      captchaResult,
      refetchCaptcha,
      loginSubmit,
      loginForm,
      remember,
      method,
      loging: loginLoading
    }
  }
})
</script>

<style scoped>
.login-captach {
  display: inline-block;
  vertical-align: bottom;
  width: 108px;
  height: 40px;
  color: var(--global-primary-color);
  margin-left: 8px;
  border-radius: 4px;
  border: 1px solid hsla(0, 0%, 60%, 0.46);
  transition: border 0.2s;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
}

.login-one-ball {
  opacity: 0.4;
  position: absolute;
  max-width: 568px;
  left: -400px;
  bottom: 0px;
}

.login-two-ball {
  opacity: 0.4;
  position: absolute;
  max-width: 320px;
  right: -200px;
  top: -60px;
}

.login-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  min-width: 600px;
  z-index: 9;
  background-image: url(https://assets.codehub.cn/micro-frontend/login/f7eeecbeccefe963298c23b54741d473.png);
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}

.login-wrap :deep(.layui-input-block) {
  margin-left: 0 !important;
}

.login-root {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 320px;
  background-color: initial;
}

.login-main {
  position: relative;
  display: block;
}

.logo-container {
  max-width: calc(100vw - 28px);
  margin-bottom: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container .logo {
  display: inline-block;
  height: 30px;
  width: 143px;
  background: url() no-repeat 50%;
  background-size: contain;
  cursor: pointer;
}

.login-container {
  position: relative;
  overflow: hidden;
  width: 940px;
  height: 520px;
  max-width: calc(100vw - 28px);
  border-radius: 4px;
  background: hsla(0, 0%, 100%, 0.5);
  backdrop-filter: blur(30px);
  display: flex;
  box-shadow: 6px 6px 12px 4px rgba(0, 0, 0, 0.1);
}

.login-side {
  padding: 40px 20px 20px;
  background-color: var(--global-primary-color);
  flex: 1;
  height: 100%;
}

.login-bg-title {
  flex: 1;
  height: 84%;
  color: #fff;
  text-align: center;
  background-image: url('../../assets/login/login-bg.svg');
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: contain;
  text-align: center;
  min-width: 200px;
}

.login-ID {
  padding: 20px;
  width: 380px;
  min-width: 380px;
}

.login-container .layui-tab-head {
  background: transparent;
}

.login-container .layui-input-wrapper {
  margin-top: 10px;
  margin-bottom: 10px;
}

.login-container .layui-input-wrapper {
  margin-top: 12px;
  margin-bottom: 12px;
}

.login-container .assist {
  margin-top: 5px;
  margin-bottom: 5px;
  letter-spacing: 2px;
}

.login-container .layui-btn {
  margin: 10px 0px 10px 0px;
  letter-spacing: 2px;
  height: 40px;
}

.login-container .layui-line-horizontal {
  letter-spacing: 2px;
  margin-bottom: 34px;
  margin-top: 24px;
}

.other-ways {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  font-weight: 400;
}

.other-ways li {
  width: 100%;
}

.line-container {
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.line-container .icon {
  height: 28px;
  width: 28px;
  margin-right: 0;
  vertical-align: middle;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgb(9 30 66 / 4%), 0 1px 4px 0 rgb(9 30 66 / 10%),
    0 0 1px 0 rgb(9 30 66 / 10%);
}

.line-container .text {
  display: block;
  margin: 12px 0 0;
  font-size: 12px;
  color: #8592a6;
}

:deep(.layui-tab-title .layui-this) {
  background-color: transparent;
}
</style>
