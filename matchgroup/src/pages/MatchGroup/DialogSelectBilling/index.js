import { Modal,Button } from 'antd';
import { useState } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import moment from 'moment';
import {setShowSelectBilling,setDeletedBilling,setAddedBilling} from '../../../redux/dataSlice';
import VirtualTable from '../../../components/VirtualTable';

import './index.css';

export default function DialogSelectBilling(){
  const {deletedBilling,addedBilling}=useSelector(state=>state.data);
  const {list}=useSelector(state=>state.billing);
  const dispatch=useDispatch();
  const [selectedBilling,setSelectedBilling]=useState([]);

  const handleOk=()=>{
    //添加billing到已经选择的billing列表
    let newDeletedBilling=[...deletedBilling];
    let newAddedBilling=[...addedBilling];
    selectedBilling.forEach(billingID=>{
      const billingRow=list.find(billingRow=>billingRow.id===billingID);
      if(billingRow){
        newAddedBilling.push(billingRow);
      } else {
        //如果添加的是之前删除的，则从删除的billing中去掉
        newDeletedBilling=newDeletedBilling.filter(billingRow=>billingRow.id!==billingID);
      }
    });

    if(newDeletedBilling.length!==deletedBilling.length){
      dispatch(setDeletedBilling(newDeletedBilling));
    }
    if(newAddedBilling.length!==addedBilling.length){
      dispatch(setAddedBilling(newAddedBilling));
    }
    dispatch(setShowSelectBilling(false));
  }

  const handleCancel=()=>{
    dispatch(setShowSelectBilling(false));
  }

  const groupBillingColumns=[
    {
        title: '客户物料号',
        dataIndex: 'customer_material_number',
        key: 'customer_material_number',
        ellipsis: true,
        width:200
    },
    {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
        width:150,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width:150,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '物料号',
        dataIndex: 'material',
        key: 'material',
        ellipsis: true,
        width:150
    },
    {
        title: 'Billing Date',
        dataIndex: 'billing_date',
        key: 'billing_date',
        width:130,
        render:(text)=>{
            const value=moment(text).format("YYYY-MM-DD");
            return <div >{value}</div>;
        }
    },
    {
        title: 'Billing Document',
        dataIndex: 'billing_document',
        key: 'billing_document',
        width:230,
        render:(text)=>{
            return <div >{text}</div>;
        }
    },
    {
        title: 'Sales Document Type',
        dataIndex: 'sales_document_type',
        key: 'sales_document_type',
        width:260,
        render:(text)=>{
            return <div>{text}</div>;
        }
    },
    {
        title: '账期',
        dataIndex: 'period',
        key: 'period',
        width:100,
        render:(text)=>{
            return <div>{text}</div>;
        }
    },
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width:150
    }
  ];

  const onSelectBillingChange=selectedRowKeys => {
    setSelectedBilling(selectedRowKeys);
  };

  const rowSelectionBilling = {
    selectedRowKeys:selectedBilling,
    onChange: onSelectBillingChange,
  };

  const onBillingRow=(record, index)=>{
    const billingRow=deletedBilling.find(billingRow=>billingRow.id===record.id);
    if(billingRow){
        return ({
            style:{backgroundColor:'yellow'}
        });
    }
    return ({
        style:{backgroundColor:'white'}
    });
}

  //减去已经增加的billing,合并删除的billing
  const dataSource=[...(list.filter(billingRow=>addedBilling.find(added=>added.id===billingRow.id)?false:true)),...deletedBilling];
  console.log('dataSource',dataSource);
  const totalCount=dataSource.length;
  let totalQuantity=0;
  let totalAmount=0;
  const selectedCount=selectedBilling.length;
  let selectedQuantity=0;
  let selectedAmount=0;
  dataSource.forEach(element => {
    totalQuantity+=parseFloat(element.quantity);
    totalAmount+=parseFloat(element.amount);
    if(selectedBilling.find(rowid=>rowid===element.id)){
      selectedQuantity+=parseFloat(element.quantity);
      selectedAmount+=parseFloat(element.amount);
    }
  });

  const selectedQuantityStr=(selectedQuantity.toFixed(0)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const selectedAmountStr=(selectedAmount.toFixed(2)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const totalQuantityStr=(totalQuantity.toFixed(0)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const totalAmountStr=(totalAmount.toFixed(2)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const statusStr=`已选择:${selectedCount}条，数量:${selectedQuantityStr}，金额:${selectedAmountStr}；总计:${totalCount}条，数量:${totalQuantityStr}，金额:${totalAmountStr}`;

  const modalFooter=[
    <div style={{float:'left',width:'calc(100% - 200px)',textAlign:'left'}}>{statusStr}</div>,
    <Button size='small' type="primary" style={{width:80}} onClick={handleOk}>Ok</Button>,
    <Button size='small' type="primary" style={{width:80}} onClick={handleCancel}>Cancel</Button>,
  ]

  const scrolly=300;

  return (
    <Modal width={'80%'} size="small" title="Select Billing" onCancel={handleCancel} open={true} footer={modalFooter}>
        <VirtualTable
            columns={groupBillingColumns}
            dataSource={dataSource}
            pagination={false}
            rowSelection={rowSelectionBilling}
            scroll={{y: scrolly,}}
            rowKey='id'
            size='small'
            bordered
            onRow={onBillingRow}
        />
    </Modal>
  );
}