import { Space,Button,Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { resetBatch, setCurrentBatch } from '../../../redux/batchSlice';

import {setCurrentCustomer} from '../../../redux/customerSlice';
import {refreshData} from '../../../redux/dataSlice';

import './index.css';

const {Option}=Select;

export default function Header(){
    const dispatch=useDispatch();
    const {list,current}=useSelector(state=>state.customer);
    const {list:batchList,current:batchCurrent}=useSelector(state=>state.batch);
    const optionControls=list.map((item,index)=>{
        return (<Option key={item.id} value={item.id}>{item.name}</Option>);
    });

    const batchControls=batchList.map(item=>{
        return (<Option key={item.id} value={item.id}>{item.import_batch_number}</Option>);
    });

    console.log('header current',current);
    
    const onCustomerChange=(value)=>{
        dispatch(setCurrentCustomer(value));
        dispatch(resetBatch());
        //dispatch(refreshData());
    }

    const onBatchChange=(value)=>{
        dispatch(setCurrentBatch(value));
        dispatch(refreshData());
    }

    return (
    <div className='header'>
        <div className="title">销方机构:</div>
        <div className='operation-bar'>
            <Space>
                <Select
                    style={{width:'200px'}}  
                    showSearch
                    size='small'
                    disabled={true}
                >
                </Select>
            </Space>
        </div>
        <div className="title">购方机构:</div>
        <div className='operation-bar'>
            <Space>
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
            </Space>
        </div>
        <div className="title">对账批次:</div>
        <div className='operation-bar'>
            <Space>
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
                {batchControls}
                </Select>
                <Button size='small' type='primary' onClick={()=>{dispatch(refreshData())}}>刷新</Button>
            </Space>
        </div>
    </div>
    );
}