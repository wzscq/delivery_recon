import { Space,Button,Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import {setCurrentCustomer} from '../../../redux/customerSlice';
import {refreshData} from '../../../redux/dataSlice';

import './index.css';

const {Option}=Select;

export default function Header(){
    const dispatch=useDispatch();
    const {list,current}=useSelector(state=>state.customer);
    const optionControls=list.map((item,index)=>{
        return (<Option key={item.id} value={item.id}>{item.name}</Option>);
    });

    console.log('header current',current);
    
    const onCustomerChange=(value)=>{
        dispatch(setCurrentCustomer(value));
        dispatch(refreshData());
    }

    return (
    <div className='header'>
        <div className="title">销方机构:</div>
        <div className='operation-bar'>
            <Space>
                <Select
                    style={{width:'300px'}}  
                    allowClear
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
                    style={{width:'300px'}}  
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
                <Button size='small' type='primary' onClick={()=>{dispatch(refreshData())}}>刷新</Button>
            </Space>
        </div>
    </div>
    );
}