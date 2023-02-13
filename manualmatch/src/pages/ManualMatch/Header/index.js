import { Space,Select,Input, Button,Checkbox } from 'antd';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetBatch, setCurrentBatch } from '../../../redux/batchSlice';

import {setCurrentCustomer,setMaterial,setWithReconCustomer} from '../../../redux/customerSlice';
import {resetData} from '../../../redux/dataSlice';
import {FRAME_MESSAGE_TYPE} from '../../../utils/constant';

import './index.css';

const {Option}=Select;
const { Search } = Input;

export default function Header({sendMessageToParent,deliveryData,billingData,selectedDelivery,selectedBilling}){
    const dispatch=useDispatch();
    const {list,current,withReconCustomer}=useSelector(state=>state.customer);
    const {list:batchList,current:batchCurrent}=useSelector(state=>state.batch);

    const hasReconCustomer=useMemo(()=>{
        const currentRow=list.filter(item=>item.id===current)[0];
        return currentRow?.recon_customer?.list?currentRow.recon_customer.list.length>0:false;
    },[list,current]);

    const optionControls=list.map((item,index)=>{
        return (<Option key={item.id} value={item.id}>{item.name}</Option>);
    });

    const batchOptions=batchList.map(item=>{
        return (<Option key={item.id} value={item.id}>{item.import_batch_number}</Option>);
    });
 
    const onCustomerChange=(value)=>{
        dispatch(setCurrentCustomer(value));
        dispatch(resetBatch());
    }

    const onSearch=(value)=>{
        console.log('onSearch',value);
        dispatch(setMaterial(value));
        dispatch(resetData());
    }

    const onBatchChange=(value)=>{
        dispatch(setCurrentBatch(value));
        dispatch(resetData());
    }

    const onChangeWithReconCustomer=(e)=>{
        dispatch(setWithReconCustomer(e.target.checked));
        dispatch(resetData());
    }

    const saveMatchGroup=()=>{
        const billingList=billingData.list
        .filter(billingRow=>selectedBilling.find(id=>id===billingRow.id))
        
        const billings={
            modelID:"dr_billing_recon",
            list:billingList
        }

        const deliveryList=deliveryData.list
        .filter(deliveryRow=>selectedDelivery.find(id=>id===deliveryRow.id))
        
        const deliverys={
            //fieldType:"one2many",
            modelID:"dr_delivery_recon",
            //relatedField:"match_group",
            list:deliveryList
        }

        const matchgroup={
            modelID:'dr_delivery_billing_recon_group',
            list:[
                {
                    billings:billings,
                    deliverys:deliverys,
                    _save_type:'create'
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
                        flowID:"manual_create_match_group",
                        ...matchgroup
                    },
                    description:"保存对账匹配结果",
                    successOperation:{
                        type:"reloadFrameData",
                        params:{
                            location:"tab",
                            key:"/delivery_recon/manualmatch"
                        },
                        description:"刷新页面数据"
                    }
                }
            }
        };

        sendMessageToParent(message);
    }

    const refreshData=()=>{
        dispatch(resetData());
    }

    return (
    <div className='header'>
        <div className='operation-bar'>
            <Space>
                <div className="title">购方机构:</div>
                <Select
                    style={{width:'200px'}}  
                    showSearch
                    value={current}
                    size='small'
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={onCustomerChange}
                >
                {optionControls}
                </Select>
                <div className="title">对账批次:</div>
                <Select
                    style={{width:'200px'}}  
                    showSearch
                    value={batchCurrent}
                    size='small'
                    filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={onBatchChange}
                >
                {batchOptions}
                </Select>
                <div className="title">物料号:</div>
                <Search size='small' onSearch={onSearch}/>
                {hasReconCustomer?<Checkbox checked={withReconCustomer} onChange={onChangeWithReconCustomer}>包含关联客户Billing</Checkbox>:null}
                <Button type='primary' size='small' onClick={saveMatchGroup}>确认</Button>
                <Button type='primary' size='small' onClick={refreshData}>刷新</Button>
            </Space>
        </div>
    </div>
    );
}