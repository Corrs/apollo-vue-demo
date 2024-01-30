<template>
  <lay-container fluid="true" class="container-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label-width="0">
              <lay-input
                v-model="searchQuery.name"
                placeholder="请输入名称"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label-width="0">
              <lay-input
                v-model="searchQuery.group"
                placeholder="请输入组名"
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
                type="primary"
                size="sm"
                @click="changeVisible('新增', null)"
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
        :columns="columns"
        :height="'100%'"
        :loading="loading"
        :default-toolbar="false"
        :data-source="dataSource"
      >
        <template v-slot:triggerType="{ row }">
          <div v-if="row.triggerType === 0">cron</div>
        </template>
        <template v-slot:status="{ row }">
          <div v-show="row.status">
            <lay-tag color="#2dc570" variant="light">运行中</lay-tag>
          </div>
          <div v-show="!row.status">
            <lay-tag color="#F5319D" variant="light">暂停</lay-tag>
          </div>
        </template>
        <template v-slot:operator="{ row }">
          <!--切换任务运行状态-->
          <lay-button
            size="xs"
            border="green"
            border-style="dashed"
            @click="switchJob(row.id, row.status)"
            >
              切换状态
            </lay-button
          >
          <lay-button
            size="xs"
            border="blue"
            border-style="dashed"
            @click="changeVisible('编辑', row)"
            >编辑</lay-button
          >
          <lay-button
            @click="toRemove(row.id)"
            size="xs"
            border="red"
            border-style="dashed"
          >
            删除
          </lay-button>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible" :title="title" :area="['700px', '670px']">
      <div style="padding: 20px">
        <lay-form :model="jobModel" ref="layFormRef" :rules="formRules">
          <lay-row>
            <lay-col md="24">
              <lay-form-item label="任务名称" prop="jobName" required>
                <lay-input v-model="jobModel.jobName" placeholder="任务名称(英文)" :disabled="isEdit"></lay-input>
              </lay-form-item>
              <lay-form-item label="分组名称" prop="jobGroup" required>
                <lay-input v-model="jobModel.jobGroup" placeholder="分组名称(英文)" :disabled="isEdit"></lay-input>
              </lay-form-item>
              <lay-form-item label="类路径" prop="jobClassName" required>
                <lay-input v-model="jobModel.jobClassName" placeholder="类路径" :disabled="isEdit"></lay-input>
              </lay-form-item>
              <lay-form-item label="触发器类型" prop="triggerType" required>
                <lay-radio-group name="triggerType" v-model="jobModel.triggerType">
                  <lay-radio :value="0">cron</lay-radio>
                  <!-- <lay-radio :value="1">simple</lay-radio>
                  <lay-radio :value="2">calendar</lay-radio>
                  <lay-radio :value="3">dailytime</lay-radio> -->
                </lay-radio-group>
              </lay-form-item>
              <!-- todo 状态 触发器规则 -->
              <lay-form-item label="cron表达式" prop="cron" required>
                <lay-input v-model="jobModel.cron" placeholder="请输入cron表达式"></lay-input>
              </lay-form-item>
              <!-- <template v-else-if="jobModel.triggerType === 1">
                <lay-form-item>
                
                </lay-form-item>
              </template>
              
              <lay-form-item v-else-if="jobModel.triggerType === 2">
                
              </lay-form-item>
              <lay-form-item v-else-if="jobModel.triggerType === 3">
                
              </lay-form-item> -->
              <lay-form-item label="状态" prop="status" required>
                <lay-radio-group name="status" v-model="jobModel.status">
                  <lay-radio :value="true">运行</lay-radio>
                  <lay-radio :value="false">暂停</lay-radio>
                </lay-radio-group>
              </lay-form-item>
              <lay-form-item label="首次运行时间" prop="firstRuntime">
                <lay-date-picker type="datetime" v-model="jobModel.firstRuntime" placeholder="选择首次运行时间"></lay-date-picker>
              </lay-form-item>
              <lay-form-item label="任务描述" prop="description">
                <lay-textarea v-model="jobModel.description" placeholder="任务描述" />
              </lay-form-item>
            </lay-col>
          </lay-row>
        </lay-form>
        <div style="width: 97%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit" :loading="addDynamicJobLoading || editDynamicJobLoading">保存</lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { successMsg, errorMsg, confirm } from '../../../library/layerUtil'
import { dynamicJobQuery, remDynamicJobMutation, editDynamicJobMutation, addDynamicJobMutation, switchDynamicJobMutation } from '../../../api/module/system'

function getQueryParams() {
  const query = searchQuery.value
  return {
    page: {
      current: page.current,
      limit: page.limit
    },
    query
  }
}
// 列表
const { result: jobResult, loading, load: loadDynamicJobs, refetch: refetchDynamicJobs } = dynamicJobQuery
onMounted(() => {
  const params = getQueryParams()
  loadDynamicJobs(null, params) || refetchDynamicJobs(params)
})
const dataSource = computed(() => {
  const data = jobResult.value?.dynamicJobs
  if (data) {
    const edges = data.edges
    page.total = data.total ?? 0
    return Array.isArray(edges) ? edges.map(e => e.node) : []
  }
  return []
})

const searchQuery = ref({
  name: '',
  group: ''
})

function toReset() {
  searchQuery.value = {
    name: '',
    group: ''
  }
}

function toSearch() {
  page.current = 1
  change(page)
}

// 分页器，不要用ref
const page = reactive({ current: 1, limit: 10, total: 0, hideOnSinglePage: false, layout: ['count', 'prev', 'page', 'next', 'limits', 'skip'] })
const columns = ref([
  { title: '任务名称', key: 'jobName', width: '120px' },
  { title: '分组名称', key: 'jobGroup', width: '120px' },
  { title: '任务描述', key: 'description' },
  { title: '状态', key: 'status', width: '80px', customSlot: 'status' },
  { title: '任务参数', width: '180px', key: 'jobData' },
  { title: '触发器类型', width: '100px', key: 'triggerType', customSlot: 'triggerType' },
  { title: '触发规则', width: '220px', key: 'triggerRule' },
  { title: '首次运行时间', width: '160px', key: 'firstRuntime' },
  {
    title: '操作',
    width: '180px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const change = (page: any) => {
  refetchDynamicJobs(getQueryParams())
}
const { mutate: remDynamicJob, onDone: remDynamicJobDone } = remDynamicJobMutation
function toRemove(id: number) {
  confirm('确定删除定时任务数据吗？', () => {
    return new Promise<boolean>((resolve, reject) => {
      remDynamicJob({ id })
      remDynamicJobDone(({data: {remDynamicJob}}) => {
        if (remDynamicJob) {
          successMsg('删除成功', () => resolve(true))
        } else {
          errorMsg('删除失败', () => resolve(false))
        }
      })
    })
  })
}
const { mutate: switchDynamicJob, onDone: switchDynamicJobDone } = switchDynamicJobMutation
function switchJob(id: number, status: boolean) {
  const tip = status ? '暂停' : '运行'
  confirm(`确定${tip}定时任务吗？`, () => {
    return new Promise<boolean>((resolve, reject) => {
      switchDynamicJob({ id })
      switchDynamicJobDone(({data: {switchDynamicJob}}) => {
        if (switchDynamicJob) {
          successMsg(`${tip}成功`, () => resolve(true))
        } else {
          errorMsg(`${tip}失败`, () => resolve(false))
        }
      })
    })
  })
}

const jobModel = ref<any>({})
const layFormRef = ref()
const visible = ref(false)
const title = ref('新增')
const formRules = ref({

})
const isEdit = computed(() => !!(jobModel.value.id))
const changeVisible = (text: any, row?: any) => {
  title.value = text
  if (row) {
    let info = JSON.parse(JSON.stringify(row))
    delete info.__typename
    delete info.createTime
    delete info.updateTime
    const triggerRule = JSON.parse(info.triggerRule)
    if (info.triggerType === 0) {
      info.cron = triggerRule.cron
    }
    jobModel.value = info 
  } else {
    jobModel.value = {
      status: true,
      triggerType: 0
    }
  }
  visible.value = !visible.value
}
const { mutate: addDynamicJob, loading: addDynamicJobLoading, onDone: addDynamicJobDone } = addDynamicJobMutation
const { mutate: editDynamicJob, loading: editDynamicJobLoading, onDone: editDynamicJobDone } = editDynamicJobMutation
function toCancel() {
  visible.value = false
}
function toSubmit() {
  layFormRef.value.validate((isValidate: any, model: any, errors: any) => {
    if (isValidate) {
      let triggerRule = ''
      if (model.triggerType === 0) {
        triggerRule = JSON.stringify({"cron": model.cron});
      }
      const job = {
        ...model,
        triggerRule
      }
      delete job.cron
      if (model.id) {
        delete job.jobName
        delete job.jobGroup
        delete job.jobClassName
        delete job.jobData
        editDynamicJob({job})
        editDynamicJobDone(({ data: { editDynamicJob } }) => {
          if (editDynamicJob) {
            successMsg('保存成功', () => {
              visible.value = false
            })
          } else {
            errorMsg('保存失败')
          }
        })
      } else {
        addDynamicJob({job})
        addDynamicJobDone(({ data: { addDynamicJob } }) => {
          if (addDynamicJob) {
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
</script>

<style scoped>

</style>