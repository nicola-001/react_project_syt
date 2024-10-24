import {Button, Card, Form, Input, message, Modal, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, SearchOutlined} from '@ant-design/icons';
import {ColumnsType} from "antd/es/table";
import React, {useEffect, useState} from "react";
import {deleteHospitalSetById, getHospitalList, removeBatch} from "@api/hospital/hospitalSet";
import {IHospitalSetList} from "@api/hospital/model/hospitalSetTypes";
import {useNavigate} from "react-router-dom";

const HospitalSet = () => {
    const navigate = useNavigate();
    const {confirm} = Modal
    const columns: ColumnsType<any> = [
        {
            title: '序号',
            render(value: any, row: any, index: number) {
                return (current - 1) * pageSize + (index + 1)
            },
            align: "center",
            width: 80
        },
        {
            title: '医院名称',
            dataIndex: 'hosname',
            align: "center",
            width: 130
        },
        {
            title: '医院编号',
            dataIndex: 'hoscode',
            align: "center",
            width: 100
        },
        {
            title: 'api基础路径',
            dataIndex: 'apiUrl',
            align: "center",
            width: 100
        },
        {
            title: '签名',
            dataIndex: 'signKey',
            align: "center",
            width: 120
        },
        {
            title: '联系人姓名',
            dataIndex: 'contactsName',
            align: "center",
            width: 100
        },
        {
            title: '联系人手机',
            dataIndex: 'contactsPhone',
            align: "center",
            width: 100
        },
        {
            title: '操作',
            render(row: any) {
                return (
                    <Space>
                        <Button type='primary' icon={<EditOutlined/>}
                                onClick={() => navigate('/syt/hospital/hospitalSet/edit/' + row.id)}></Button>
                        <Button type='primary' danger icon={<DeleteOutlined/>}
                                onClick={() => deleteById(row.id)}></Button>
                    </Space>
                )
            },
            align: "center",
            fixed: 'right',
            width: 100
        },
    ]
    // 声明医院相关状态
    // 分页相关状态
    let [current, setCurrent] = useState<number>(1)
    let [pageSize, setPageSize] = useState<number>(3)
    let [total, setTotal] = useState<number>(10)
    // 医院设置列表
    let [hospitalSetList, setHospitalSetList] = useState<IHospitalSetList>([])
    let [hosname, setHosname] = useState<string>()
    let [hoscode, setHoscode] = useState<string>()
    let [loading, setLoading] = useState<boolean>(false)
    let [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [form] = Form.useForm()

    // 获取医院数据
    async function _getHospitalSetList() {
        setLoading(true)
        const {records, total} = await getHospitalList(current, pageSize, hosname, hoscode)
        // 设置状态
        setHospitalSetList(records)
        setTotal(total)
        setLoading(false)
    }

    // form表单的onFinish事件
    const search = () => {
        //     获取最新的hosname和hoscode
        let {hosname, hoscode} = form.getFieldsValue()
        setHosname(hosname)
        setHoscode(hoscode)
        // 检索从第一页开始查看
        current !== 1 && setCurrent(1)
    }

    const clear = () => {
        // 重置表单hosname和hoscode ==>界面
        form.resetFields()
        //重置状态hosname和hoscode==>重新发送请求获取数据
        setHosname(undefined)
        setHoscode(undefined)
        setCurrent(1)
    }
    // 删除按钮的回调
    const deleteById = (id: string) => {
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleFilled/>,
            content: '当前记录',
            async onOk() {
                await deleteHospitalSetById(id)
                //     消息提示
                message.success('删除成功！')
                //     刷新列表
                _getHospitalSetList()
            },
            onCancel() {
                message.info('取消删除')
            },
        });
    }
    // 批量删除按钮的回调
    const deleteByIds = () => {
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleFilled/>,
            content: '当前记录',
            async onOk() {
                await removeBatch(selectedKeys)
                // 将selectedKeys状态清空
                setSelectedKeys([])
                //     消息提示
                message.success('删除成功！')
                //     刷新列表
                _getHospitalSetList()
            },
            onCancel() {
                message.info('取消删除')
            },
        });
    }
    // 定义生命周期钩子  componentDidMount 挂载+current, pageSize, hosname, hoscode变化时
    useEffect(() => {
        _getHospitalSetList()
    }, [])
    // 页码发生变化时触发
    useEffect(() => {
        _getHospitalSetList()

    }, [current, pageSize, hosname, hoscode])
    return (
        <>
            <Card>
                {/*1.form*/}
                <Form
                    form={form}
                    layout='inline'
                    onFinish={search}
                >
                    <Form.Item name='hosname'>
                        <Input placeholder='医院名称'/>
                    </Form.Item>
                    <Form.Item name='hoscode'>
                        <Input placeholder='医院编号'/>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type='primary' icon={<SearchOutlined/>} htmlType='submit'>查询</Button>
                            <Button onClick={clear}
                                    disabled={hosname === undefined && hoscode === undefined}>清空</Button>
                        </Space>
                    </Form.Item>
                </Form>
                {/*2.button*/}
                <Space className='mt'>
                    <Button type='primary' onClick={() => navigate('/syt/hospital/hospitalSet/add')}>添加</Button>
                    <Button disabled={selectedKeys.length === 0} onClick={deleteByIds}>批量删除</Button>
                </Space>
                {/*3.table*/}
                <Table
                    loading={loading}
                    bordered
                    className='mt'
                    rowKey={'id'}
                    columns={columns}
                    dataSource={hospitalSetList}
                    scroll={
                        {x: 2000}
                    }
                    rowSelection={{
                        onChange: (selectedRowKeys: React.Key[]) => {
                            setSelectedKeys(selectedRowKeys)
                            console.log(selectedRowKeys)
                        }
                    }}
                    pagination={{
                        current,
                        pageSize,
                        total,
                        pageSizeOptions: [3, 5, 10, 20],
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onChange: (current: number, pageSize: number) => {
                            setCurrent(current)
                            setPageSize(pageSize)
                            // 发送请求，请求新的数据
                            // getHospitalList(current, pageSize, hosname, hoscode);
                        },

                    }}
                />
            </Card>

        </>
    );
};
export default HospitalSet;
