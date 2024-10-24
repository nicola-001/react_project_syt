import {Button, Card, Form, Input, Select, Space, Table, Image} from "antd";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {changeStatus, getDistrict, getHospitalList} from "@api/hospital/hospitalList";
import {
    IDistrictList,
    IHospitalItem,
    IHospitalList,
    IHospitalSearchParams
} from "@api/hospital/model/hospitalListTypes";
import {useNavigate} from "react-router-dom";


const HospitalList = () => {
    // 从antd中引入Option
    const {Option} = Select;
    const navigate = useNavigate();
    // 存储省份信息
    let [provinceList, setProvinceList] = useState<IDistrictList>([]);
    let [cityList, setCityList] = useState<IDistrictList>([]);
    let [districtList, setDistrictList] = useState<IDistrictList>([]);
    let [typeList, setTypeList] = useState<IDistrictList>([]);
    // 医院列表分页数据
    let [current, setCurrent] = useState<number>(1);
    let [pageSize, setPageSize] = useState<number>(3);
    let [total, setTotal] = useState<number>(10);
    let [hospitalList, setHospitalList] = useState<IHospitalList>([]);
    let [loding, setLoding] = useState<boolean>(false);
    const columns: ColumnsType<IHospitalItem> = [
        {
            title: '序号',
            align: 'center',
            render(value: any, row: any, index: number) {
                return (current - 1) * pageSize + (index + 1)
            }
        },
        {
            title: '医院Logo',
            align: 'center',
            render(row: IHospitalItem) {
                return (
                    <Image width={100} src={'data:image/jpg;base64,' + row.logoData}/>
                )
            }
        },
        {
            title: '医院名称',
            align: 'center',
            dataIndex: 'hosname'
        },
        {
            title: '等级',
            align: 'center',
            render(row: IHospitalItem) {
                return row.param.hostypeString
            }
        },
        {
            title: '详细地址',
            align: 'center',
            render(row: IHospitalItem) {
                return row.param.fullAddress
            }
        },
        {
            title: '状态',
            align: 'center',
            render(row: IHospitalItem) {
                return row.status ? '已上线' : '未上线'
            }
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
        },
        {
            align: 'center',
            title: '操作',
            render(row: IHospitalItem) {
                return (
                    <Space>
                        <Button type='primary'
                                onClick={() => navigate('/syt/hospital/hospitalList/show/' + row.id)}>查看</Button>
                        <Button type='primary'
                                onClick={() => navigate(`/syt/hospital/HospitalSchedule/show/` + row.hoscode)}>排班</Button>
                        <Button type='primary'
                                onClick={() => changeStatusHandler(row.id, row.status ? 0 : 1)}>{row.status ? '下线' : '上线'}</Button>
                    </Space>
                )
            }
        },
    ]
    const [form] = Form.useForm()
    // 将搜索的属性封装为一个对象
    const [formFields, setFormFields] = useState<IHospitalSearchParams>({
        hoscode: undefined,
        hosname: undefined,
        hostype: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        districtCode: undefined,
        status: undefined
    })
    // 获取省份列表
    const getProvinceList = async () => {
        const res = await getDistrict(86)
        setProvinceList(res)
    }
    // 根据省份id获取市列表并渲染
    const getCityList = async (id: number) => {
        // 清空数据
        //     将市和区的表单项赋值为undefined
        form.setFieldsValue({
            cityCode: undefined,
            districtCode: undefined
        })
        // 将区的状态设置为空数组
        setDistrictList([])

        const cityList = await getDistrict(id)
        setCityList(cityList)
    }
    // 根据市id获取区列表并渲染
    const getDictList = async (id: number) => {
        let res = await getDistrict(id)
        setDistrictList(res)
        form.setFieldsValue({
            districtCode: undefined,
        })
    }
    // 获取省市区
    const getTypes = async () => {
        let types = await getDistrict(10000)
        setTypeList(types)
    }
    const _getHospitalList = async () => {
        setLoding(true)
        let {content, totalElements} = await getHospitalList({page: current, limit: pageSize, ...formFields})
        setLoding(false)
        setHospitalList(content)
        setTotal(totalElements)
    }
    // 组件挂载时
    useEffect(() => {
        getProvinceList()
        getTypes()
    }, [])
    // 通过hook函数进行监听获取最新数据  ***注意：useEffect不能做深度监听***
    useEffect(() => {
        _getHospitalList()
    }, [current, pageSize, formFields.cityCode, formFields.districtCode, formFields.provinceCode, formFields.hoscode, formFields.hosname, formFields.status, formFields.hostype])
    const search = () => {
        setFormFields(form.getFieldsValue()) //获取表单最新的值设置到getFieldsValue中
        setCurrent(1)
    }
    //控制清空按钮是否禁用
    // ****获取到对象中的7个value值 将其变成一个数组，再用数组方法判断是否有不是undefined（every）
    const isDisabled = () => {
        return Object.values(formFields).every(item => item === undefined) //数组中的每一项都为undefined 返回true 否则返回 false
    }
    // 清空
    const clear = () => {
        // 清空表单数据
        form.resetFields()
        // 每一项设置成undefined
        setFormFields({
            hoscode: undefined,
            hosname: undefined,
            hostype: undefined,
            provinceCode: undefined,
            cityCode: undefined,
            districtCode: undefined,
            status: undefined
        })
        // 设置当前页为1
        setCurrent(1)
    }
    // 切换医院状态
    const changeStatusHandler = async (id: string, status: number) => {
        await changeStatus(id, status)
        //     重新获取数据
        _getHospitalList()
    }
    return (
        <>
            <Card>
                {/*form组件*/}
                <Form
                    layout="inline"
                    form={form}
                    onFinish={search}
                >
                    <Form.Item name='provinceCode'>
                        <Select
                            placeholder="请选择省份"
                            allowClear
                            style={{width: 180}}
                            className='mb'
                            onSelect={getCityList}
                        >
                            {provinceList.map((province: any) => (
                                <Option value={province.value} key={province.id}>{province.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name='cityCode'>
                        <Select
                            placeholder="请选择市"
                            onSelect={getDictList}
                            allowClear style={{width: 180}}>
                            {cityList.map((city: any) => (
                                <Option value={city.value} key={city.id}>{city.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name='districtCode'>
                        <Select placeholder="请选择区域" allowClear style={{width: 180}}>
                            {districtList.map((district: any) => (
                                <Option value={district.value} key={district.id}>{district.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder='医院名称' name='hosname'></Input>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder='医院编号' name='hoscode'></Input>
                    </Form.Item>
                    <Form.Item name='hostype'>
                        <Select placeholder="医院类型" allowClear style={{width: 180}}>
                            {typeList.map((type: any) => (
                                <Option value={type.value} key={type.id}>{type.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name='status'>
                        <Select placeholder="医院状态" allowClear style={{width: 180}}>
                            <Option value={0}>未上线</Option>
                            <Option value={1}>已上线</Option>
                        </Select>
                    </Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit'>查询</Button>
                        <Button disabled={Object.values(formFields).every(item => item == undefined)}
                                onClick={clear}>清空</Button>
                    </Space>
                </Form>
                {/*table组件*/}
                <Table
                    loading={loding}
                    size={"small"}
                    bordered
                    className='mt'
                    columns={columns}
                    rowKey={'id'}
                    dataSource={hospitalList}
                    pagination={{
                        current,
                        pageSize,
                        total,
                        onChange(page: number, pageSize: number) {
                            setCurrent(page)
                            setPageSize(pageSize)
                        }

                    }}
                />
            </Card>
        </>
    );
};
export default HospitalList;
