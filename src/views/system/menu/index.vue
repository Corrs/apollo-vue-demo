<template>
  <lay-container fluid="true" class="menu-box">
    <!-- table -->
    <div class="table-box">
      <lay-table
        :height="`100%`"
        ref="tableRef6"
        :loading="menusLoading"
        children-column-name="children"
        :columns="columns6"
        :data-source="dataSource6"
        :default-toolbar="false"
        :default-expand-all="defaultExpandAll6"
        :expand-index="0"
      >
        <template #toolbar>
          <lay-button
            v-permission="['sys:menu:save']"
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
            v-permission="['sys:menu:save']"
            v-if="row.type === 1"
            @click="addChild(row.id)"
            size="xs"
            border="blue"
            border-style="dashed"
          >
            添加
          </lay-button>
          <lay-button
            v-permission="['sys:menu:update']"
            @click="changeVisible11('修改', row)"
            size="xs"
            border="green"
            border-style="dashed"
          >
            修改
          </lay-button>
          <lay-button
            v-permission="['sys:menu:delete']"
            @click="toRemove(row.id)"
            size="xs"
            border="red"
            border-style="dashed"
          >
            删除
          </lay-button>
        </template>
        <template #type="{ row }">
          <div v-show="row.type === 1">
            <lay-tag color="#2dc570" variant="light">菜单</lay-tag>
          </div>
          <div v-show="row.type === 2">
            <lay-tag color="#F5319D" variant="light">按钮</lay-tag>
          </div>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['700px', '570px']">
      <div style="padding: 20px">
        <lay-form :model="menuModel" ref="layFormRef11" :rules="formRules">
          <lay-row>
            <lay-col md="24">
              <lay-form-item label="类型" prop="type" required>
                <lay-radio-group name="type" v-model="menuModel.type">
                  <lay-radio :value="1">菜单</lay-radio>
                  <lay-radio :value="2">按钮</lay-radio>
                </lay-radio-group>
              </lay-form-item>
              <lay-form-item label="名称" prop="name" required>
                <lay-input v-model="menuModel.name" placeholder="名称"></lay-input>
              </lay-form-item>
              <lay-form-item label="上级菜单" prop="parentId" required>
                <lay-tree-select v-model="menuModel.parentId" :data="menuTree"></lay-tree-select>
              </lay-form-item>
              <lay-form-item label="路由" prop="url" v-show="isMenu" :required="isMenu">
                <lay-input v-model="menuModel.url" placeholder="路由"></lay-input>
              </lay-form-item>
              <lay-form-item label="排序" prop="sort">
                <lay-input-number
                  v-model="menuModel.sort"
                  position="right"
                ></lay-input-number>
              </lay-form-item>
              <lay-form-item label="授权标识" prop="perms">
                <lay-input v-model="menuModel.perms" placeholder="多个用逗号分割，如：sys:menu:save,sys:menu:update"></lay-input>
              </lay-form-item>
              <lay-form-item label="图标" prop="icon"  v-show="isMenu" :required="isMenu">
                <lay-icon-picker v-model="menuModel.icon" allow-clear page></lay-icon-picker>
              </lay-form-item>
            </lay-col>
          </lay-row>
        </lay-form>
        <div style="width: 97%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit" :loading="addMenuLoading || editMenuLoading">保存</lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { addMenuMutation, menusQuery, editMenuMutation, remMenuMutation } from '../../../api/module/system'
import { listToTree } from '../../../library/treeUtil'
import { successMsg, errorMsg, confirm } from '../../../library/layerUtil'

// 列表
const { result: menusResult, loading: menusLoading, load: loadMenu } = menusQuery
onMounted(() => {
  loadMenu()
})
const tableRef6 = ref()
const columns6 = [
  {
    title: '菜单名称',
    key: 'name',
    customSlot: 'name',
    width: '200px'
  },
  {
    title: '类型',
    key: 'type',
    customSlot: 'type',
    width: '80px'
  },
  {
    title: '路由',
    key: 'url',
    width: '150px'
  },
  {
    title: '授权标识',
    key: 'perms',
    width: '150px'
  },
  {
    title: '排序',
    width: '50px',
    key: 'sort'
  },
  {
    title: '操作',
    key: 'option',
    customSlot: 'option',
    width: '120px'
  }
]
const dataSource6 = computed(() => {
  const list = menusResult.value?.menus
  if (Array.isArray(list)) {
    const treeList = list.map(e => {
      return {
        ...e
      }
    })
    return listToTree(treeList, 0, 'id', 'parentId')
  }
  return []
})
const defaultExpandAll6 = ref(false)
const expandAll6 = function (flag: any) {
  defaultExpandAll6.value = flag
}
const menuTree = computed(() => {
  const list = menusResult.value?.menus
  let children = []
  if (Array.isArray(list)) {
    const treeList = list.map(e => {
      return {
        ...e,
        title: e.name,
        spread: e.parentId === 0
      }
    })
    children = listToTree(treeList, 0, 'id', 'parentId')
  }
  return [{
    id: 0,
    title: '一级菜单',
    spread: true,
    children
  }]
})
// 删除
const { mutate: remMenu, onDone: remMenuDone } = remMenuMutation
function toRemove(id: integer) {
  confirm('确定删除菜单数据吗？', () => {
    return new Promise<boolean>((resolve, reject) => {
      remMenu({ id })
      remMenuDone(() => {
        successMsg('保存成功', () => resolve(true))
      })
    })
  })
}
// 新增 or 编辑
const isMenu = computed(() => menuModel.value.type === 1)
const menuModel = ref({
  name: '',
  type: 1,
  sort: 0,
  icon: 'layui-icon-home',
  url: '',
  perms: '',
  parentId: 0
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
const parentId = ref(0)
const addChild = (pid: number) => {
  parentId.value = pid
  changeVisible11('新增', null)
}

const changeVisible11 = (text: any, row: any) => {
  title.value = text
  if (row != null) {
    let info = JSON.parse(JSON.stringify(row))
    delete info.__typename
    delete info.children
    menuModel.value = info
  } else {
    menuModel.value = {
      name: '',
      type: 1,
      sort: 0,
      icon: 'layui-icon-home',
      url: '',
      perms: '',
      parentId: parentId.value
    }
  }
  visible11.value = !visible11.value
}
// 表单校验规则
const formRules = ref({
  type: {
    type: 'integer',
    min: 1,
    max: 2
  },
  name: {
    type: 'string',
    min: 1,
    max: 50
  },
  parentId: {
    type: 'integer',
    min: 0
  },
  url: {
    type: 'string',
    max: 200
  },
  perms: {
    type: 'string',
    max: 500
  },
  icon: {
    type: 'string',
    max: 50
  },
  sort: {
    asyncValidator: (rule:any, value:number) => {
      return new Promise((resolve, reject) => {
        if (!Number.isInteger(value)) {
          reject('排序必须为整数')
        }else if (value < 0) {
          reject('排序不能小于0')  // reject with error message
        } else {
          resolve(true)
        }
      })
    }
  }
})
// 新增 or 修改
const { mutate: addMenu, onDone: addMenuDone, loading: addMenuLoading } = addMenuMutation
const { mutate: editMenu, onDone: editMenuDone, loading: editMenuLoading } = editMenuMutation
function toSubmit() {
  layFormRef11.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id && model.id > 0) {
        editMenu({ menu: model })
        editMenuDone(({ data: { editMenu } }) => {
          if (editMenu ?? false) {
            successMsg('保存成功', () => {
              parentId.value = 0
              visible11.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      } else {
        addMenu({ menu: model })
        addMenuDone(({ data: {addMenu} }) => {
          if (addMenu ?? false) {
            successMsg('保存成功', () => {
              parentId.value = 0
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