# ROS机器人的网页控制端

## 界面预览
![image](https://user-images.githubusercontent.com/43928335/211497343-c457b0b1-f873-40e5-8119-19164695ca02.png)


## 本仓库包含以下内容：

1. css文件
2. js文件
3. html文件


## 实现的功能
1. 实现了2D地图显示及导航，可以指定机器人的初始位置，取消到点（机器人位置：/robot_pose 取消到点：/move_base/cancel 选点导航：/move_base_simple/goal 初始位置：/initialpose）
2. 实现了摇杆控制机器人方向，按键控制机器人方向（/cmd_vel）
3. 显示机器人的简易状态（自定义的消息:/car_state）
4. 发送命令（即通过话题发送数据而已，以下内容都说通过该话题发送数据，机器人软件接收到特定的数据执行特定的程序，自定义消息：/control_cmd）
![image](https://user-images.githubusercontent.com/43928335/211487813-1b89adb9-8acd-4810-adc1-ad240c14aee7.png)
5. localstorage方式保存点位并选择点位进行导航，可在开发者工具-应用-本地存储中找到点位数据
![image](https://user-images.githubusercontent.com/43928335/211494435-3672a149-9488-42c2-b487-622598fe9942.png)
6. 显示机器人位置信息（根据话题/robot_pose的数据显示，已隐藏）

## 使用说明

1. indel是主页，joy是摇杆控制
2. topic.js是比较重要的文件，里面定义了话题，消息，以及一些功能实现的函数
3. nav.js是显示2D地图的配置部分
4. Navigator.js内对原本的js文件进行了修改，修正了一些bug及添加了初始化机器人位置的功能
5. 其它功能具体实现方式参见Html文件及js文件，一些功能需要配合机器人的ROS程序实现
6. 该控制端连接的WebSocket地址是（ws://192.168.31.200:8989），并非ROSBridge默认的9090端口，使用需注意在topic.js的第一行进行修改

## 其它事项
1. 该工程收集了部分来自互联网的资料，结合我的ROS机器人进行的一些开发，功能并不是非常完善，一些功能效果不佳，如重载地图后不会刷新，需刷新网页
2. 注意，我这里的加载地图是需要ROS程序配合的，直接是无法使用的！！！！！
3. 有诸多不完善的地方，欢迎大家进行补充
