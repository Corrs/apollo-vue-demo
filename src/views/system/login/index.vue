<template>
  <lay-container fluid="true" class="login-box">
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
                v-model="searchQuery.status" 
                :allow-clear="true" 
                size="sm"
                placeholder="状态" 
                :options="loginStatus"
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
    <div class="table-box">
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
        <template #status="{ row }">
          <template v-for="option in loginStatus">
            <div v-if="row.status === option.value">
              <lay-tag :color="option.color" variant="light">{{ option.label }}</lay-tag>
            </div>
          </template>
        </template>
        <template #operation="{ row }">
          <div v-show="row.operation == 0">登录</div>
          <div v-show="row.operation == 1">退出登录</div>
        </template>
      </lay-table>
    </div>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { now, dateStr, nowStr } from '../../../library/dayUtil'
import { loginLogsQuery } from '../../../api/module/system'
import { warnMsg } from '../../../library/layerUtil'
 
const searchQuery = ref({
  username: '',
  status: null,
  rangeTime: [dateStr(now().startOf('d')), nowStr()]
})
const loginStatus = ref([
  { value: 0, label: '失败', color: '#FF5722' },
  { value: 1, label: '成功', color: '#16b777' },
  { value: 2, label: '账号已锁定', color: '#FFB800' }
])

// 点击重置按钮
function toReset() {
  searchQuery.value = {
    username: '',
    status: null,
    rangeTime: [dateStr(now().startOf('d')), nowStr()]
  }
}

const { loading, load: loadLogs, result: logs, variables: qeuryVariables } = loginLogsQuery
onMounted(() => {
  qeuryVariables.value = {
    cond: getQueryParams()
  }
  loadLogs()
})

function getQueryParams() {
  const query = searchQuery.value
  const startTime = query.rangeTime[0]
  const endTime = query.rangeTime[1]
  return {
    username: query.username,
    status: query.status,
    startTime,
    endTime,
    current: page.current,
    limit: page.limit
  }
}

// 点击查询按钮 
function toSearch() {
  page.current = 1
  change(page)
}

// 计算数据源，并计算total的值
const dataSource = computed(() => {
  const edges = logs.value?.loginLogs?.edges
  page.total = logs.value?.loginLogs?.total ?? 0
  return Array.isArray(edges) ? edges.map(e => e.node) : []
})

// 分页器，不要用ref
const page = reactive({ current: 1, limit: 10, total: 0, hideOnSinglePage: false, layout: ['count', 'prev', 'page', 'next', 'limits', 'skip'] })

const columns = ref([
  { title: '用户名', width: '150px', key: 'username' },
  {
    title: '操作类型',
    width: '120px',
    key: 'operation',
    customSlot: 'operation'
  },
  {
    title: '状态',
    width: '200px',
    key: 'status',
    customSlot: 'status'
  },
  { title: 'IP地址', width: '150px', key: 'ip' },
  {
    title: '用户代理',
    key: 'userAgent',
    customSlot: 'userAgent'
  },
  { title: '登录时间', width: '220px', key: 'createTime' }
])

// 切换分页器
const change = (page: any) => {
  const cond = getQueryParams()
  if (!cond.startTime || !cond.endTime) {
    warnMsg('请选择时间')
    return
  }
  if (!cond.startTime) {
    cond.startTime = null
  }

  if (!cond.endTime) {
    cond.endTime = null
  }

  if (cond.status === '') {
    cond.status = null
  }
  qeuryVariables.value = {
    cond
  }
}
</script>

<style scoped>
.login-box {
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
.oneRow {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>../../../library/layerUtil