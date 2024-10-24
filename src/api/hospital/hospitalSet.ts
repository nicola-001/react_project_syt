// 医院设置相关Api函数
import {request} from "@utils/http";
import {IHospitalSetResponse, IHospitalSetData} from "@api/hospital/model/hospitalSetTypes";
import React from "react";

// limit：当前页 limit：每页几条 hosname：医院名称 hoscode：医院编号
export const getHospitalList = (page: number, limit: number, hosname?: string, hoscode?: string) => {
    return request.get<any, IHospitalSetResponse>(`/admin/hosp/hospitalSet/${page}/${limit}`, {
        params: {
            hosname,
            hoscode
        }
    })
}

// 添加医院设置
export const addHospitalSet = (data: IHospitalSetData) => {
    return request.post<any, null>('/admin/hosp/hospitalSet/save', data)
}
//删除医院接口
export const deleteHospitalSetById = (id: string) => {
    return request.delete<any, null>(`/admin/hosp/hospitalSet/remove/${id}`)
}
//根据数组id列表批量删除
export const removeBatch = (ids: React.Key[]) => {
    return request.delete<any, null>('/admin/hosp/hospitalSet/batchRemove', {data: ids})
}
//根据id查询医院
export const getHospitalSetById = (id: string) => {
    return request.get<any, IHospitalSetData>('/admin/hosp/hospitalSet/get/' + id)
}
//修改医院设置
export const updateHospitalSet = (data: IHospitalSetData) => {
    return request.put('/admin/hosp/hospitalSet/update', data)
}