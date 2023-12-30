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
          @confirm="confirm"
          @cancel="cancel"
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
            <lay-tree-select v-model="model11.pid" :data="treeSelectData" :minCollapsedNum="0" placeholder="请选择"></lay-tree-select>
          </lay-form-item>
          <lay-form-item label="排序" prop="sort">
            <lay-input-number v-model.number="model11.sort" position="right"></lay-input-number>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button size="sm" type="primary" @click="toSubmit" :loading="addDeptLoading">保存</lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { layer } from '@layui/layui-vue'
import { depts, addDept, DEPTS } from '../../../api/module/system'
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
const { result: dpetsResult, loading: deptsLoading, load: loadDepts, refetch: refetchDepts } = depts
onMounted(() => {
  loadDepts()
})

const dataSource = computed(() => {
  const list = dpetsResult.value?.depts
  if (Array.isArray(list)) {
    const treeList = list.map(e => {
      return {
        ...e
      }
    })
    return listToTree(treeList, 0)
  }
  return []
})
const treeSelectData = computed(() => {
  const list = dpetsResult.value?.depts
  if (Array.isArray(list)) {
    const treeList = list.map(e => {
      return {
        id: e.id,
        pid: e.pid,
        title: e.name
      }
    })
    return listToTree(treeList, 0)
  }
  return [{
    id: 0,
    title: '一级机构'
  }]
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

// 清除校验
const clearValidate11 = function () {
  layFormRef11.value.clearValidate()
}
// 重置表单
const reset11 = function () {
  layFormRef11.value.reset()
}

const { onDone: addDeptDone, loading: addDeptLoading, mutate: addDeptMutate } = addDept
function toSubmit() {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id) {
        // 编辑
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
            cache.writeQuery({ query: DEPTS, data })
            successMsg('保存成功')
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
function confirm() {
  layer.msg('您已成功删除')
}
function cancel() {
  layer.msg('您已取消操作')
}

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