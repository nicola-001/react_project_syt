// 省市区返回数据对象类型
export interface IDistrictItem {
    id: number,
    createTime: string,
    updateTime: string,
    name: string,
    value: string,
    hasChildren: boolean
}

//省市区返回数据列表类型
export type IDistrictList = IDistrictItem[]

export interface IHospitalSearchParams {
    hoscode?: string,
    hosname?: string,
    hostype?: string,
    provinceCode?: string,
    cityCode?: string,
    districtCode?: string,
    status?: number
}

//医院列表参数类型
export interface IHospitalSetListParams extends IHospitalSearchParams {
    page: number,
    limit: number
}

export interface IBookingRule {
    cycle: number,//预约周期
    releaseTime: string,//放号时间
    stopTime: string,//停挂时间
    quitDay: number,//就诊结束日期
    quitTime: string,//结束时间
    rule: string[]//区号规则
}

//医院每一项列表返回值类型
export interface IHospitalItem {
    id: string,
    createTime: string,//创建时间
    param: {
        hostypeString: string,//医院等级
        fullAddress: string//医院地址
    },
    hoscode: string,//医院编号
    hosname: string,//医院名称
    hostype: string,//医院类型
    provinceCode: string,//省
    cityCode: string,//市
    districtCode: string,//区
    address: string,//地址
    logoData: string,//医院logo baseUrl
    route: string,//乘车路线
    status: number,//医院状态
    intro: string | null,
    bookingRule: IBookingRule | null
}

export type IHospitalList = IHospitalItem[];

//  响应结果类型
export interface IHospitalListResponse {
    content: IHospitalList
    totalElements: number
}

//医院详情返回的数据类型
export interface IHospitalDetail {
    bookingRule: IBookingRule,
    hospital: IHospitalItem
}

//科室每一项对象类型
export interface IDepartmentItem {
    depcode: string,
    depname: string,
    children: IDepartmentList | null
}

// 科室列表类型
export type IDepartmentList = IDepartmentItem[]

export interface IBookingScheduleItem {
    workDate: string,//排班日期
    dayOfWeek: string,//星期几
    docCount: number,//已预约人数
    reservedNumber: number,//总预约人数
    availableNumber: number,//剩余预约人数
}

export type IBookingScheduleList = IBookingScheduleItem[]

export interface IScheduleResponse {
    total: number,
    bookingScheduleList: IBookingScheduleList,
    baseMap: {
        hosname: string
    }
}

//医生排班对象的类型
export interface IDoctorItem {
    id: number,
    createTime: string,
    param: {
        dayOfWeek: string,
        deepname: string,
        hosname: string,
    },
    hoscode: string,
    depcode: string,
    title: string,
    skill: string,
    workDate: string,
    reservedNumber: number,
    availableNumber: number,
    amount: number,
    status: number,
}

export type IDoctorList = IDoctorItem[]