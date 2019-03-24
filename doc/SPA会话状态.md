## SPA登录逻辑

![](https://static.calabash.top/img/jwt-token.png)

+ 用户登录后, 后端服务器颁发一个带有时效性的JWT token给前端应用

+ 前端应用在后续的请求中使用该Token进行访问后端资源

+ 这样做实现的效果就是: 后端无需存储任何登录状态

![](https://static.calabash.top/img/TIM20190324222829.png)