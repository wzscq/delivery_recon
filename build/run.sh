#首先需要部署crvframe和match项目


docker run -d --name delivery_recon -p8060:80 -v /root/delivery_recon/conf:/services/delivery_recon/conf wangzhsh/delivery_recon:0.1.0 