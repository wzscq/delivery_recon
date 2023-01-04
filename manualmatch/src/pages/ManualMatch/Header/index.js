import { Space,Select,Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { resetBatch, setCurrentBatch } from '../../../redux/batchSlice';

import {setCurrentCustomer,setMaterial} from '../../../redux/customerSlice';
import {resetData} from '../../../redux/dataSlice';

import './index.css';

const {Option}=Select;
const { Search } = Input;

export default function Header(){
    const dispatch=useDispatch();
    const {list,current}=useSelector(state=>state.customer);
    const {list:batchList,current:batchCurrent}=useSelector(state=>state.batch);
    
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

    return (
    <div className='header'>
        <div className='operation-bar'>
            <Space>
                <div className="title">购方机构:</div>
                <Select
                    style={{width:'200px'}}  
                    allowClear
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
                    allowClear
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
                <Button type='primary' size='small'>确认</Button>
            </Space>
        </div>
    </div>
    );
}