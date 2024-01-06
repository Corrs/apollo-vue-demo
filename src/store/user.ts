import { defineStore } from 'pinia'
import { menu, permission } from "../api/module/user"
import { listToTree } from '../library/treeUtil'
 
const MENU = 1
const BTN = 2 

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      token: '',
      userInfo: {},
      permissions: [],
      menus: [],
    }
  },
  actions: {
    loadMenusAndPermissions(permissions: Array<any>) {
      // 按鈕權限
      permissions.filter(e => e.type === BTN)
        .forEach(e => {
          const perms = e.perms?.split(',')
          if (perms) {
            perms.forEach((p: string) => {
              const perm = p.trim()
              if (perm) {
                this.permissions.push(perm)
              }
            })
          }
        })
      // 菜單
      const menus = permissions.filter(e => e.type === MENU)
        .map(e => {
          return {
            title: e.name,
            icon: e.icon,
            parentId: e.parentId,
            sort: e.sort,
            mid: e.id,
            id: e.url
          }
        })
        const requireMenus = [{
          id: "/",
          icon: "layui-icon-desktop",
          title: "工作台",
          children: [
            {
              id: "/home",
              icon: "layui-icon-home",
              title: "首页"
            }
          ]
        }]
        this.menus = requireMenus.concat(listToTree(menus, 0, 'mid', 'parentId'))
    },
    async loadMenus(){
      const { data, code } = await menu();
      if(code == 200) {
        this.menus = data;
      }
    },
    async loadPermissions(){
      const { data, code } = await permission();
      if(code == 200) {
        debugger
        this.permissions = data;
      }
    },
    clear() {
      this.token = ''
      this.userInfo = {}
      this.permissions = []
      this.menus = []
    },
    logout() {
      this.token = ''
      this.userInfo = {}
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token', 'userInfo', 'permissions', 'menus' ],
  }
})