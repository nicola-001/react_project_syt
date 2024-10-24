import {Button, Card, Form, Input, message, Space} from "antd";
import {addHospitalSet, getHospitalSetById, updateHospitalSet} from "@api/hospital/hospitalSet";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";

const AddOrUpdate = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    // 获取表单数据
    const [form] = Form.useForm()
    const onFinish = async () => {
        let data = form.getFieldsValue();
        try {
            if (id) {
                data.id = id
                await updateHospitalSet(data)
                message.success('更新成功')
            } else {
                await addHospitalSet(data)
                message.success('添加成功！')
            }
            navigate('/syt/hospital/hospitalSet')
        } catch (error) {
            message.error('操作失败！')
        }
    }
    // 根据id获取医院接口
    const _getHospitalSetById = async () => {
        const data = await getHospitalSetById(id as string)
        form.setFieldsValue(data)
    }
    // 挂载时调用该函数
    useEffect(() => {
        //  id存在说明是编辑操作发送请求  不存在新增操作
        id && _getHospitalSetById()
    }, [])
    return (
        <>
            <Card>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 2}}
                    wrapperCol={{span: 22}}
                    onFinish={onFinish}

                >
                    <Form.Item
                        label="医院名称"
                        name="hosname"
                        rules={[{required: true, message: '请输入医院名称！'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="医院编号"
                        name="hoscode"
                        rules={[{required: true, message: '请输入医院编号!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="api基础路径"
                        name="apiUrl"
                        rules={[{required: true, message: '请输入api基础路径!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="联系人姓名"
                        name="contactsName"
                        rules={[{required: true, message: '请输入联系人姓名!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="联系人手机"
                        name="contactsPhone"
                        rules={[{required: true, message: '请输入联系人手机!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 2, span: 16}}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                            <Button onClick={() => {navigate(-1)}}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};
export default AddOrUpdate;
