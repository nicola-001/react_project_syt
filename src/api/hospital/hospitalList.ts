import {request} from "@utils/http";
import {
    IDistrictList, IDoctorList,
    IHospitalDetail,
    IHospitalListResponse,
    IHospitalSetListParams, IScheduleResponse
} from "@api/hospital/model/hospitalListTypes";

export const getDistrict = (id: number) => {
    return request.get<any, IDistrictList>('/admin/cmn/dict/findByParentId/' + id)
}
export const getHospitalList = ({
                                    page,
                                    limit,
                                    hoscode,
                                    hosname,
                                    hostype,
                                    provinceCode,
                                    cityCode,
                                    districtCode,
                                    status
                                }: IHospitalSetListParams) => {
    return request.get<any, IHospitalListResponse>(`/admin/hosp/hospital/${page}/${limit}`, {
        params: {
            hoscode,
            hosname,
            hostype,
            provinceCode,
            cityCode,
            districtCode,
            status
        }
    })
}
// 获取获取医院详情数据
export const getHospitalDetail = (id: string) => {
    return request.get<any, IHospitalDetail>(`/admin/hosp/hospital/show/${id}`)
}
//切换医院状态接口
export const changeStatus = (id: string, status: number) => {
    return request.get<any, null>(`/admin/hosp/hospital/updateStatus/${id}/${status}`)
}
//获取医院科室列表
export const getDepartmentList = (hoscode: string) => {
    return request.get<any, any>(`/admin/hosp/department/${hoscode}`)
}
//获取排班规则数据
export const getScheduleList = (page: number, limit: number, hoscode: string, depcode: string) => {
    return request.get<any,IScheduleResponse>(`/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`)
}
//排班医生列表
export const getDoctorList=(hoscode:string,depcode:string,workDate:string) => {
    return request.get<any,IDoctorList>(`/admin/hosp/schedule/findScheduleList/${hoscode}/${depcode}/${workDate}`)
}