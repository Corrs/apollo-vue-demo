import { defineStore } from 'pinia'

export const useDictStore = defineStore({
  id: 'dict',
  state: () => {
    return {
      typeDetail: {},
    }
  },
  actions: {
    getTypeId() {
        return this.typeDetail?.id ?? 0
    }
  }
})