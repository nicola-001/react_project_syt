// 医院设置每一项对象类型
export interface IhospitalSetItem {
    id: number,
    createTime: string,
    hosname: string,
    hoscode: string,
    apiUrl: string,
    signKey: string,
    contactsName: string,
    contactsPhone: string,
    status: number
}

//医院设置列表类型
export type IHospitalSetList = IhospitalSetItem[]

// 医院设置分页响应数据类型
export interface IHospitalSetResponse {
    records: IHospitalSetList,
    total: number
}

//新增或更新医院的请求体参数类型
export interface IHospitalSetData {
    id?: string,
    apiUrl: string,
    contactsName: string,
    contactsPhone: string,
    hosname: string,
    hoscode: string
}
