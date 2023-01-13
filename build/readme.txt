2022-12-03 日增加一个定制的统计页面
1、表dr_delivery_billing_recon_group增加三个字段：
    period
    delivery_count
    billing_count
2、增加视图dr_view_match_result用于统计数据
3、增加和新增视图相应的模型配置
4、增加新的定制页面matchresult
5、菜单配置中增加打开新定制页面的菜单项
6、修改crvframe中listview的打开逻辑，当相同key的页面已经打开时，则发送更新当前视图的参数给子窗口
7、增加matchresult页面的编译发布脚本
8、需要修改匹配流程，增加对新增数据的统计功能

2022-12-12 增加控制台页面
1、增加数据库视图
    dr_view_match_result_v2   统计匹配后汇总数据
    dr_view_for_match         统计待匹配的数据
2、模型配置增加和视图对应的2个配置。
3、新增定制控制台前端页面dr_console
4、增加了一个delivery_statement的导入表单配置
5、菜单配置中增加对应的定制页面菜单
6、新增人工比对页面 
7、两个新增页面的编译脚本

2022-12-13 增加多客户数据导入  (暂时不更新)
1、增加了数据导入的处理节点 需要更新流程项目
2、上传新的导入处理流程

2022-12-15 应对差异调整的修改
1、匹配分组中增加期间字段的展示和统计
    a、修改了匹配处理流程delivery_billing_recon
    b、修改了模型的配置dr_delivery_billing_recon_group
2、需改了CDN导出中数据导出的逻辑，增加了由于数量差异调整的对应金额差异部分

2022-12-16 一些细节更新
1、修改了待处理比对视图的取数逻辑，确保所有公司数据都能查到  
    dr_view_for_match         统计待匹配的数据
2、修改了dr_console页面查询取数的逻辑
3、listview页面跳转逻辑中增加一个参数，允许跳转页面时附带一个过滤条件
    修改了listview
    修改了mainframe
4、人工比对页面允许传入默认的公司作为参数
5、人工比对页面速度优化   ?

2022-12-19 比对规则细节更新
1、修改了billing的预处理规则 dr_billing_preprocessing_for_chery
    a、允许ZV60参与匹配
    b、增加了ZV37的数量和金额取负数的处理
2、新增匹配处理规则：delivery_billing_recon_v2
    a、允许对账单零件数大于billing中的零件数
    b、不区分订单4和5开头
3、对账匹配调用的流改为：delivery_billing_recon_v2
4、新增调差处理规则：delivery_billing_recon_adjust_v2
    a、ZV70差异调整
5、匹配调差调用的流改为:delivery_billing_recon_adjust_v2
6、CDN导出逻辑更新，支持ZV70导出

2022-12-19 增加批次号功能
1、增加视图dr_view_customer_import
    增加视图模型配置，在数据库中创建对应视图
2、对批次号的生成逻辑做对应修改
3、dr_delivery_statement和dr_billing表增加sheet_name字段
4、dr_delivery_statement配置修改，增加控制台调用的导入表单formControlImportFlow
5、dr_billing配置修改，增加控制台调用的导入表单formControlESI
6、dr_delivery_recon表增加字段import_batch_number、delivery_date
7、dr_delivery_billing_recon_group表增加字段import_batch_number
8、修改视图dr_view_for_match、dr_view_match_result_v2
9、修改dr_delivery_statement预处理逻辑，增加对import_batch_number的处理
10、修改formControlESI，导入和预处理集成到一个功能中，同时刷新控制台页面
11、修改formControlImportFlow，导入和预处理集成到一个功能中，同时刷新控制台页面
12、修改dr_consolei中匹配调差对应的流名称，新增流delivery_billing_recon_and_adjust，同时调用匹配和调差功能
13、修改匹配流delivery_billing_recon_v2，增加对字段import_batch_number的处理


