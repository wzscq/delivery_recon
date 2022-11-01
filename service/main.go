package main

import (
    "github.com/gin-gonic/gin"
    "buoyancyinfo.com/delivery_recon/common"
	"buoyancyinfo.com/delivery_recon/export"
	"buoyancyinfo.com/delivery_recon/crvClient"
	"log"
    "time"
    "runtime"
	"github.com/gin-contrib/cors"
)

func main() {
    //初始化配置
    conf:=common.InitConfig()
    //设置启动线程数量
    runtime.GOMAXPROCS(conf.Runtime.GoMaxProcs)

	//设置log打印文件名和行号
    log.SetFlags(log.Lshortfile | log.LstdFlags)

    //初始化时区
    var cstZone = time.FixedZone("CST", 8*3600) // 东八
	time.Local = cstZone

	//初始化路由
	router := gin.Default()
	router.Use(cors.New(cors.Config{
        AllowAllOrigins:true,
        AllowHeaders:     []string{"*"},
        ExposeHeaders:    []string{"*"},
        AllowCredentials: true,
    }))

	//crvClinet 用于到crvframeserver的请求
	crvClient:=&crvClient.CRVClient{
		Server:conf.CRV.Server,
		User:conf.CRV.User,
		Password:conf.CRV.Password,
		AppID:conf.CRV.AppID,
	}

	//导出数据接口
    exportController:=&export.ExportController{
		CRVClient:crvClient,
	}
	exportController.Bind(router)

	//启动监听服务
	router.Run(conf.Service.Port)
}