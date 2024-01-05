<template>
  <lay-container fluid="true" class="menu-box">
    <!-- table -->
    <div class="table-box">
      <lay-table
        :height="`100%`"
        ref="tableRef6"
        :loading="loading"
        children-column-name="children"
        :columns="columns6"
        :data-source="dataSource6"
        :default-toolbar="false"
        :default-expand-all="defaultExpandAll6"
        :expand-index="0"
      >
        <template #toolbar>
          <lay-button
            size="sm"
            @click="changeVisible11('新建', null)"
            type="primary"
          >
            新建
          </lay-button>
          <lay-button size="sm" type="normal" @click="expandAll6(true)">展开全部</lay-button>
          <lay-button size="sm" @click="expandAll6(false)">折叠全部</lay-button>
        </template>
        <template #name="{ row }">
          <lay-icon :class="row.icon"></lay-icon> &nbsp;&nbsp;
          {{ row.name }}
        </template>
        <template #option="{ row }">
          <lay-button
            @click="changeVisible11('新建', null)"
            size="xs"
            border="blue"
            border-style="dashed"
          >
            添加
          </lay-button>
          <lay-button
            @click="changeVisible11('修改', row)"
            size="xs"
            border="green"
            border-style="dashed"
          >
            修改
          </lay-button>
          <lay-button
            @click="toRemove"
            size="xs"
            border="red"
            border-style="dashed"
          >
            删除
          </lay-button>
        </template>
        <template #type="{ row }">
          <div v-show="row.type == '目录'">
            <lay-tag color="#165DFF" variant="light">目录</lay-tag>
          </div>
          <div v-show="row.type == '菜单'">
            <lay-tag color="#2dc570" variant="light">菜单</lay-tag>
          </div>
          <div v-show="row.type == '外链'">
            <lay-tag color="#F5319D" variant="light">外链</lay-tag>
          </div>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['700px', '570px']">
      <div style="padding: 20px">
        <lay-form :model="menuModel" ref="layFormRef11">
          <lay-row>
            <lay-col md="24">
              <lay-form-item label="类型" prop="type" required>
                <lay-radio-group name="action" v-model="menuModel.type">
                  <lay-radio :value="1">菜单</lay-radio>
                  <lay-radio :value="2">按钮</lay-radio>
                </lay-radio-group>
              </lay-form-item>
              <lay-form-item label="名称" prop="name" required>
                <lay-input v-model="menuModel.name" placeholder="名称"></lay-input>
              </lay-form-item>
              <lay-form-item label="上级菜单" prop="routePath" required>
                <lay-input v-model="menuModel.routePath"></lay-input>
              </lay-form-item>
              <lay-form-item label="路由" prop="routePath" v-show="menuModel.type !== 2">
                <lay-input v-model="menuModel.routePath" placeholder="路由"></lay-input>
              </lay-form-item>
              <lay-form-item label="排序" prop="sort">
                <lay-input-number
                  v-model="menuModel.sort"
                  position="right"
                ></lay-input-number>
              </lay-form-item>
              <lay-form-item label="授权标识" prop="compontPath">
                <lay-input v-model="menuModel.compontPath" placeholder="多个用逗号分割，如：sys:menu:save,sys:menu:update"></lay-input>
              </lay-form-item>
              <lay-form-item label="图标" prop="icon" v-show="menuModel.type !== 2">
                <lay-icon-picker v-model="menuModel.icon" allow-clear page></lay-icon-picker>
              </lay-form-item>
            </lay-col>
          </lay-row>
        </lay-form>
        <div style="width: 97%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit"
            >保存</lay-button
          >
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { layer } from '@layui/layui-vue'
const searchQuery = ref({
  address: '',
  identifying: '',
  name: ''
})

function toReset() {
  searchQuery.value = {
    address: '',
    identifying: '',
    name: ''
  }
}

function toSearch() {
  page.current = 1
  change(page)
}
const change = (page: any) => {
  loading.value = true
  setTimeout(() => {
    //
    loading.value = false
  }, 1000)
}
const page = reactive({ current: 1, limit: 10, total: 100 })
const loading = ref(false)
const tableRef6 = ref()

const columns6 = [
  {
    title: '菜单名称',
    key: 'name',
    customSlot: 'name'
  },
  {
    title: '路由地址',
    key: 'routePath'
  },
  {
    title: '组件路径',
    key: 'compontPath'
  },
  {
    title: '排序',
    width: '120px',
    key: 'sort'
  },
  {
    title: '可见',
    key: 'isShow'
  },
  {
    title: '类型',
    key: 'type',
    customSlot: 'type'
  },
  {
    title: '操作',
    key: 'option',
    customSlot: 'option'
  }
]

const dataSource6 = [
  {
    id: '10001',
    name: '工作空间',
    type: '目录',
    icon: 'layui-icon-home',
    age: 0,
    routePath: '/workspace',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10009',
        name: '工作台',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-util',
        routePath: '/workspace/workbench',
        compontPath: '/workspace/workbench',
        isShow: '是'
      },
      {
        id: '10012',
        name: '控制台',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-engine',
        routePath: '/workspace/console',
        compontPath: '/workspace/console',
        isShow: '是'
      },
      {
        id: '10012',
        name: '分析页',
        type: '菜单',
        sort: 3,
        icon: 'layui-icon-chart-screen',
        routePath: '/workspace/analysis',
        compontPath: '/workspace/analysis',
        isShow: '是'
      },
      {
        id: '10012',
        name: '监控页',
        type: '菜单',
        sort: 4,
        icon: 'layui-icon-find-fill',
        routePath: '/workspace/monitor',
        compontPath: '/workspace/monitor',
        isShow: '是'
      }
    ]
  },
  {
    id: '10002',
    name: '表单页面',
    type: '目录',
    sort: 1,
    icon: 'layui-icon-table',
    routePath: '/form',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10015',
        name: '基础表单',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-form',
        routePath: '/form/base',
        compontPath: '/form/base',
        isShow: '是'
      },
      {
        id: '10016',
        name: '复杂表单',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-form',
        routePath: '/form/intricate',
        compontPath: '/form/intricate',
        isShow: '是'
      }
    ]
  },
  {
    id: '10003',
    name: '列表页面',
    type: '目录',
    sort: 3,
    icon: 'layui-icon-align-left',
    routePath: '/table',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10017',
        name: '查询列表',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-search',
        routePath: '/table/base',
        compontPath: '/table/base',
        isShow: '是'
      },
      {
        id: '10018',
        name: '卡片列表',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-file-b',
        routePath: '/table/card',
        compontPath: '/table/card',
        isShow: '是'
      }
    ]
  },
  {
    id: '10004',
    name: '结果页面',
    type: '目录',
    sort: 4,
    icon: 'layui-icon-template',
    routePath: '/result',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10019',
        name: '成功页面',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-success',
        routePath: '/result/success',
        compontPath: '/result/success',
        isShow: '是'
      },
      {
        id: '10020',
        name: '失败页面',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-error',
        routePath: '/result/failure',
        compontPath: '/result/failure',
        isShow: '是'
      }
    ]
  },
  {
    id: '10005',
    icon: 'layui-icon-unlink',
    name: '异常页面',
    type: '目录',
    sort: 5,
    routePath: '/error',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10021',
        name: '403',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-not-found',
        routePath: '/error/403',
        compontPath: '/error/403',
        isShow: '是'
      },
      {
        id: '10022',
        name: '404',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-not-found',
        routePath: '/error/404',
        compontPath: '/error/404',
        isShow: '是'
      },
      {
        id: '10022',
        name: '500',
        type: '菜单',
        sort: 3,
        icon: 'layui-icon-not-found',
        routePath: '/error/500',
        compontPath: '/error/500',
        isShow: '是'
      }
    ]
  },
  {
    id: '10006',
    name: '菜单嵌套',
    type: '目录',
    sort: 6,
    icon: 'layui-icon-app',
    routePath: '/menu',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10023',
        name: '二级菜单',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-component',
        routePath: '/menu/menu1',
        compontPath: '/menu/menu1',
        isShow: '是',
        children: [
          {
            id: '10023',
            name: '三级菜单1',
            type: '菜单',
            sort: 1,
            icon: 'layui-icon-template-one',
            routePath: '/menu/menu1/menu1',
            compontPath: '/menu/menu1/menu1',
            isShow: '是'
          },
          {
            id: '10023',
            name: '三级菜单2',
            type: '菜单',
            sort: 2,
            icon: 'layui-icon-template-one',
            routePath: '/menu/menu1/menu2',
            compontPath: '/menu/menu1/menu2',
            isShow: '是'
          }
        ]
      },
      {
        id: '10024',
        name: '二级菜单',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-component',
        routePath: '/menu/menu2',
        compontPath: '/menu/menu2',
        isShow: '是',
        children: [
          {
            id: '10023',
            name: '三级菜单1',
            type: '菜单',
            sort: 1,
            icon: 'layui-icon-template-one',
            routePath: '/menu/menu2/menu1',
            compontPath: '/menu/menu2/menu1',
            isShow: '是'
          },
          {
            id: '10023',
            name: '三级菜单2',
            type: '菜单',
            sort: 2,
            icon: 'layui-icon-template-one',
            routePath: '/menu/menu2/menu2',
            compontPath: '/menu/menu2/menu2',
            isShow: '是'
          }
        ]
      }
    ]
  },
  {
    id: '10007',
    name: '内置指令',
    type: '目录',
    sort: 7,
    icon: 'layui-icon-test',
    routePath: '/directive',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10025',
        name: '权限指令',
        type: '菜单',
        sort: 1,
        icon: 'layui-icon-template',
        routePath: '/directive/permission',
        compontPath: '/directive/permission',
        isShow: '是'
      }
    ]
  },
  {
    id: '10008',
    name: '外链页面',
    type: '外链',
    sort: 8,
    icon: 'layui-icon-link',
    routePath: '/page',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10027',
        name: '弹层外链',
        type: '外链',
        icon: 'layui-icon-home',
        sort: 1,
        routePath: 'layui-icon-layer',
        compontPath: 'layui-icon-layer',
        isShow: '是'
      },
      {
        id: '10028',
        name: '原生跳转',
        type: '外链',
        sort: 2,
        icon: 'layui-icon-layouts',
        routePath: 'http://www.baidu.com',
        compontPath: 'http://www.baidu.com',
        isShow: '是'
      }
    ]
  },
  {
    id: '10008',
    name: '个人中心',
    type: '目录',
    sort: 9,
    icon: 'layui-icon-slider',
    routePath: '/enrollee',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10027',
        name: '我的资料',
        type: '菜单',
        icon: 'layui-icon-home',
        sort: 1,
        routePath: '/enrollee/profile',
        compontPath: '/enrollee/profile',
        isShow: '是'
      },
      {
        id: '10028',
        name: '我的消息',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-email',
        routePath: '/enrollee/message',
        compontPath: '/enrollee/message',
        isShow: '是'
      }
    ]
  },
  {
    id: '10008',
    name: '系统管理',
    type: '目录',
    sort: 10,
    icon: 'layui-icon-set',
    routePath: '/system',
    compontPath: '',
    isShow: '是',
    children: [
      {
        id: '10027',
        name: '用户管理',
        type: '菜单',
        icon: 'layui-icon-home',
        sort: 1,
        routePath: '/system/user',
        compontPath: '/system/user',
        isShow: '是'
      },
      {
        id: '10028',
        name: '角色管理',
        type: '菜单',
        sort: 2,
        icon: 'layui-icon-group',
        routePath: '/system/role',
        compontPath: '/system/role',
        isShow: '是'
      },
      {
        id: '10028',
        name: '机构管理',
        type: '菜单',
        sort: 3,
        icon: 'layui-icon-transfer',
        routePath: '/system/organization',
        compontPath: '/system/organization',
        isShow: '是'
      }
    ]
  }
]

const getCheckData6 = function () {
  layer.msg(tableRef6.value.getCheckData())
}

const defaultExpandAll6 = ref(false)

const expandAll6 = function (flag: any) {
  defaultExpandAll6.value = flag
}
const menuModel = ref({
  name: '',
  type: 1,
  sort: 0,
  icon: 'layui-icon-home',
  routePath: '',
  compontPath: '',
  isShow: '是'
})
const layFormRef11 = ref()
const visible11 = ref(false)

const title = ref('新增')
const changeVisible11 = (text: any, row: any) => {
  title.value = text
  if (row != null) {
    let info = JSON.parse(JSON.stringify(row))
    menuModel.value = info
  } else {
    menuModel.value = {
      name: '',
      type: 1,
      sort: 0,
      icon: 'layui-icon-home',
      routePath: '',
      compontPath: '',
      isShow: '是'
    }
  }
  visible11.value = !visible11.value
}
const submit11 = function () {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
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
          callback(index: number) {
            layer.close(index)
          }
        }
      ],
      area: '500px'
    })
  })
}
// 清除校验
const clearValidate11 = function () {
  layFormRef11.value.clearValidate()
}
// 重置表单
const reset11 = function () {
  layFormRef11.value.reset()
}
function toRemove() {
  layer.confirm('您将删除所有选中的数据？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: (id: any) => {
          layer.msg('您已成功删除')
          layer.close(id)
        }
      },
      {
        text: '取消',
        callback: (id: any) => {
          layer.msg('您已取消操作')
          layer.close(id)
        }
      }
    ]
  })
}
function toSubmit() {
  layer.msg('保存成功！', { icon: 1, time: 1000 })
  visible11.value = false
}
function toCancel() {
  visible11.value = false
}
</script>

<style scoped>
.menu-box {
  width: calc(100vw - 220px);
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.top-search {
  margin-top: 10px;
  padding: 10px;
  height: 40px;
  border-radius: 4px;
  background-color: #fff;
}
.table-box {
  margin-top: 10px;
  padding: 10px;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}

.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}
.table-style {
  margin-top: 10px;
}
.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>