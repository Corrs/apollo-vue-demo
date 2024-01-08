<template>
  <lay-container fluid="true" class="container-box">
    <lay-card>
      <lay-form style="margin-top: 10px" >
        <lay-row>
          <lay-col :md="8">
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
          <lay-col :md="5">
            <lay-form-item label-width="0">
              <lay-select 
                v-model="searchQuery.status" 
                :allow-clear="true" 
                size="sm"
                placeholder="状态" 
                :options="statusOptions"
                style="width: 98%"
              ></lay-select>
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
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
    <div class="table-box table-box-h-700 ">
      <lay-table
        :page="page"
        :height="'100%'"
        :columns="columns"
        :loading="loading"
        :default-toolbar="false"
        :data-source="dataSource"
        @change="change"
      >
        <template #userAgent="{ row }">
          <lay-tooltip :visible="false" trigger="hover" :content="row.userAgent">
            <div class="oneRow">{{ row.userAgent }}</div>
          </lay-tooltip>
        </template>
        <template #requestParams="{ row }">
          <lay-tooltip
            :visible="false"
            trigger="hover"
            :content="row.requestParams"
          >
            <div class="oneRow">{{ row.requestParams }}</div>
          </lay-tooltip>
        </template>

        <template #status="{ row }">
          <template v-for="option in statusOptions">
            <div v-if="row.status === option.value">
              <lay-tag :color="option.color" variant="light">{{ option.label }}</lay-tag>
            </div>
          </template>
        </template>
        <template #time="{ row }">
          <div class="oneRow">{{ row.requestTime }}ms</div>
        </template>
      </lay-table>
    </div>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { now, dateStr, nowStr } from '../../../library/dayUtil'
import { operationLogsQuery } from '../../../api/module/system'
import { warnMsg } from '../../../library/layerUtil'
const statusOptions = [
  { value: 0, label: '失败', color: '#FF5722' },
  { value: 1, label: '成功', color: '#16b777' },
]
const searchQuery = ref({
  status: null,
  rangeTime: [dateStr(now().subtract(7, 'day').startOf('d')), nowStr()]
})

const { loading, result: logs, variables: qeuryVariables, load: loadLogs } = operationLogsQuery
onMounted(() => {
  qeuryVariables.value = getQueryParams()
  loadLogs()
})

function getQueryParams() {
  const query = searchQuery.value
  const startTime = query.rangeTime[0]
  const endTime = query.rangeTime[1]
  return {
    p: {
      current: page.current,
      limit: page.limit
    },
    query: {
      status: query.status,
      startTime,
      endTime
    }
  }
}

function toReset() {
  searchQuery.value = {
    status: null,
    rangeTime: [dateStr(now().subtract(7, 'day').startOf('d')), nowStr()]
  }
}

function toSearch() {
  page.current = 1
  change(page)
}

const page = reactive({ current: 1, limit: 10, total: 0, hideOnSinglePage: false, layout: ['count', 'prev', 'page', 'next', 'limits', 'skip'] })
const columns = ref([
  { title: '账号', key: 'username', width: '100px' },
  { title: '操作功能', width: '180px', key: 'operation' },
  {
    title: ' 请求参数',
    key: 'requestParams',
    customSlot: 'requestParams'
  },
  {
    title: '状态',
    width: '100px',
    key: 'status',
    customSlot: 'status'
  },
  { title: '耗时', key: 'requestTime', customSlot: 'time', width: '120px' },
  { title: 'IP地址', width: '150px', key: 'ip' },
  {
    title: '用户代理',
    key: 'userAgent',
    customSlot: 'userAgent'
  },
  { title: '操作时间', width: '180px', key: 'createTime' }
])
const change = (page: any) => {
  const params = getQueryParams()
  const query = params.query
  if (!query.startTime || !query.endTime) {
    warnMsg('请选择时间')
    return
  }
  if (!query.startTime) {
    query.startTime = null
  }

  if (!query.endTime) {
    query.endTime = null
  }

  if (query.status === '') {
    query.status = null
  }
  qeuryVariables.value = params
}
const dataSource = computed(() => {
  const data = logs.value?.operationLogs
  if (data) {
    const edges = data.edges
    page.total = data.total ?? 0
    return Array.isArray(edges) ? edges.map(e => e.node) : []
  }
})
</script>

<style scoped>

</style>