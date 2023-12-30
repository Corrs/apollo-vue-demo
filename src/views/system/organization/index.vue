<template>
  <lay-container fluid="true" class="organization-box">
    <lay-table ref="tableRef6" 
      children-column-name="children" 
      :columns="columns"
      :loading="deptsLoading"
      :data-source="dataSource" 
      :default-toolbar="false" 
      :expand-index="0"
      :height="'100%'"
    >
      <template v-slot:toolbar>
        <lay-button
          size="sm"
          type="primary"
          @click="changeVisible11('新增', null)"
          >新增</lay-button
        >
      </template>
      <template v-slot:operator="{ row }">
        <lay-button
          size="xs"
          border="green"
          border-style="dashed"
          @click="changeVisible11('编辑', row)"
          >编辑</lay-button
        >
        <lay-popconfirm
          content="确定要删除此组织吗?"
          position="right"
          @confirm="delDept(row.id)"
        >
          <lay-button size="xs" border="red" border-style="dashed"
            >删除</lay-button
          >
        </lay-popconfirm>
      </template>
    </lay-table>
    <lay-layer v-model="visible11" :title="title" :area="['500px', '450px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="名称" prop="name">
            <lay-input v-model.trim="model11.name" placeholder="请输入名称，最多50字"></lay-input>
          </lay-form-item>
          <lay-form-item label="上级部门" prop="pid">
            <lay-tree-select v-model="model11.pid" :data="dataSource" :minCollapsedNum="0" placeholder="请选择"></lay-tree-select>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { layer } from '@layui/layui-vue'
import { depts, addDept, DEPTS, remDept, editDept } from '../../../api/module/system'
import { listToTree } from '../../../library/treeUtil'
import { successMsg, errorMsg } from '../../../library/msgUtil'

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
const { result: dpetsResult, loading: deptsLoading, load: loadDepts } = depts
onMounted(() => {
  loadDepts()
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

const model11 = ref({
  pid: 1,
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
      pid: 1
    }
  }
  visible11.value = !visible11.value
}

const { loading: addDeptLoading, mutate: addDeptMutate } = addDept
const { loading: editDeptLoading, mutate: editDeptMutate } = editDept
function toSubmit() {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id) {
        // 编辑
        editDeptMutate({
          dept: model
        }, {
          update: (cache, { data: { editDept } }) => {
            if (editDept) {
              let data = cache.readQuery({ query: DEPTS })
              const deptsCache = data.depts
              const depts = deptsCache.toSpliced(deptsCache.findIndex((e: any) => e.id === model.id), 1, editDept)
              data = {
                ...data,
                depts: [
                  ...depts
                ],
              }
              successMsg('保存成功')
              cache.writeQuery({ query: DEPTS, data })
              visible11.value = false
            }
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
        }, {
          update: (cache, { data: { addDept } }) => {
            let data = cache.readQuery({ query: DEPTS })
            data = {
              ...data,
              depts: [
                ...data.depts,
                addDept,
              ],
            }
            successMsg('保存成功')
            cache.writeQuery({ query: DEPTS, data })
            visible11.value = false
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
const { mutate: remDeptMutate } = remDept
function delDept(id: number) {
  // 需要查看是否有子部门，如果有子部门，不允许删除
  const list = dpetsResult.value?.depts
  if (list.findIndex((e: any) => e.pid === id) > -1) {
    errorMsg('请先删除子机构')
  } else {
    remDeptMutate({id}, {
      update: (cache, { data: { remDept } }) => {
        if (remDept) {
          let data = cache.readQuery({ query: DEPTS })
          const deptsCache = data.depts
          const depts = deptsCache.toSpliced(deptsCache.findIndex((e: any) => e.id === id), 1)
          data = {
            ...data,
            depts: [
              ...depts
            ],
          }
          successMsg('删除成功')
          cache.writeQuery({ query: DEPTS, data })
        }
      }
    })
  }
}
// 删除部门数据代码逻辑 end

</script>

<style scoped>
.organization-box {
  width: calc(100vw - 240px);
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  background-color: #fff;
  overflow: hidden;
}
.left-tree {
  display: inline-block;
  padding: 20px 15px 0 5px;
  height: 1200px;
  border-right: 1px solid #e6e6e6;
  box-sizing: border-box;
  position: relative;
}
/* todo layui-tree-entry 设置无效 */
.layui-tree-entry {
  position: relative;
  padding: 10px 0;
  height: 20px;
  line-height: 20px;
  white-space: nowrap;
}
.isFold {
  position: absolute;
  top: 36%;
  right: -10px;
  width: 26px;
  height: 26px;
  line-height: 26px;
  border-radius: 13px;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  cursor: pointer;
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