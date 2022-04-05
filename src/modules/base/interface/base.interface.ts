export interface Base {
  id: number,          // 教职工号
  createTime: Date,    // 创建时间
  updateTime: Date,    // 更新时间
  name: string,        //  姓名
  sex: string,  // 性别
  birth: string,      // 出生年月
  location: string,  // 联系地址
  telephone: string,  // 电话
  introduce: string,    // 详细介绍
  graduation: string,      // 毕业院校
  education: string,  // 学历
  apartment: string,  // 部门
  title: string,    // 职称
  status:string,    // 任职状态
  isDelete?: '',    // 是否删除
}
