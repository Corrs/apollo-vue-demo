<template>
  <lay-container :fluid="true" class="container-box">
    <lay-row style="background-color: #fff; height: 100%;">
      <lay-col :md="10" :md-offset="7">
        <div class="content">
          <lay-form
            :model="model4"
            ref="layFormRef4"
            label-width="60"
            size="sm"
          >
            <lay-form-item label="昵称" prop="username" required>
              <lay-input v-model="model4.username" allow-clear></lay-input>
            </lay-form-item>
            <lay-form-item label="密码" prop="password" required>
              <lay-input
                v-model="model4.password"
                type="password"
                allow-clear
              ></lay-input>
            </lay-form-item>
            <lay-form-item label="性别" prop="sex">
              <lay-select
                v-model="model4.sex"
                style="width: 100%"
                placeholder="请选择性别"
              >
                <lay-select-option
                  value="man"
                  label="男"
                ></lay-select-option>
                <lay-select-option
                  value="woman"
                  label="女"
                ></lay-select-option>
              </lay-select>
            </lay-form-item>
            <lay-form-item label="邮箱" prop="email">
              <lay-input
                v-model="model4.email"
                type="email"
                allow-clear
              ></lay-input>
            </lay-form-item>
            <lay-form-item label="个人简介" prop="desc">
              <lay-textarea
                placeholder="还没有个人简介哦~"
                v-model="model4.desc"
                allow-clear
              ></lay-textarea>
            </lay-form-item>
            <lay-form-item label="联系电话" prop="phone" required>
              <lay-input
                v-model="model4.phone"
                type="phone"
                allow-clear
              ></lay-input>
            </lay-form-item>
            <lay-form-item style="text-align: center">
              <lay-button type="primary" @click="submit4">提交</lay-button>
              <lay-button @click="clearValidate4">清除校验</lay-button>
              <lay-button @click="reset4">重置表单</lay-button>
            </lay-form-item>
          </lay-form>
        </div>
      </lay-col>
    </lay-row>
  </lay-container>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { layer } from '@layui/layer-vue'
export default {
  setup() {
    const src =
      'https://foruda.gitee.com/avatar/1677022544584087390/4835367_jmysy_1578975358.png'

    const tagsList = ref([
      { id: 1, tag: '雪', theme: 'blue' },
      { id: 2, tag: '风是从哪儿来wu', theme: '' },
      { id: 3, tag: '漫游星河', theme: 'orange' },
      { id: 4, tag: '春日之花', theme: 'green' },
      { id: 5, tag: 'Hey', theme: 'cyan' },
      { id: 6, tag: '风吹一夏', theme: '' }
    ])
    const activeTab = ref('baseInfo')

    const model4 = reactive({
      username: 'admin',
      password: '123456',
      phone: '12345678900',
      desc: '',
      sex: '',
      email: ''
    })

    const layFormRef4 = ref()

    const submit4 = function () {
      layFormRef4.value.validate(
        (isValidate: boolean, model: any, errors: any) => {
          layer.open({
            type: 1,
            title: '表单提交结果',
            content: `<div style="padding: 10px"><p>是否通过 : ${isValidate}</p> <p>表单数据 : ${JSON.stringify(
              model
            )} </p> <p>错误信息 : ${JSON.stringify(errors)}</p></div>`,
            shade: false,
            isHtmlFragment: true,
            btn: [
              {
                text: '确认',
                callback(index: Number) {
                  layer.close(index)
                }
              }
            ],
            area: '500px'
          })
        }
      )
    }

    const clearValidate4 = () => {
      layFormRef4.value.clearValidate()
    }

    const reset4 = () => {
      layFormRef4.value.reset()
    }

    const bindingAccountList = ref([
      {
        id: 1,
        title: '密保手机',
        desc: '已绑定手机: 12345678901',
        option: '去修改',
        icon: ''
      },
      {
        id: 2,
        title: '密保邮箱',
        desc: '已绑定邮箱: email@layui-vue',
        option: '去修改',
        icon: ''
      },
      {
        id: 3,
        title: '密保问题',
        desc: '未设置密保问题',
        option: '去设置',
        icon: ''
      },
      {
        id: 4,
        title: '绑定QQ',
        desc: '当前未绑定QQ账号',
        option: '去绑定',
        icon: 'layui-icon-login-qq',
        color: '#3492ed'
      },
      {
        id: 5,
        title: '绑定微信',
        desc: '当前未绑定绑定微信账号',
        option: '去绑定',
        icon: 'layui-icon-login-wechat',
        color: '#4daf29'
      },
      {
        id: 6,
        title: '绑定微博',
        desc: '当前未绑定绑定微博账号',
        option: '去绑定',
        icon: 'layui-icon-login-weibo',
        color: '#e6162d'
      }
    ])
    return {
      src,
      model4,
      tagsList,
      activeTab,
      layFormRef4,
      bindingAccountList,
      reset4,
      submit4,
      clearValidate4
    }
  }
}
</script>

<style scoped>
.content {
  height: 100%;
  max-width: 100%;
  padding: 20px 20px;
  background-color: #fff;
}
</style>