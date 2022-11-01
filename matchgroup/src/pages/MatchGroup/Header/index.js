import { Space,Button } from 'antd';
import {
    FRAME_MESSAGE_TYPE,
    OP_TYPE,
    OPEN_LOCATION
} from '../../../utils/constant';

import './index.css';

export default function Header({sendMessageToParent}){
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

    return (
    <div className='header'>
        <div className="title">匹配分组详情</div>
        <div className='operation-bar'>
            <Space>
                <Button size='small' type='primary' onClick={onClose}>关闭</Button>
            </Space>
        </div>
    </div>
    );
}