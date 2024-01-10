
import { errorMsg } from '../../../library/layerUtil';
<template>
  <lay-container fluid="true" class="container-box">
    <lay-card style="padding: 40px">
      <lay-row>
        <lay-col :md="10" :md-offset="7">
          <lay-form ref="formRef" :model="model" required :rules="formRules">
            <lay-form-item label="原密码" prop="oldPassword">
              <lay-input type="password" v-model="model.oldPassword" placeholder="请输入原密码" password></lay-input>
            </lay-form-item>
            <lay-form-item label="密码" prop="password">
              <lay-input type="password" v-model="model.password" placeholder="请输入密码" password></lay-input>
            </lay-form-item>
            <lay-form-item label="确认密码" prop="confirmPassword">
              <lay-input type="password" v-model="model.confirmPassword" placeholder="请输入确认密码" password></lay-input>
            </lay-form-item>
            <lay-form-item>
              <lay-row :space="20" >
                <lay-col :md="4" :md-offset="8">
                  <lay-button :fluid="true" @click="submit" type="primary" :loading="loading">提交</lay-button>
                </lay-col>
                <lay-col :md="4">
                  <lay-button :fluid="true" @click="reset">重置</lay-button>
                </lay-col>
              </lay-row>
            </lay-form-item>
          </lay-form>
        </lay-col>
      </lay-row>
    </lay-card>
  </lay-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { modifyPasswordMutation } from '../../../api/module/system'
import { successMsg, errorMsg } from '../../../library/layerUtil'
import { useUserStore } from '../../../store/user'
import { useRouter } from 'vue-router'
import md5 from 'js-md5'
const model = ref({
  oldPassword: '',
  password: '',
  confirmPassword: ''
})
const formRules = ref({
  password: {
    type: 'string',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,30}$',
    message: '必须包含大写字母、小写字母和数字，长度为8-30'
  },
  confirmPassword: {
    asyncValidator(rule, value) {
      return new Promise((resolve, reject) => {
        if (value !== model.value.password) {
          reject('确认密码不正确');  // reject with error message
        } else {
          resolve();
        }
      })
    }
  }
})
const formRef = ref()
const router = useRouter()
const { mutate: modifyPassword, loading, onDone: modifyPasswordDone } = modifyPasswordMutation
function submit() {
  formRef.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      const pwd = {
        password: md5(md5(model.password)),
        oldPassword: md5(md5(model.oldPassword))
      }
      modifyPassword({ pwd })
      modifyPasswordDone(({data: {modifyPassword}}) => {
        if (modifyPassword) {
          successMsg('密码修改成功，即将跳转到登录页面', () => {
            setTimeout(() => {
              const userInfoStore = useUserStore()
              userInfoStore.logout()
              router.push('/login')
            }, 2000)
          })
        } else {
          errorMsg('密码修改失败')
        }
      })
    }
  })
}
function reset() {
  model.value = {
    oldPassword: '',
    password: '',
    confirmPassword: ''
  }
}
</script>

<style scoped>
</style>