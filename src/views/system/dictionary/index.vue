<template>
  <lay-container fluid="true" class="container-box">
    <lay-card>
      <lay-form style="margin-top: 10px" >
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label-width="0">
              <lay-input
                v-model="searchQuery.dictName"
                placeholder="字典名称"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label-width="0">
              <lay-input
                v-model="searchQuery.dictType"
                placeholder="字典类型"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label-width="0">
              <lay-button
                style="margin-left: 20px"
                size="sm"
                @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button size="sm" type="normal" @click="toReset"> 重置 </lay-button>
              <lay-button
                v-permission="['sys:dict:save']"
                type="primary"
                size="sm"
                @click="changeVisible11('新增', null)"
              >
                新增
              </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- 字典列表 -->
    <div class="table-box">
      <lay-table ref="dictTableRef" 
        :page="page"
        :columns="columns"
        :loading="dictTypesLoading"
        :data-source="dataSource"
        :default-toolbar="false" 
        :expand-index="0"
        :height="'100%'"
      >
        <template v-slot:dictType="{ row }">
          <lay-button
            size="xs"
            border-style="none"
            style="color:#16b777"
            @click="showDataDrawer(row)"
            >{{ row.dictType }}</lay-button
          >
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            border="blue"
            border-style="dashed"
            @click="showDataDrawer(row)"
            >字典配置</lay-button
          >
          <lay-button
            v-permission="['sys:dict:update']"
            size="xs"
            border="blue"
            border-style="dashed"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-button v-permission="['sys:dict:delete']" size="xs" border="red" border-style="dashed" @click="delDict(row.id)">删除</lay-button>
        </template>
      </lay-table>
    </div>
    
    <!-- 新增字典 -->
    <lay-layer v-model="visible11" :title="title" :area="['700px', '270px']">
      <div style="padding: 20px">
        <lay-form :model="dictTypeModel" ref="typeFromRef" :rules="typeRules">
          <lay-row>
            <lay-col md="12">
              <lay-form-item label="字典名称" prop="dictName" required>
                <lay-input v-model="dictTypeModel.dictName" placeholder="请输入字典名称"></lay-input>
              </lay-form-item>
              <lay-form-item label="字典类型" prop="dictType" required>
                <lay-input v-model="dictTypeModel.dictType" placeholder="请输入字典类型"></lay-input>
              </lay-form-item>
            </lay-col>
            <lay-col md="12">
              <lay-form-item label="排序" prop="sort" required>
                <lay-input-number
                  style="width: 100%"
                  v-model="dictTypeModel.sort"
                  position="right"
                ></lay-input-number>
              </lay-form-item>
              <lay-form-item label="备注" prop="remark" :required="false">
                <lay-textarea
                  :rows="2"
                  allow-clear
                  placeholder="请输入备注"
                  v-model="dictTypeModel.remark"
                ></lay-textarea>
              </lay-form-item>
            </lay-col>
          </lay-row>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button size="sm" type="primary" :loading="addDictTypeLoading || editDictTypeLoading" @click="toSubmitType"
            >保存</lay-button
          >
          <lay-button size="sm" @click="() => visible11 = false">取消</lay-button>
        </div>
      </div>
    </lay-layer>

    <!-- 抽屉 -->
    <lay-layer type="drawer" :beforeClose="beforeCloseDataDrawer" v-model="dataVisible" :title="dataTitle" :area="['70%', '100%']">
      <lay-container fluid="true" class="drawer-box">
        <lay-card>
          <lay-form style="margin-top: 10px" >
            <lay-row>
              <lay-col :md="5">
                <lay-form-item label-width="0">
                  <lay-input
                    v-model="dataSearchQuery.dictValue"
                    placeholder="字典值"
                    size="sm"
                    :allow-clear="true"
                    style="width: 98%"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col :md="5">
                <lay-form-item label-width="0">
                  <lay-input
                    v-model="dataSearchQuery.dictLabel"
                    placeholder="字典标签"
                    size="sm"
                    :allow-clear="true"
                    style="width: 98%"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col :md="5">
                <lay-form-item label-width="0">
                  <lay-button
                    style="margin-left: 20px"
                    size="sm"
                    @click="toSearchData"
                  >
                    查询
                  </lay-button>
                  <lay-button
                    v-permission="['sys:dictdata:save']"
                    type="primary"
                    size="sm"
                    @click="changeVisible('新增', null)"
                  >
                    新增
                  </lay-button>
                  <lay-button size="sm" type="danger" v-permission="['sys:dictdata:delete']" @click="batchDelDatas"> 删除 </lay-button>
                </lay-form-item>
              </lay-col>
            </lay-row>
          </lay-form>
        </lay-card>
        <div class="table-box">
          <lay-table ref="dataTableRef" 
            :page="dataPage"
            :columns="dataColumns"
            :loading="dictDatasLoading"
            :data-source="datas"
            :default-toolbar="false" 
            :expand-index="0"
            :height="'100%'"
            v-model:selected-keys="selectedKeys"
          >
            <template v-slot:operator="{ row }">
              <lay-button
                v-permission="['sys:dictdata:update']"
                size="xs"
                border="blue"
                border-style="dashed"
                @click="changeVisible('编辑', row)"
                >编辑</lay-button
              >
              <lay-button size="xs" border="red" border-style="dashed" v-permission="['sys:dictdata:delete']" @click="delData(row.id)">删除</lay-button>
            </template>
          </lay-table>
        </div>
        
        <lay-layer v-model="visible" :title="title" :area="['700px', '270px']">
          <div style="padding: 20px">
            <lay-form :model="dictDataModel" ref="dataFormRef" :rules="dataRules">
              <lay-row>
                <lay-col md="12">
                  <lay-form-item label="字典值" prop="dictValue" required>
                    <lay-input v-model="dictDataModel.dictValue" placeholder="请输入字典值"></lay-input>
                  </lay-form-item>
                  <lay-form-item label="字典标签" prop="dictLabel" required>
                    <lay-input v-model="dictDataModel.dictLabel" placeholder="请输入字典标签"></lay-input>
                  </lay-form-item>
                </lay-col>
                <lay-col md="12">
                  <lay-form-item label="排序" prop="sort" required>
                    <lay-input-number
                      style="width: 100%"
                      v-model="dictDataModel.sort"
                      position="right"
                    ></lay-input-number>
                  </lay-form-item>
                  <lay-form-item label="备注" prop="remark" :required="false">
                    <lay-textarea
                      :rows="2"
                      allow-clear
                      placeholder="请输入备注"
                      v-model="dictDataModel.remark"
                    ></lay-textarea>
                  </lay-form-item>
                </lay-col>
              </lay-row>
            </lay-form>
            <div style="width: 100%; text-align: center">
              <lay-button size="sm" type="primary" :loading="addDictDataLoading || editDictDataLoading" @click="toSubmitData"
                >保存</lay-button
              >
              <lay-button size="sm" @click="() => visible = false">取消</lay-button>
            </div>
          </div>
        </lay-layer>
      </lay-container>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { successMsg, errorMsg, warnMsg, confirm } from '../../../library/layerUtil'
import { addDictDataMutation, dictDatasQuery, editDictDataMutation, remDictDataMutation, addDictTypeMutation, dictTypesQuery, editDictTypeMutation, remDictTypeMutation } from '../../../api/module/system'

const { load: loadDictTypes, result: dictTypes, loading: dictTypesLoading, variables: qeuryVariables } = dictTypesQuery
onMounted(() => {
  // 初始加载字典列表数据
  qeuryVariables.value = getDictTypeQuery()
  loadDictTypes()
})
// 获取字典列表查询参数
function getDictTypeQuery() {
  return {
    p: {
      current: page.current,
      limit: page.limit
    },
    query: {
      ...searchQuery.value
    }
  }
}
// 字典表格查询条件 & 条件重置 & 查询
const searchQuery = ref({
  dictName: '',
  dictType: ''
})
function toReset() {
  searchQuery.value = {
    dictName: '',
    dictType: ''
  }
}
function toSearch() {
  page.current = 1
  change(page)
}
// 字典表格分页切换
const change = (page: any) => {
  qeuryVariables.value = getDictTypeQuery()
}
// 字典表格配置
const columns = ref([
  { title: '字典名称', key: 'dictName', width: '150px' },
  { title: '字典类型', key: 'dictType', width: '150px', customSlot: 'dictType' },
  { title: '排序', key: 'sort', width: '80px' },
  { title: '备注', key: 'remark' },
  { title: '创建时间', width: '180px', key: 'createTime' },
  {
    title: '操作',
    width: '180px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const dataSource = computed(() => {
  const data = dictTypes.value?.dictTypes
  if (data) {
    const edges = data.edges
    page.total = data.total ?? 0
    return Array.isArray(edges) ? edges.map(e => e.node) : []
  }
  page.total = 0
  return []
})
// 分页器，不要用ref
const page = reactive({ current: 1, limit: 10, total: 0, hideOnSinglePage: false, layout: ['count', 'prev', 'page', 'next', 'limits', 'skip'] })
const typeFromRef = ref()
// 字典表单校验规则
const typeRules = ref({
  dictName: {
    type: 'string',
    min: 1,
    max: 255
  },
  dictType: {
    type: 'string',
    min: 1,
    max: 100
  },
  remark: {
    type: 'string',
    max: 255
  },
  sort: {
    type : 'integer',
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
// 删除字典
const { mutate: remDictType, onDone: remDictTypeDone } = remDictTypeMutation
function delDict (id: number) {
  confirm('您将删除所有选中的数据？', () => {
    return new Promise<boolean>((resolve, reject) => {
      remDictType({id})
      remDictTypeDone(({data: {remDictType}}) => {
        successMsg('删除成功', () => resolve(true))
      })
    })
  })
}
const { mutate: addDictType, loading: addDictTypeLoading, onDone: addDictTypeDone } = addDictTypeMutation
const { mutate: editDictType, loading: editDictTypeLoading, onDone: editDictTypeDone } = editDictTypeMutation
// 字典数据提交
function toSubmitType() {
  typeFromRef.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id && model.id > 0) {
        const dictType = {
          ...model
        }
        delete dictType.__typename
        delete dictType.createTime
        // 编辑字典
        editDictType({
          dictType
        })
        editDictTypeDone(({data: {editDictType}}) => {
          if (editDictType) {
            successMsg('保存成功', () => {
              visible11.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      } else {
        // 新增字典
        addDictType({
          dictType: {
            ...model
          }
        })
        addDictTypeDone(({data: {addDictType}}) => {
          if (addDictType) {
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

const dictTypeModel = ref({
  dictName: '',
  dictType: '',
  sort: 0,
  remark: ''
})
const visible11 = ref(false)
const title = ref('新增')
const changeVisible11 = (text: any, row: any) => {
  title.value = text
  if (row) {
    let info = JSON.parse(JSON.stringify(row))
    dictTypeModel.value = info
  } else {
    dictTypeModel.value = {
      dictName: '',
      dictType: '',
      sort: 0,
      remark: ''
    }
  }
  visible11.value = !visible11.value
}

/**
 * ====== 分割线 ======
 */
// 打开字典配置抽屉
function showDataDrawer(row: any) {
  dataTitle.value = `字典配置 - ${row.dictType}`
  dictTypeId.value = row.id
  dataVisible.value = !dataVisible.value
  dataQeuryVariables.value = getDictDataQuery()
  loadDictDatas()
}
const dataSearchQuery = ref({
  dictValue: '',
  dictLabel: ''
})
const visible = ref(false)
const selectedKeys = ref()
const dataVisible = ref(false)
const dictTypeId = ref()
const dataTitle = ref()
const dictDataModel = ref({
  dictTypeId: dictTypeId.value,
  dictLabel: '',
  dictValue: '',
  sort: 0,
  remark: ''
})
// 字典表单校验规则
const dataRules = ref({
  dictValue: {
    type: 'string',
    min: 1,
    max: 200
  },
  dictLabel: {
    type: 'string',
    min: 1,
    max: 200
  },
  remark: {
    type: 'string',
    max: 200
  },
  sort: {
    type : 'integer',
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
const dataColumns = ref([
  { title:"选项", width: "55px", type: "checkbox", fixed: "left" },
  { title: '字典值', key: 'dictValue', width: '150px' },
  { title: '字典标签', key: 'dictLabel', width: '150px' },
  { title: '排序', key: 'sort', width: '80px' },
  { title: '备注', key: 'remark' },
  { title: '创建时间', width: '180px', key: 'createTime' },
  {
    title: '操作',
    width: '180px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const datas = computed(() => {
  const data = dictDatas.value?.dictDatas
  if (data) {
    const edges = data.edges
    dataPage.total = data.total ?? 0
    return Array.isArray(edges) ? edges.map(e => e.node) : []
  }
  dataPage.total = 0
  return []
})
const { load: loadDictDatas, result: dictDatas, loading: dictDatasLoading, variables: dataQeuryVariables } = dictDatasQuery

function getDictDataQuery() {
  return {
    p: {
      current: dataPage.current,
      limit: dataPage.limit
    },
    query: {
      ...dataSearchQuery.value,
      dictTypeId: dictTypeId.value
    }
  }
}
function toSearchData () {
  dataPage.current = 1
  changeDataPage(dataPage)
}

const changeDataPage = (page: any) => {
  dataQeuryVariables.value = getDictDataQuery()
}

function beforeCloseDataDrawer() {
  // 重置必要数据
  dataSearchQuery.value = {
    dictValue: '',
    dictLabel: ''
  }
  dataPage.current = 1
  dataPage.limit = 10
  dataPage.total = 0
  selectedKeys.value = []
}

function changeVisible(text: any, row: any) {
  title.value = text
  if (row) {
    let info = JSON.parse(JSON.stringify(row))
    dictDataModel.value = info
  } else {
    dictDataModel.value = {
      dictTypeId: dictTypeId.value,
      dictLabel: '',
      dictValue: '',
      sort: 0,
      remark: ''
    }
  }
  visible.value = !visible.value
}
const dataFormRef = ref()
const dataPage = reactive({ current: 1, limit: 10, total: 0, hideOnSinglePage: false, layout: ['count', 'prev', 'page', 'next', 'limits', 'skip'] })
const { mutate: addDictData, loading: addDictDataLoading, onDone: addDictDataDone } = addDictDataMutation
const { mutate: editDictData, loading: editDictDataLoading, onDone: editDictDataDone } = editDictDataMutation
// 字典数据提交
function toSubmitData() {
  dataFormRef.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      if (model.id && model.id > 0) {
        const dictData = {
          ...model
        }
        delete dictData.__typename
        delete dictData.createTime
        delete dictData.dictTypeId
        // 编辑字典
        editDictData({
          dictData
        })
        editDictDataDone(({data: {editDictData}}) => {
          if (editDictData) {
            successMsg('保存成功', () => {
              visible.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      } else {
        // 新增字典
        addDictData({
          dictData: {
            ...model
          }
        })
        addDictDataDone(({data: {addDictData}}) => {
          if (addDictData) {
            successMsg('保存成功', () => {
              visible.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      }
    }
  })
}
const { mutate: remDictData, loading: remDictDataLoading, onDone: remDictDataDone } = remDictDataMutation
function delDatas(ids: Array<number>): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    remDictData({ids})
    remDictDataDone(({data: {remDictData}}) => {
      successMsg('删除成功', () => {
        selectedKeys.value = []
        resolve(true)
      })
    })
  })
}
function batchDelDatas() {
  if (!(selectedKeys.value?.length ?? 0)) {
    warnMsg('请选择删除项')
  } else {
    confirm('您将删除所有选中的数据？', () => {
      return delDatas(selectedKeys.value)
    })
  }
}
function delData(id: number) {
  confirm('您将删除所有选中的数据？', () => {
    return delDatas([id])
  })
}
</script>

<style scoped>
.table-box {
  margin-top: 10px;
  padding: 10px;
  height: 700px;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>