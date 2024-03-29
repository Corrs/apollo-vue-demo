<template>
  <lay-container fluid="true" class="container-box">
    <div class="table-box">
      <lay-table ref="tableRef6" 
        children-column-name="children" 
        :columns="columns"
        :loading="deptsLoading"
        :data-source="dataSource"
        :default-expand-all="defaultExpandAll"
        :default-toolbar="false" 
        :expand-index="0"
        :height="'100%'"
      >
        <template v-slot:toolbar>
          <lay-button
            v-permission="['sys:dept:save']"
            size="sm"
            type="primary"
            @click="changeVisible11('新增', null)"
            >新增</lay-button
          >
          <lay-button
            size="sm"
            type="normal"
            @click="refetchDepts()"
            >刷新数据</lay-button
          >
          <lay-button size="sm" @click="() => {defaultExpandAll=!defaultExpandAll}">{{ defaultExpandAll ? '收起全部':'全部展开'}}</lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            v-permission="['sys:dept:update']"
            size="xs"
            border="blue"
            border-style="dashed"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-button size="xs" border="red" border-style="dashed" @click="delDept(row.id)" v-permission="['sys:dept:delete']">删除</lay-button>
        </template>
      </lay-table>
    </div>
    <lay-layer v-model="visible11" :title="title" :area="['500px', '450px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="名称" prop="name">
            <lay-input v-model.trim="model11.name" placeholder="请输入名称，最多50字"></lay-input>
          </lay-form-item>
          <lay-form-item label="上级机构" prop="pid">
            <lay-tree-select v-model="model11.pid" :data="selectTreeData" placeholder="请选择"></lay-tree-select>
          </lay-form-item>
          <lay-form-item label="排序" prop="sort">
            <lay-input-number v-model.number="model11.sort" position="right"></lay-input-number>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button size="sm" type="primary" @click="toSubmit" :loading="addDeptLoading || editDeptLoading">保存</lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { depts, addDept, remDept, editDept } from '../../../api/module/system'
import { listToTree } from '../../../library/treeUtil'
import { successMsg, errorMsg, confirm } from '../../../library/layerUtil'

const defaultExpandAll = ref(false)
const columns = ref([
  { title: '名称', width: '180px', key: 'name', fixed: 'left' },
  { title: '上级部门', width: '120px', key: 'pname', fixed: 'left' },
  { title: '排序', width: '50px', key: 'sort' },
  {
    title: '操作',
    width: '80px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const { result: dpetsResult, loading: deptsLoading, load: loadDepts, refetch: refetchDepts } = depts
onMounted(() => {
  loadDepts() || refetchDepts()
})

const dataSource = computed(() => {
  const list = dpetsResult.value?.depts
  if (Array.isArray(list)) {
    const treeList = list.map(e => {
      return {
        ...e,
        title: e.name
      }
    })
    return listToTree(treeList, 0)
  }
  return []
})

const selectTreeData = computed(() => {
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
    children = listToTree(treeList, 0)
  }
  return [{
    id: 0,
    title: '一级机构',
    spread: true,
    children
  }]
})

const model11 = ref({
  pid: 0,
  name: '',
  sort: 0
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
const changeVisible11 = (text: any, row: any) => {
  title.value = text
  if (row != null) {
    let info = JSON.parse(JSON.stringify(row))
    delete info.__typename
    delete info.pname
    delete info.title
    delete info.children
    model11.value = info
  } else {
    model11.value = {
      name: '',
      sort: 0,
      pid: 0
    }
  }
  visible11.value = !visible11.value
}

const { loading: addDeptLoading, mutate: addDeptMutate, onDone: addDeptDone } = addDept
const { loading: editDeptLoading, mutate: editDeptMutate, onDone: editDeptDone } = editDept
function toSubmit() {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id) {
        // 编辑
        editDeptMutate({
          dept: model
        })
        editDeptDone(({ data: {  editDept } }) => {
          if (editDept) {
            successMsg('保存成功', () => {
              visible11.value = false
            })
          }
        })
      } else {
        // 新增
        addDeptMutate({
          dept: {
            name: model.name,
            pid: model.pid,
            sort: model.sort
          }
        })
        addDeptDone(({ data: {  addDept } }) => {
          if (addDept) {
            successMsg('保存成功', () => {
              visible11.value = false
            })
          }
        })
      }
    }
  })
}
function toCancel() {
  visible11.value = false
}
// 删除部门数据代码逻辑 start
const { mutate: remDeptMutate, onDone: remDeptDone } = remDept
function delDept(id: number) {
  // 需要查看是否有子部门，如果有子部门，不允许删除
  const list = dpetsResult.value?.depts
  if (list.findIndex((e: any) => e.pid === id) > -1) {
    errorMsg('请先删除子机构')
  } else {
    confirm('确定要删除此组织吗?', () => {
      return new Promise<boolean>((resolve, reject) => {
        remDeptMutate({id})
        remDeptDone(({data: {remDept}}) => {
          successMsg('删除成功', () => resolve(true))
        })
      })
    })
  }
}
// 删除部门数据代码逻辑 end

</script>

<style scoped>
</style>