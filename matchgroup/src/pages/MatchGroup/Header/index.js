import { Space,Button } from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import {
    FRAME_MESSAGE_TYPE,
    OP_TYPE,
    OPEN_LOCATION
} from '../../../utils/constant';
import {refreshData} from '../../../redux/dataSlice';

import './index.css';

export default function Header({sendMessageToParent}){
    const dispatch=useDispatch();
    const {deletedBilling,addedBilling,list}=useSelector(state=>state.data);

    const onClose=()=>{
        const message={
            type:FRAME_MESSAGE_TYPE.DO_OPERATION,
            data:{
                operationItem:{
                    type:OP_TYPE.CLOSE,
                    params:{
                        location:OPEN_LOCATION.MODAL
                    },
                }
            }
        };
        sendMessageToParent(message);
    }

    const onSave=()=>{
        const deleteList=deletedBilling.map(billingRow=>{
            return {
                id:billingRow.id,
                version:billingRow.version,
                match_group:null,
                match_status:'3',
                _save_type:'update'
            };
        });
        const addList=addedBilling.map(billingRow=>{
            return {
                id:billingRow.id,
                version:billingRow.version,
                match_group:list[0].id,
                match_status:'1',
                _save_type:'update'
            };
        });
        const billings={
            fieldType:"one2many",
            modelID:"dr_billing_recon",
            relatedField:"match_group",
            list:[...deleteList,...addList]
        }

        const matchgroup={
            modelID:'dr_delivery_billing_recon_group',
            list:[
                {
                    id:list[0].id,
                    version:list[0].version,
                    billings:billings,
                    _save_type:'update'
                }
            ]
        }

        const message={
            type:FRAME_MESSAGE_TYPE.DO_OPERATION,
            data:{
                operationItem:{
                    id:"saveMatchGroup",
                    name:"保存对账匹配结果",
                    type:"request",
                    params:{
                        url:"/redirect",
                        method:"post"
                    },
                    input:{
                        to:"processingFlow",
                        flowID:"save_match_group",
                        ...matchgroup
                    },
                    description:"保存对账匹配结果",
                    successOperation:{
                        type:"reloadFrameData",
                        params:{
                            location:"modal",
                            key:"/delivery_recon/matchgroup"
                        },
                        description:"刷新页面数据"
                    }
                }
            }
        };
        sendMessageToParent(message);
    }

    const onRefresh=()=>{
        dispatch(refreshData());
    }

    return (
    <div className='header'>
        <div className="title">匹配分组详情</div>
        <div className='operation-bar'>
            <Space>
                <Button disabled={deletedBilling.length===0&&addedBilling.length===0} size='small' type='primary' onClick={onSave}>保存</Button>
                <Button size='small' type='primary' onClick={onRefresh}>刷新</Button>
                <Button size='small' type='primary' onClick={onClose}>关闭</Button>
            </Space>
        </div>
    </div>
    );
}