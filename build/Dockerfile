FROM alpine:3.15
RUN apk add nginx
COPY nginx.conf /etc/nginx/nginx.conf
ADD ./package/web /web
ADD ./package/service/delivery_recon /services/delivery_recon/delivery_recon
copy entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh","entrypoint.sh"]