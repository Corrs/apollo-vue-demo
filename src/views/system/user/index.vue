<template>
  <lay-container fluid="true" class="container-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label-width="0">
              <lay-date-picker
                :allow-clear="false"
                size="sm"
                v-model="searchQuery.rangeTime"
                range
                type="datetime"
                style="width: 98%"
                :placeholder="['开始时间', '结束时间']"
              ></lay-date-picker
            ></lay-form-item>
          </lay-col>
          <lay-col :md="3">
            <lay-form-item label-width="0">
              <lay-input
                v-model="searchQuery.username"
                placeholder="用户名"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="3">
            <lay-form-item label-width="0">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.gender"
                :allow-clear="true"
                placeholder="性别"
                :options="genderOptions"
              >
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="3">
            <lay-form-item label-width="0">
              <lay-tree-select size="sm" v-model="searchQuery.deptId" placeholder="部门" :data="deptTree" allow-clear style="width: 98%"></lay-tree-select>
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
              <lay-button size="sm" type="primary" v-permission="['sys:user:save']" @click="changeVisible11('新增')"> 新增 </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
    <div class="table-box table-box-h-700">
      <lay-table
        :page="page"
        :height="'100%'"
        :columns="columns"
        :loading="loading"
        :default-toolbar="false"
        :data-source="dataSource"
        v-model:selected-keys="selectedKeys"
        @change="change"
      >
        <template #gender="{ row }">
          <template v-for="option in genderOptions">
            <div v-if="row.status === option.value">
              {{ option.label }}
            </div>
          </template>
        </template>
        <template #status="{ row }">
          <div v-if="row.isDeleted" style="margin-right: 5px;"><lay-tag color="red" variant="light">已删除</lay-tag></div>
          <template v-for="option in statusOptions">
            <div v-if="row.status === option.value">
              <lay-tag :color="option.color" variant="light">{{ option.label }}</lay-tag>
            </div>
          </template>
        </template>
        <template #avatar="{ row }">
          <lay-avatar :src="row.avatar"></lay-avatar>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            v-permission="['sys:user:update']"
            size="xs"
            border="blue"
            border-style="dashed"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-button v-permission="['sys:user:lock']" size="xs" :border="(row.status === 0 ? 'green' : 'orange')" border-style="dashed" @click="chgStatus(row)">{{ row.status === 0 ? '解锁' : '锁定' }}</lay-button>
          <lay-button v-permission="['sys:user:delete']" size="xs" border="red" border-style="dashed" @click="rem(row.id)">删除</lay-button>
          <lay-button v-permission="['sys:user:delete']" size="xs" border="blue" border-style="dashed" @click="resetPwd(row.id)">重置密码</lay-button>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['750px', '650px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" :rules="formRules" >
          <lay-form-item label="用户名" prop="username" :required="!model11.id">
            <lay-input v-model="model11.username" placeholder="请输入用户名，只能包含字母和数字" :disabled="!!model11.id"></lay-input>
          </lay-form-item>
          <lay-form-item label="真实姓名" prop="realName" required>
            <lay-input v-model="model11.realName" placeholder="请输入真实姓名，50字以内"></lay-input>
          </lay-form-item>
          <lay-form-item label="所属部门" prop="deptId" required>
            <lay-tree-select v-model="model11.deptId" placeholder="请选择部门" :data="deptTree"></lay-tree-select>
          </lay-form-item>
          <lay-form-item label="角色配置" prop="roleId">
            <lay-select v-model="model11.roleId" :options="roleOptions" placeholder="请选择角色" allow-clear></lay-select>
          </lay-form-item>
          <lay-form-item label="性别" prop="gender">
            <lay-radio-group name="gender" v-model="model11.gender">
              <template v-for="(ele, index) in genderOptions" :key="index">
                <lay-radio :value="ele.value">{{ ele.label }}</lay-radio>
              </template>
            </lay-radio-group>
          </lay-form-item>
          <lay-form-item label="email" prop="email">
            <lay-input v-model="model11.email" placeholder="请输入邮箱"></lay-input>
          </lay-form-item>
          <lay-form-item label="手机号" prop="mobile">
            <lay-input v-model="model11.mobile" placeholder="请输入手机号"></lay-input>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button size="sm" type="primary" @click="toSubmit" :loading="addUserLoading || editUserLoading">保存</lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
    <lay-layer
      v-model="visibleImport"
      title="导入用户"
      :area="['380px', '380px']"
    >
      <lay-upload
        :beforeUpload="beforeUpload10"
        style="margin: 60px"
        url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        v-model="file1"
        field="file"
        :auto="false"
        :drag="true"
      >
        <template #preview>
          {{ file1[0]?.name }}
        </template>
      </lay-upload>
      <div style="width: 100%; text-align: center">
        只能上传小于1000KB的文件
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { depts, roleListQuery, addUserMutation, usersQuery, resetPasswordMutation, remUserMutation, chgUserStatusMutation, editUserMutation } from '../../../api/module/system'
import { listToTree } from '../../../library/treeUtil'
import { now, dateStr } from '../../../library/dayUtil'
import { successMsg, errorMsg, confirm } from '../../../library/layerUtil'
const { result: rolesResult, load: loadRoles, refetch: refetchRoles } = roleListQuery
const { result: dpetsResult, load: loadDepts, refetch: refetchDepts } = depts
const { result: usersResult, load: loadUsers, loading, refetch: refetchUsers } = usersQuery
onMounted(() => {
  loadRoles() || refetchRoles()
  loadDepts() || refetchDepts()
  const params = getQueryParam()
  loadUsers(null, params) || refetchUsers(params)
})
const deptTree = computed(() => {
  const list = dpetsResult.value?.depts
  if (Array.isArray(list)) {
    const treeList = list.map(e => {
      return {
        ...e,
        title: e.name,
        spread: e.pid === 0
      }
    })
    return listToTree(treeList, 0)
  }
  return []
})
const roleOptions = computed(() => {
  return (rolesResult.value?.roleList ?? [])
  .map((e: any) => {
    return {
      label: e.roleName,
      value: e.id
    }
  })
})
function getQueryParam() {
  const query = searchQuery.value
  const startTime = query.rangeTime[0]
  const endTime = query.rangeTime[1]
  return {
    p: {
      current: page.current,
      limit: page.limit
    },
    query: {
      username: query.username,
      gender: query.gender === '' ? null : query.gender,
      deptId: query.deptId === '' ? null : query.deptId,
      startTime: startTime === '' ? null : startTime,
      endTime: endTime === '' ? null : endTime
    }
  }
}
const searchQuery = ref({
  username: '',
  deptId: null,
  gender: null,
  rangeTime: [dateStr(now().subtract(7, 'day').startOf('d')), dateStr(now().endOf('d'))]
})
const genderOptions =[
  {value: 0, label: '女'},
  {value: 1, label: '男'},
  {value: 2, label: '保密'},
]
const statusOptions = [{value: 0, label: '锁定', color: '#FF5722'}, {value: 1, label: '正常', color: '#16b777'}]

const visibleImport = ref(false)
const file1 = ref<any>([])
function toImport() {
  visibleImport.value = true
}
function toReset() {
  searchQuery.value = {
    username: '',
    deptId: null,
    gender: null,
    rangeTime: [dateStr(now().subtract(7, 'day').startOf('d')), dateStr(now().endOf('d'))]
  }
}

function toSearch() {
  page.current = 1
  change(page)
}

const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0, hideOnSinglePage: false, layout: ['count', 'prev', 'page', 'next', 'limits', 'skip'] })
const columns = ref([
  { title: '选项', width: '60px', type: 'checkbox', fixed: 'left' },
  { title: '用户名', width: '150px', key: 'username' },
  { title: '真实姓名', width: '150px', key: 'realName' },
  { title: '性别', width: '80px', key: 'gender', customSlot: 'gender' },
  { title: '邮箱', width: '150px', key: 'email' },
  { title: '手机号', width: '150px', key: 'mobile' },
  { title: '状态', width: '120px', key: 'status', customSlot: 'status', align: 'center' },
  { title: '时间', width: '150px', key: 'createTime' },
  {
    title: '操作',
    width: '180px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const change = (page: any) => {
  refetchUsers(getQueryParam())
}
const dataSource = computed(() => {
  const data = usersResult.value?.users
  if (data) {
    const edges = data.edges
    page.total = data.total ?? 0
    return Array.isArray(edges) ? edges.map(e => e.node) : []
  }
  return []
})

// 修改用户状态
const { mutate: chgUserStatus, onDone: chgUserStatusDone } = chgUserStatusMutation
const chgStatus = (row: any) => {
  const userId = row.id
  const tip = row.status === 0 ? '解锁' : '锁定'
  confirm(`确定${tip}用户吗？`, () => {
    return new Promise<boolean>((resolve, reject) => {
      chgUserStatus({userId})
      chgUserStatusDone(({data: {chgUserStatus}}) => {
        if (chgUserStatus) {
          successMsg(`${tip}成功`, () => resolve(true))
        } else {
          errorMsg(`${tip}失败`, () => resolve(false))
        }
      })
    })
  })
}

// 重置密码
const { mutate: resetPassword, onDone: resetPwdDone } = resetPasswordMutation
const resetPwd = (userId: number) => {
  confirm('确定重置密码吗？', () => {
    return new Promise<boolean>((resolve, reject) => {
      resetPassword({userId})
      resetPwdDone(({data: {resetPassword}}) => {
        if (resetPassword) {
          successMsg('密码重置成功', () => resolve(true))
        } else {
          errorMsg('密码重置失败', () => resolve(false))
        }
      })
    })
  })
}

// 删除用户
const { mutate: remUser, onDone: remUserDone } = remUserMutation
const rem = (userId: number) => {
  confirm('确定删除用户数据吗？', () => {
    return new Promise<boolean>((resolve, reject) => {
      remUser({userId})
      remUserDone(({data: {remUser}}) => {
        if (remUser) {
          successMsg('删除成功', () => resolve(true))
        } else {
          errorMsg('删除失败', () => resolve(false))
        }
      })
    })
  })
}

const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
const formRules = ref({
  username: {
    type: 'string',
    pattern: '^[a-zA-Z][0-9a-zA-Z]{7,49}$',
    message: '用户名必须以字母开头，只能包含字母和数字，长度8-50'
  },
  realName: {
    type: 'string',
    min: 2,
    max: 50
  },
  mobile: {
    type: 'string',
    pattern: '^[0,1][0-9]{10,14}$',
    message: '请输入正确的手机号'
  },
  email: {
    type: 'string',
    max: 50,
    pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$',
    message: '请输入正确的邮箱'
  }
})
const changeVisible11 = (text: any, row?: any) => {
  title.value = text
  if (row) {
    let info = JSON.parse(JSON.stringify(row))
    delete info.__typename
    delete info.createTime
    delete info.status
    delete info.isDeleted
    model11.value = info
  } else {
    model11.value = {
      gender: 0
    }
  }
  visible11.value = !visible11.value
}
const { mutate: addUser, loading: addUserLoading, onDone: addUserDone } = addUserMutation
const { mutate: editUser, loading: editUserLoading, onDone: editUserDone } = editUserMutation
function toSubmit() {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      const user = {
        ...model,
        roleId: model.roleId === '' ? null : model.roleId
      }
      if (model.id) {
        delete user.username
        editUser({user})
        editUserDone(({ data: { editUser } }) => {
          if (editUser) {
            successMsg('保存成功', () => {
              visible11.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      } else {
        addUser({user})
        addUserDone(({ data: { addUser } }) => {
          if (addUser) {
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
}
function toCancel() {
  visible11.value = false
}

const beforeUpload10 = (file: File) => {
  var isOver = false
  if (file.size > 1000) {
    isOver = true
    layer.msg(`file size over 1000 KB`, { icon: 2 })
  }
  return new Promise((resolver) => resolver(true))
}
</script>

<style scoped>
.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}

</style>