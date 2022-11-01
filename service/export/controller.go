package export

import (
	"buoyancyinfo.com/delivery_recon/common"
	"buoyancyinfo.com/delivery_recon/crvClient"
	"log"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ExportController struct {
	CRVClient *crvClient.CRVClient
}

func (exp *ExportController)exportCDN(c *gin.Context){
	log.Println("ExportController exportCDN start")

	var header crvClient.CommonHeader
	if err := c.ShouldBindHeader(&header); err != nil {
		log.Println(err)
		rsp:=common.CreateResponse(common.CreateError(common.ResultWrongRequest,nil),nil)
		c.IndentedJSON(http.StatusOK, rsp)
		return
	}
	
	var rep crvClient.CommonReq
	if err := c.BindJSON(&rep); err != nil {
		log.Println(err)
		rsp:=common.CreateResponse(common.CreateError(common.ResultWrongRequest,nil),nil)
		c.IndentedJSON(http.StatusOK, rsp)
		return
    }	
	rsp:=exportCDN(&rep,&header,exp.CRVClient,c)
	//加载一个流的配置
	if rsp!=nil {
		c.IndentedJSON(http.StatusOK, rsp)
	}
	log.Println("ExportController exportCDN end")
}

func (exp *ExportController) Bind(router *gin.Engine) {
	log.Println("Bind FlowController")
	router.POST("/export/cdn", exp.exportCDN)
}