import {Button, Card, Col, Pagination, Row, Table, Tag, Tree, TreeDataNode} from "antd";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {useNavigate, useParams} from "react-router-dom";
import {getDepartmentList, getDoctorList, getScheduleList} from "@api/hospital/hospitalList";
import {IBookingScheduleList, IDepartmentList, IDoctorList} from "@api/hospital/model/hospitalListTypes";

const HospitalSchedule = () => {
    // 定义左侧heignt属性
    const heignt = document.documentElement.clientHeight - 220
    const navigate = useNavigate();
    // 定义table表头
    const columns: ColumnsType<any> = [
        {
            title: '序号',
            align: 'center',
            render(value:any,row:any,index:number){
                return (index+1)
            }
        },
        {
            title: '职称',
            align: 'center',
            dataIndex: 'title',
        },
        {
            title: '号源时间',
            align: 'center',
            dataIndex:'workDate'
        },

        {
            title: '总数预约',
            align: 'center',
            dataIndex: 'reservedNumber'
        },
        {
            title: '剩余预约数',
            align: 'center',
            dataIndex: 'availableNumber'
        },
        {
            title: '挂号费（元）',
            align: 'center',
            dataIndex:'amount'
        },
        {
            title: '擅长技能',
            align: 'center',
            dataIndex:'skill'
        },
    ]
    // 获取路由中携带的id
    const {hoscode} = useParams()
    // 设置状态
    const [departmentList, setDepartmentList] = useState<IDepartmentList>([]);
    const [expandedKey, setExpandedKey] = useState<string[]>([]);
    const [depname, setDepname] = useState<string>();
    const [depcode, setDepcode] = useState<string>();
    // 分页状态定义
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(3);
    const [total, setTotal] = useState<number>(10)
    const [bookingScheduleList, setBookingScheduleList] = useState<IBookingScheduleList>([])
    const [hosname, setHosname] = useState<string>()
    const [workDate, setWorkDate] = useState<string>()
    const [doctorList, setDoctorList] = useState<IDoctorList>([])
    // 获取医院科室列表的数据
    const _getDepartmentList = async () => {
        const departList = await getDepartmentList(hoscode as string)
        // 禁用一级科室树节点===>给所有的以及可视对象添加disabled属性
        departList.map((item: any) => {
            item.disabled = true
            return item
        })
        // 展开所有一级科室
        // 获取所有医技科室 depcode组成的数组
        let expandedKey = departList.map((item: any) => item.depcode)
        setExpandedKey(expandedKey)
        setDepartmentList(departList)//设置科室列表状态
        // 处理默认选中科室状态
        let depname = (departList[0].children as IDepartmentList)[0].depname
        let depcode = (departList[0].children as IDepartmentList)[0].depcode
        setDepcode(depcode)
        setDepname(depname)
    }
    // 映射列表数据
    const fieldNames = {
        title: 'depname', key: 'depcode',
    }
    // 获取医院科室排班日期数据的请求
    const _getScheduleList = async () => {
        const {
            baseMap: {hosname},
            total,
            bookingScheduleList
        } = await getScheduleList(current, pageSize, hoscode as string, depcode as string)
        //     设置状态
        setTotal(total)
        setBookingScheduleList(bookingScheduleList)
        setHosname(hosname)
        setWorkDate(bookingScheduleList[0].workDate)
    }
    const _getDoctorList = async () => {
        let doctorList = await getDoctorList(hoscode as string, depcode as string, workDate as string)
        setDoctorList(doctorList)
    }
    // 组件挂载时
    useEffect(() => {
        // 获取科室数据
        {
            hoscode && _getDepartmentList()
        }
    }, [])
    useEffect(() => {
        {
            depcode && _getScheduleList()
        }
    }, [depcode, current, pageSize]);
    useEffect(() => {
        workDate && _getDoctorList()
    }, [workDate]);
    return (
        <>
            <Card>
                <div>选择: {hosname} / {depname} / {workDate}</div>
                <Row gutter={30} className='mt'>
                    <Col span={6}>
                        <div style={{border: '1px solid #ccc', height: heignt, overflowY: "scroll"}}>
                            <Tree
                                treeData={departmentList as []}
                                fieldNames={fieldNames}
                                expandedKeys={expandedKey}
                                selectedKeys={[depcode as string]}
                                onSelect={(selectKey, info: any) => {
                                    //     重新设置选择的科室
                                    setDepname(info.node.depname)
                                    setDepcode(info.node.depcode)
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={18}>
                        {bookingScheduleList.map((item) => (
                            <Tag color={workDate === item.workDate ? 'green' : ''}
                                 key={item.dayOfWeek}
                                 onClick={() => setWorkDate(item.workDate as string)}
                            >
                                <div>{item.workDate} {item.dayOfWeek}</div>
                                <div>{item.availableNumber}/{item.reservedNumber}</div>
                            </Tag>
                        ))}
                        <Pagination
                            current={current}
                            pageSize={pageSize}
                            total={total}
                            className='mt'
                            onChange={(page: number, pageSize: number) => {
                                setCurrent(page)
                                setPageSize(pageSize)
                            }}
                        />
                        <Table
                           rowKey={'id'}
                            className='mt'
                            columns={columns}
                            dataSource={doctorList}
                        />
                        <Button className='mt' onClick={()=>navigate(-1)}>返回</Button>
                    </Col>
                </Row>
            </Card>
        </>
    );
};
export default HospitalSchedule;