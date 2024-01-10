const getDepth = function () {};

/**
 * 获取当前节点
 *  
 * @param list 集合
 * @param id 节点编号
 */
export const getNode = function(list: any[], id: string): any {
  for (let i in list) {
    let item = list[i];
    if (item.id === id) {
      return item;
    } else {
      if (item.children) {
        let value = getNode(item.children, id);
        if (value) {
          return value;
        }
      }
    }
  }
}

/**
 * 获取所有父节点 ( 包含当前节点 )
 * 
 * @param list 集合
 * @param id 节点编号
 */
export const getParents = function(list:any[], id: string) : any{
  for (let i in list) {
      if (list[i].id === id) {
         return [list[i]]
      }
      if (list[i].children) {
        let node = getParents(list[i].children, id)
        if (node !== undefined) {
          return node.concat(list[i])
        }
      }
   }    
}

export const treeToList = function (arr: any[]){
  let res: any[] = []
  let fn = (source: any[])=>{
    source.forEach(el=>{
      res.push(el)
      el.children && el.children.length>0 ? fn(el.children) : "";
    });
  };
  fn(arr);
  return res;
}

export const listToTree = function(arr:any[], root:any, col:string = 'id', refCol:string = 'pid', sortCol:string = 'sort') {
  let res: any[] = JSON.parse(JSON.stringify(arr))
  res.forEach(e => {
    res.forEach(y => { 
      if (y[refCol] == e[col]) { 
        if (!e.children) {
          e.children = []
        }
        e.children.push(y)
        if (e.children.length > 1) {
          e.children.sort((e1: any, e2: any) => e1[sortCol]-e2[sortCol])
        }
      }
    })
  })
  res = res.filter(ele => ele[refCol] === root).sort((e1, e2) => e1[sortCol]-e2[sortCol])
  return res
}