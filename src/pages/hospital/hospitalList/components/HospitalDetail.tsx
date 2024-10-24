import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Image} from 'antd';
import {getHospitalDetail} from "@api/hospital/hospitalList";
import {useNavigate, useParams} from "react-router-dom";
import {IBookingRule, IHospitalItem} from "@api/hospital/model/hospitalListTypes";

const HospitalDetail = () => {
    // 获取上页传递过来的id
    const {id} = useParams();
    // 编程式导航践行路由跳转
    let navigate = useNavigate();
    // 存储的状态
    const [bookingRule, setBookingRule] = useState<IBookingRule>();
    const [hospital, setHospital] = useState<IHospitalItem>();
    const _getHospitalDetail = async () => {
        const {bookingRule, hospital} = await getHospitalDetail(id as string)
        setHospital(hospital)
        setBookingRule(bookingRule)
        console.log(bookingRule)
    }
    //组件挂载时
    useEffect(() => {
        _getHospitalDetail()
    }, [])

    return (
        <>
            <Card>
                <Descriptions title="基本信息" bordered>
                    <Descriptions.Item label="医院名称" span={1.5}>{hospital?.hosname}</Descriptions.Item>
                    <Descriptions.Item label="医院Logo" span={1.5}>
                        {hospital?.logoData && <Image width={100} src={`data:image/png;base64,` + hospital?.logoData}/>}
                    </Descriptions.Item>
                    <Descriptions.Item label="医院编码" span={1.5}>{hospital?.hoscode}</Descriptions.Item>
                    <Descriptions.Item label="医院地址" span={1.5}>{hospital?.param.fullAddress}</Descriptions.Item>
                    <Descriptions.Item label="坐车路线" span={3}>{hospital?.route}</Descriptions.Item>
                    <Descriptions.Item label="医院简介" span={3}>{hospital?.intro}</Descriptions.Item>
                </Descriptions>
                <Descriptions className='mt' title="预约规则" bordered>
                    <Descriptions.Item label="预约周期" span={1.5}>{bookingRule?.cycle}</Descriptions.Item>
                    <Descriptions.Item label="放号时间" span={1.5}>{bookingRule?.releaseTime}</Descriptions.Item>
                    <Descriptions.Item label="停挂时间" span={1.5}>{bookingRule?.stopTime}</Descriptions.Item>
                    <Descriptions.Item label="退号时间" span={1.5}>{bookingRule?.quitTime}</Descriptions.Item>
                    <Descriptions.Item label="预约规则" span={3}>{
                        bookingRule?.rule.map((item: any, index: number) => {
                            return <div key={index} className='mt'>{item}</div>
                        })
                    }</Descriptions.Item>
                </Descriptions>
                <Button className='mt' onClick={()=>navigate('/syt/hospital/hospitalList')}>返回</Button>
            </Card>
        </>
    );
};
export default HospitalDetail;
