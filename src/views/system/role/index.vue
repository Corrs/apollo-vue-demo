<template>
  <lay-container fluid="true" class="container-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label-width="0">
              <lay-input
                v-model="searchQuery.roleName"
                placeholder="角色名称"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label-width="20">
              <lay-button
                style="margin-left: 20px"
                size="sm"
                @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button size="sm" type="normal" @click="toReset"> 重置 </lay-button>
              <lay-button
                v-permission="['sys:role:save']"
                size="sm"
                type="primary"
                @click="changeVisible11('新增', null)"
              >
                新增
              </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
    <div class="table-box">
      <lay-table
        :page="page"
        :height="'100%'"
        :columns="columns"
        :loading="rolesLoading"
        :default-toolbar="false"
        :data-source="dataSource"
        @change="change"
      >
        <template v-slot:operator="{ row }">
          <lay-button
            v-permission="['sys:role:permissions']"
            size="xs"
            border="blue"
            border-style="dashed"
            @click="toPrivileges(row)"
            >分配权限</lay-button
          >
          <lay-button
            v-permission="['sys:role:update']"
            size="xs"
            border="blue"
            border-style="dashed"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-button size="xs" border="red" v-permission="['sys:role:delete']" border-style="dashed" @click="delRole(row.id)">删除</lay-button>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['500px', '370px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" :rules="formRules">
          <lay-form-item label="角色名称" prop="roleName" required>
            <lay-input v-model="model11.roleName" placeholder="请输入角色名称，50字以内"></lay-input>
          </lay-form-item>
          <lay-form-item label="描述" prop="remark">
            <lay-textarea
              placeholder="请输入描述，100字以内"
              v-model="model11.remark"
            ></lay-textarea>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button size="sm" type="primary" @click="toSubmit" :loading="addRoleLoading || editRoleLoading">保存</lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>

    <lay-layer v-model="visible22" title="分配权限" :area="['500px', '450px']">
      <div style="height: 320px; overflow: auto">
        <lay-tree
          style="margin-left: 40px"
          :tail-node-icon="false"
          :data="data2"
          :showCheckbox="showCheckbox2"
          v-model:checkedKeys="checkedKeys2"
        >
          <template #title="{ data }">
            <lay-icon :class="data.icon"></lay-icon>
            {{ data.title }}
          </template>
        </lay-tree>
      </div>
      <lay-line></lay-line>
      <div style="width: 90%; text-align: right">
        <lay-button size="sm" type="primary" @click="toSubmit">保存</lay-button>
        <lay-button size="sm" @click="toCancel">取消</lay-button>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { rolesQuery, addRoleMutation, editRoleMutation, remRoleMutation } from '../../../api/module/system'
import { successMsg, errorMsg, warnMsg, confirm } from '../../../library/layerUtil'

const searchQuery = ref({
  roleName: ''
})

function toReset() {
  searchQuery.value = {
    roleName: ''
  }
}

function toSearch() {
  page.current = 1
  change(page)
}
const getRoleQuery = () => {
  return {
    ...searchQuery.value,
    p: {
      current: page.current,
      limit: page.limit
    }
  }
}
const { result: rolesResult, loading: rolesLoading, load: loadRoles, variables: rolesVariables } = rolesQuery
onMounted(() => {
  rolesVariables.value = getRoleQuery()
  loadRoles()
})
const page = reactive({ current: 1, limit: 10, total: 0, hideOnSinglePage: false, layout: ['count', 'prev', 'page', 'next', 'limits', 'skip'] })
const columns = ref([
  { title: '角色名称', width: '80px', key: 'roleName' },
  { title: '备注', width: '260px', key: 'remark' },
  { title: '创建时间', width: '120px', key: 'createTime' },
  {
    title: '操作',
    width: '150px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const dataSource = computed(() => {
  const data = rolesResult.value?.roles
  if (data) {
    const edges = data.edges
    page.total = data.total ?? 0
    return Array.isArray(edges) ? edges.map(e => e.node) : []
  }
  page.total = 0
  return []
})
const change = (page: any) => {
  rolesVariables.value = getRoleQuery()
}

const formRules = ref({
  roleName: {
    type: 'string',
    min: 1,
    max: 50
  },
  remark: {
    type: 'string',
    max: 100
  }
})
const model11 = ref({
  roleName: '',
  remark: ''
})
const layFormRef11 = ref()
const visible11 = ref(false)

const title = ref('新增')
const changeVisible11 = (text: any, row: any) => {
  title.value = text
  if (row != null) {
    let info = JSON.parse(JSON.stringify(row))
    delete info.__typename
    delete info.createTime
    model11.value = info
  } else {
    model11.value = {
      roleName: '',
      remark: ''
    }
  }
  visible11.value = !visible11.value
}
const { mutate: addRole, onDone: addRoleDone, loading: addRoleLoading } = addRoleMutation
const { mutate: editRole, onDone: editRoleDone, loading: editRoleLoading } = editRoleMutation
function toSubmit() {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id && model.id > 0) {
        editRole({ role: model })
        editRoleDone(({data: {editRole}}) => {
          if (editRole ?? false) {
            successMsg('保存成功', () => {
              visible11.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      } else {
        // 新增字典
        addRole({ role: model })
        addRoleDone(({data: {addRole}}) => {
          if (addRole ?? false) {
            successMsg('保存成功', () => {
              visible11.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      }
    }
  })
  visible11.value = false
}
function toCancel() {
  visible11.value = false
  visible22.value = false
}
const { mutate: remRole, onDone: remRoleDone } = remRoleMutation
function delRole(id: number) {
  confirm('确定删除角色吗？', () => {
    return new Promise<boolean>((resolve, reject) => {
      remRole({id})
      remRoleDone(() => {
        successMsg('删除成功', () => resolve(true))
      })
    })
  })
}

const visible22 = ref(false)
const checkedKeys2 = ref([])
const showCheckbox2 = ref(true)

const data2 = ref([
  {
    icon: 'layui-icon-home',

    title: '工作空间',
    id: 1,
    checked: true,
    spread: true,
    children: [
      {
        title: '工作台',
        icon: 'layui-icon-util',
        id: 3
      },
      {
        title: '控制台',
        icon: 'layui-icon-engine',
        id: 4,
        spread: true
      },
      {
        title: '分析页',
        id: 20,
        icon: 'layui-icon-chart-screen'
      },
      {
        title: '监控页',
        id: 21,
        icon: 'layui-icon-find-fill'
      }
    ]
  },
  {
    title: '表单页面',
    icon: 'layui-icon-table',
    id: 2,
    spread: true,
    children: [
      {
        title: '基础表单',
        icon: 'layui-icon-form',
        id: 5,
        spread: true
      },
      {
        title: '复杂表单',
        icon: 'layui-icon-form',
        id: 6
      }
    ]
  },
  {
    title: '个人中心',
    icon: 'layui-icon-slider',
    id: 16,
    children: [
      {
        icon: 'layui-icon-username',
        title: '我的资料',
        id: 17,
        fixed: true
      },
      {
        title: '我的消息',
        icon: 'layui-icon-email',
        id: 27
      }
    ]
  },
  {
    title: '系统管理',
    icon: 'layui-icon-set',
    id: 19,
    children: [
      {
        icon: 'layui-icon-user',
        title: '用户管理',
        id: 25,
        fixed: true
      },
      {
        title: '角色管理',
        icon: 'layui-icon-group',
        id: 29
      },
      {
        title: '机构管理',
        icon: 'layui-icon-transfer',
        id: 29
      }
    ]
  }
])

function toPrivileges(row: any) {
  visible22.value = true
}
</script>

<style scoped>
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
  height: 700px;
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
.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>