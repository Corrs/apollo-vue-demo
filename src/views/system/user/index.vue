<template>
  <lay-container fluid="true" class="container-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
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
          <lay-col :md="5">
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
          <lay-col :md="5">
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
    <div class="table-box">
      <lay-table
        :page="page"
        :height="'100%'"
        :columns="columns"
        :loading="loading"
        :default-toolbar="false"
        :data-source="dataSource"
        v-model:selected-keys="selectedKeys"
        @change="change"
        @sortChange="sortChange"
      >
        <template #status="{ row }">
          <lay-switch
            :model-value="row.status"
            @change="changeStatus($event, row)"
          ></lay-switch>
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
          <lay-button v-permission="['sys:user:lock']" size="xs" border="orange" border-style="dashed">{{ row.status === 0 ? '启用' : '禁用' }}</lay-button>
          <lay-button v-permission="['sys:user:delete']" size="xs" border="red" border-style="dashed">删除</lay-button>
          <lay-button v-permission="['sys:user:delete']" size="xs" border="blue" border-style="dashed">重置密码</lay-button>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['750px', '650px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" :rules="formRules" >
          <lay-form-item label="用户名" prop="username" required>
            <lay-input v-model="model11.username" placeholder="请输入用户名，只能包含字母和数字"></lay-input>
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
          <lay-button size="sm" type="primary" @click="toSubmit" :loading="addUserLoading">保存</lay-button>
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
import { depts, roleListQuery, addUserMutation } from '../../../api/module/system'
import { listToTree } from '../../../library/treeUtil'
import { successMsg, errorMsg, confirm, warnMsg } from '../../../library/layerUtil'
const { result: rolesResult, load: loadRoles } = roleListQuery
const { result: dpetsResult, load: loadDepts } = depts
onMounted(() => {
  loadRoles()
  loadDepts()
})
const deptTree = computed(() => {
  const list = dpetsResult.value?.depts
  let children = []
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
const searchQuery = ref({
  username: '',
  deptId: null,
  gender: null
})
const genderOptions =[
  {value: 0, label: '女'},
  {value: 1, label: '男'},
  {value: 2, label: '保密'},
]
const statusOptions = [{label: '停用', color: 'red'}, {label: '正常', color: 'blue'}]

const visibleImport = ref(false)
const file1 = ref<any>([])
function toImport() {
  visibleImport.value = true
}
function toReset() {
  searchQuery.value = {
    username: '',
    deptId: null,
    gender: null
  }
}

function toSearch() {
  page.current = 1
  change(page)
}

const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const columns = ref([
  { title: '选项', width: '60px', type: 'checkbox', fixed: 'left' },
  { title: '用户名', width: '150px', key: 'username' },
  { title: '真实姓名', width: '150px', key: 'realName' },
  { title: '性别', width: '80px', key: 'gender' },
  { title: '邮箱', width: '150px', key: 'email' },
  { title: '邮箱', width: '150px', key: 'mobile' },
  { title: '状态', width: '80px', key: 'status', customSlot: 'status' },
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
  loading.value = true
  setTimeout(() => {
    dataSource.value = loadDataSource(page.current, page.limit)
    loading.value = false
  }, 1000)
}
const sortChange = (key: any, sort: number) => {
  layer.msg(`字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`)
}
const dataSource = ref([
  {
    id: '1',
    name: '张三1',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '18',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '2',
    name: '张三2',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '3',
    name: '张三3',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '4',
    name: '张三4',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '5',
    name: '张三5',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '6',
    name: '张三6',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '7',
    name: '张三7',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '18',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '8',
    name: '张三8',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '9',
    name: '张三9',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  },
  {
    id: '10',
    name: '张三10',
    avatar:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    email: 'test@qq.com',
    sex: '男',
    city: '浙江杭州',
    age: '20',
    remark: '花开堪折直须折,莫待无花空折枝.',
    joinTime: '2022-02-09',
    status: true
  }
])

const changeStatus = (isChecked: boolean, row: any) => {
  dataSource.value.forEach((item) => {
    if (item.id === row.id) {
      layer.msg('Success', { icon: 1 }, () => {
        item.status = isChecked
      })
    }
  })
}

const remove = () => {
  layer.msg(JSON.stringify(selectedKeys.value), { area: '50%' })
}

const loadDataSource = (page: number, pageSize: number) => {
  var response = []
  var startIndex = (page - 1) * pageSize + 1
  var endIndex = page * pageSize
  for (var i = startIndex; i <= endIndex; i++) {
    response.push({
      id: `${i}`,
      age: '18',
      sex: '男',
      avatar:
        'https://tse1-mm.cn.bing.net/th/id/OIP-C.0fLeVmNXnV-6Eom3FEUNjgAAAA?w=196&h=196&c=7&r=0&o=5&dpr=1.5&pid=1.7',
      name: `张三${i}`,
      email: 'test@qq.com',
      remark: '花开堪折直须折,莫待无花空折枝.',
      joinTime: '2022-02-09',
      city: '浙江杭州',
      status: true
    })
  }
  return response
}
const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
const formRules = ref({

})
const changeVisible11 = (text: any, row?: any) => {
  title.value = text
  if (row) {
    let info = JSON.parse(JSON.stringify(row))
    delete info.__typename
    delete info.createTime
    model11.value = info
  } else {
    model11.value = {
      gender: 0
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
  if (selectedKeys.value.length == 0) {
    layer.msg('您未选择数据，请先选择要删除的数据', { icon: 3, time: 2000 })
    return
  }
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
const { mutate: addUser, loading: addUserLoading, onDone: addUserDone } = addUserMutation
function toSubmit() {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id) {

      } else {
        addUser({user: model})
        addUserDone(({ data: { addUser } }) => {
          if (addUser ?? false) {
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
function confirm() {
  layer.msg('您已成功删除')
}
function cancel() {
  layer.msg('您已取消操作')
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
.user-box {
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