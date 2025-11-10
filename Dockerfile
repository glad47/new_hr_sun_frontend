FROM nginx:1.26.0
RUN ln -sf /usr/share/zoneinfo/Asia/Riyadh /etc/localtime
COPY dist /home/ruoyi/projects/ruoyi-ui
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80