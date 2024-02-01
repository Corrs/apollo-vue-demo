import { defineStore } from 'pinia'

export const useNoticeStore = defineStore({
  id: 'notice',
  state: () => {
    return {
      hasNewNotice: false
    }
  },
  actions: {
    
  },
  persist: false
})