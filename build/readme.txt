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

2023-01-13 增加批次号功能
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

2023-01-14 套件匹配报错问题排查
1、套件匹配流程修改允许billing<对账数量
2、调差流程错误修正

2023-01-29 允许跨公司销账
1、客户信息中增加新公司33264的配置。
2、增加跨公司匹配逻辑delivery_billing_recon_cross_customer。
3、控制台匹配调差逻辑中批次号传递问题修复
4、增加客户对账关系表dr_recon_customer及相关模型、菜单配置
5、菜单中增加手工比对菜单
6、修改手工比对页面，支持跨客户勾选billing
7、修改调差逻辑，增加差异调整后，对于跨客户核销的部分，做正反向的调整billing
8、调差结果页面的调差列表中增加客户字段显示
9、匹配结果表增加是否跨公司匹配字段，并修改跨公司匹配逻辑，增加对这个字段值的设置
11、匹配结果页面允许手动需改billing，可直接在列表中删除billing，可以通过列表选择其它billing添加到分组中
12、添加保存匹配分组流程配置save_match_group
13、修改CDN导出逻辑，增加根据公司+批次号过滤的功能
14、修改导出TaxLink逻辑，去掉原来需要确认后才能导出的控制

2023-02-09 调整两个对账逻辑
1、跨公司对账不需要做差异调整、直接在两个公司中做相应数量金额的调整、跨公司不做ZV70
    这里存在一个疑问，只做跨客户的调整，那么对应的billing就不需要选择，开票和对账过程可能不一致
    后续沟通后这个逻辑暂时不做修改
2、dr_console页面上方下拉框禁止清除
3、手工比对的保存调差功能流程逻辑
    修改前端页面逻辑
    增加逻辑处理流程manual_create_match_group
    增加创建分组的处理逻辑create_match_group,create_set_match_group
    增加2个调差的处理逻辑delivery_billing_recon_adjust_normal,delivery_billing_recon_adjust_set
4、修改save_match_group逻辑补充对分组的属性调整和自动更新调差功能  ok
5、对账单负数情况下对账,
    增加新的负数订单处理流程negative_delivery_match，本次增加针对退货的匹配使用精确匹配，不需要调差
    修改流程delivery_billing_recon_v2，首先调用负数订单匹配流程
6、对账单数量大于billing数量的提醒
    对于零件数量差异为正数的，可将数据行背景色标识为黄色背景,调整了dr_delivery_billing_recon_group配置



