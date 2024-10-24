import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {getDistrict} from "@api/hospital/hospitalList";
import React, {useEffect, useState} from "react";
import {IDistrictList} from "@api/hospital/model/hospitalListTypes";
import {DownOutlined, RightOutlined} from "@ant-design/icons";

const Dict = () => {
    const colums: ColumnsType<any> = [
        {
            title: '名称',
            dataIndex: 'name'

        },
        {
            title: '编码',
            dataIndex: 'dictCode',

        },
        {
            title: '值',
            dataIndex: 'value',

        },
        {
            title: '创建时间',
            dataIndex: 'createTime',

        },
    ]
    const [dicList, setDicList] = useState<IDistrictList>([]);
    const _getDictList = async () => {
        let res = await getDistrict(1)
        setDicList(res)
    }
    useEffect(() => {
        _getDictList()
    }, []);
    return (
        <>
            <Card>
                <Table
                    rowKey={'id'}
                    columns={colums}
                    pagination={false}
                    dataSource={dicList}
                    expandable={{
                        expandIcon: ({expanded, onExpand, record}) => {
                            if (!record.hasChildren) {
                                return <div style={{display:'inline-block',width:15}}></div>
                            }
                            // expanded是否展开  onExpand：展开函数  record：当前行对象
                            return expanded ? (
                                <DownOutlined onClick={e => onExpand(record, e)}/>
                            ) : (
                                <RightOutlined onClick={async e => {
                                    // 根据当前id获取子节点数据
                                    if (!record.children?.length) {//添加一个判断  减少发送请求次数
                                        const children = await getDistrict(record.id);
                                        record.children = children
                                    }
                                    onExpand(record, e)
                                }
                                }/>
                            )
                        }

                    }}
                />
            </Card>
        </>
    );
};
export default Dict;