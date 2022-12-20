import { Table,Checkbox } from 'antd';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';

import './index.css';

export default function VirtualTable(props){
  const { columns, scroll,rowKey,rowSelection:{selectedRowKeys} } = props;
  //下面这段代码是对于没有设置宽度的列按照整体宽度的平均值设置一个列宽
  const [tableWidth, setTableWidth] = useState(0);
  const widthColumnCount = columns.filter(({ width }) => !width).length;
  const mergedColumns = columns.map((column) => {
    if (column.width) {
      return column;
    }
    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  //这里构造一个对象用于接收滚动条事件，滚动条滚动时调用table内部的Grid的滚动条事件
  const gridRef = useRef();
  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    return obj;
  });
  
  //当表格控件的宽度发生变化时刷新内部刷新
  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };
  useEffect(() => resetVirtualGrid, [tableWidth]);
  
  //Table的body使用自定义控件
  //这里没有考虑如何出发行的选择?
 
  
  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;
    //这里设置列的数量，在数据列上增加一个勾选列
    const columnCount=mergedColumns.length+1;

    //获取某个列宽的函数
    const getColumnWidth=(index)=>{
      //等于0的时候就是勾选列
      let width=0;  
      if(index===0){
        if(props.rowSelection){
          width=50;
        }
      } else {
        width=mergedColumns[index-1].width;
      }
      
      //这里时为了在计算最后一列的宽度时将纵向滚动条的宽度去掉
      return totalHeight > scroll.y && index === mergedColumns.length
        ? width - scrollbarSize - 1
        : width;
    }

    //勾选某个数据行
    const onSelectedRow=(row,selected)=>{
      const {selectedRowKeys,onChange}=props.rowSelection;
      let newSelectedRowKeys=[];
      if(selected===true){
        newSelectedRowKeys=[...selectedRowKeys,rawData[row][rowKey]];
      } else {
        newSelectedRowKeys=selectedRowKeys.filter(item=>item!==rawData[row][rowKey]);
      }
      onChange(newSelectedRowKeys);
    }

    const getColumnContent=({ columnIndex, rowIndex, style })=>{
      if(columnIndex===0){
        const isSelected=(selectedRowKeys?.find(item=>item===rawData[rowIndex][rowKey]))===rawData[rowIndex][rowKey];
        
        return (<div
          className={classNames('virtual-table-cell','ant-table-selection-col')}
          style={style}
        >
          <div style={{width:"50px"}}>
            <Checkbox checked={isSelected} style={{paddingLeft:"9px"}} onChange={(e)=>{onSelectedRow(rowIndex,e.target.checked)}} />
          </div>
        </div>);
      }

      const column=mergedColumns[columnIndex-1];
      let text=rawData[rowIndex][column.dataIndex];
      let cellControl=(
        <div
          className={classNames('virtual-table-cell','ant-table-cell-ellipsis', {
            'virtual-table-cell-last': columnIndex === mergedColumns.length,
          })}
          style={style}
          title={text}
        >
          {text}
        </div>
      );

      if(column.render){
        cellControl=
        <div
          className={classNames('virtual-table-cell','ant-table-cell-ellipsis', {
            'virtual-table-cell-last': columnIndex === mergedColumns.length,
          })}
          style={style}
        >
          {column.render(text)}
        </div> 
      }

      return cellControl;
    }

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={columnCount}
        columnWidth={getColumnWidth}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 24}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft,
          });
        }}
      >
        {getColumnContent}
      </Grid>
    );
  };

  //用于控制表格勾选框的显示
  const tableClass=props.rowSelection?"virtual-table-selectable":"virtual-table";

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        columns={mergedColumns}
        className={tableClass}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
}