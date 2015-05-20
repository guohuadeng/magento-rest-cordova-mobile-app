## kikuu 技术要点

### 搭建 side menu 基本框架

* 创建项目
```
ionic start kikuu sidemenu
ionic platform add android
```
* 修改 www 相关内容，目录结构：
    * index.html
    * css
    * img
    * js
    * lib: bower 文件夹，在上层使用 bower install 安装
    * templates: 模板文件

### 替换 icon 和 splash 图标

* 修改 config.xml，去掉 xxhdpi 和 xxxhdpi
* resources 目录下所有图片，尺寸大小：
    * ldpi-icon: 36 x 36px
    * mdpi-icon: 48 x 48px
    * hdpi-icon: 72 x 72px
    * xhdpi-icon: 92 x 92px
    * port-ldpi-screen: 320 x 426px
    * port-mdpi-screen: 320 x 470px
    * port-hdpi-screen: 480 x 640px
    * port-xdpi-screen: 720 x 960px
    * land-ldpi-screen: 426 x 320px
    * land-mdpi-screen: 470 x 320px
    * land-hdpi-screen: 640 x 480px
    * land-xdpi-screen: 960 x 720px

### 根据后台接口生成菜单

* 创建 services.js，用于所有资源处理

### 配置全局参数

* 创建 config.js，使用 constant 定义定量
```
angular.constant('Config', {});
```
