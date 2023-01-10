var IP = 'ws://192.168.31.200:8989'//IP及端口
//var init_pose = false;//初始化必须是选择小车当前所在的位置
var positionx = 0.0;//机器人所在位置
var positiony = 0.0;
var positionz = 0.0;
var orientationx = 0.0;
var orientationy = 0.0;
var orientationw = 0.0;
var orientationz = 0.0;



// Connecting to ROS
var ros = new ROSLIB.Ros({
    url: IP
});
// Publishing  Topic
var cmdVel = new ROSLIB.Topic({
    ros: ros,
    name: '/cmd_vel',
    messageType: 'geometry_msgs/Twist'
});//创建一个topic,它的名字是'/cmd_vel',,消息类型是'geometry_msgs/Twist'
var twist = new ROSLIB.Message({
    linear: {
        x: 0.0,
        y: 0.0,
        z: 0.0
    },
    angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0
    }
});//创建一个message
//在点击方向按钮后发布消息，并对消息进行更改
function front() { move(1, 0); }
function back() { move(-1, 0); }
function left() { move(0, 1); }
function right() { move(0, -1); }
function stop() { move(0, 0); }
function move(x, z) {
    twist.linear.x = x;
    twist.angular.z = z;
    cmdVel.publish(twist);
}

// Subscribing to a Topic
//状态读取
var car_state = new ROSLIB.Topic({
    ros: ros,
    name: '/car_state',
    messageType: 'sunso_car_a/car_state'
});//创建一个topic,它的名字是'/car_state',,消息类型是'sunso_car_a/car_state'
function sub_car_state()//在点击按钮后订阅'/car_state'的消息
{
    car_state.subscribe(function (message) {
        var Car_State_Voltage = message.Battery_Voltage;
        var Car_State_Current = message.Battery_Current;
        var Car_State_Charge_State = message.Charge_State;
        document.getElementById("car_state_voltage").innerHTML = "电压：" + Car_State_Voltage;
        document.getElementById("car_state_current").innerHTML = "充电电流：" + Car_State_Current;
        document.getElementById("car_state_charge_state").innerHTML = "进桩状态：" + Car_State_Charge_State;
    });
}
function unsub_car_state()//在点击按钮后取消订阅消息
{
    car_state.unsubscribe();
}

var control_cmd = new ROSLIB.Topic({
    ros: ros,
    name: '/control_cmd',
    messageType: 'std_msgs/String'
});//创建一个topic,它的名字是'/control_cmd'
var cmd = new ROSLIB.Message({
    data: ''
});//创建一个message
function pub_cmd2(data)//发送命令
{
    cmd.data = data;
    control_cmd.publish(cmd);
}
function pub_cmd()//发送命令
{
    cmd.data = document.getElementById("control_cmd").value;
    control_cmd.publish(cmd);
}

var cancel_goal = new ROSLIB.Topic({
    ros: ros,
    name: '/move_base/cancel',
    messageType: 'actionlib_msgs/GoalID'
});//创建一个topic
var cancel = new ROSLIB.Message({
    stamp: {
        secs: 0.0,
        nsecs: 0.0
    },
    id: ""
});//创建一个message
function cancel_goal_pub() {
    cancel_goal.publish(cancel);
}

var goal_pub = new ROSLIB.Topic({
    ros: ros,
    name: '/move_base_simple/goal',
    messageType: 'geometry_msgs/PoseStamped'
});//创建一个topic
var goal = new ROSLIB.Message({
    header: {
        //seq: 0,
        stamp: {
            secs: 0,
            nsecs: 0
        },
        frame_id: "map"
    },
    pose: {
        position: {
            x: 0.0,
            y: 0.0,
            z: 0.0
        },
        orientation: {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            w: 0.0
        }
    }
});//创建一个message
function go(x, y, oz, ow) {//传入位置坐标
    var myDate = new Date();
    var myDate2 = new Date();
    myDate = myDate.getTime(); // 获取当前时间(从1970.1.1开始的毫秒数)
    myDate2 = myDate2.getMilliseconds();//获取当前秒的毫秒数
    goal.header.stamp.secs = myDate / 1000;
    goal.header.stamp.nsecs = myDate2 * 1000000;
    goal.pose.position.x = x;
    goal.pose.position.y = y;
    goal.pose.orientation.w = ow;
    goal.pose.orientation.z = oz;
    goal_pub.publish(goal);
}
function go2(point_name) {//传入目标点名称
    var myDate5 = new Date();
    var myDate6 = new Date();
    myDate5 = myDate5.getTime(); // 获取当前时间(从1970.1.1开始的毫秒数)
    myDate6 = myDate6.getMilliseconds();//获取当前秒的毫秒数
    goal.header.stamp.secs = myDate5 / 1000;
    goal.header.stamp.nsecs = myDate6 * 1000000;
    goal.pose.position.x = JSON.parse(window.localStorage.getItem(point_name)).point_x//JSON 解析实例数据;
    goal.pose.position.y = JSON.parse(window.localStorage.getItem(point_name)).point_y//JSON 解析实例数据;
    goal.pose.orientation.w = JSON.parse(window.localStorage.getItem(point_name)).point_ow//JSON 解析实例数据;
    goal.pose.orientation.z = JSON.parse(window.localStorage.getItem(point_name)).point_oz//JSON 解析实例数据;
    goal_pub.publish(goal);
}
//设置位置
var init_robot_pose = new ROSLIB.Topic({
    ros: ros,
    name: '/initialpose',
    messageType: 'show geometry_msgs/PoseWithCovarianceStamped'
});//创建一个topic
var init_pose_message = new ROSLIB.Message({
    header: {
        //seq: 0,
        stamp: {
            secs: 0,
            nsecs: 0
        },
        frame_id: "map"
    },
    pose: {
        pose: {
            position: {
                x: 0.0,
                y: 0.0,
                z: 0.0
            },
            orientation: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 0.0
            }
        },
        covariance: [0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.06853892326654787]
    }
});//创建一个message
function robot_pose() {
    alert("在地图上选择小车所在位置及朝向");
    init_pose = true;
}

var robot_pose_sub = new ROSLIB.Topic({
    ros: ros,
    name: '/robot_pose',
    messageType: 'geometry_msgs/Pose'
});//创建一个topic
function sub_robot_pose() {
    robot_pose_sub.subscribe(function (message) {
        positionx = message.position.x;
        positiony = message.position.y;
        positionz = message.position.z;
        orientationx = message.orientation.x;
        orientationy = message.orientation.y;
        orientationw = message.orientation.w;
        orientationz = message.orientation.z;
        document.getElementById("positionx").innerHTML = "position x:" + "   " + positionx;
        document.getElementById("positiony").innerHTML = "position y:" + "   " + positiony;
        document.getElementById("positionz").innerHTML = "position z:" + "   " + positionz;
        document.getElementById("orientationx").innerHTML = "orientation x:" + "   " + orientationx;
        document.getElementById("orientationy").innerHTML = "orientation y:" + "   " + orientationy;
        document.getElementById("orientationw").innerHTML = "orientation w:" + "   " + orientationw;
        document.getElementById("orientationz").innerHTML = "orientation z:" + "   " + orientationz;
    });
}
function unsub_robot_pose()//在点击按钮后取消订阅消息
{
    robot_pose_sub.unsubscribe();
}

function stop()//急停按钮，区别于停止，有特殊需求可以在此实现
{
    cancel_goal_pub();//取消到点
    move(0, 0);//发布速度均为0
    pub_cmd2('disReCharge');//终止进桩
}

function setpoint(point_name) {//localstorage方式保存点位
    let data = {//设置数据
        point_x: positionx,
        point_y: positiony,
        point_ow: orientationw,
        point_oz: orientationz
    }
    window.localStorage.setItem(point_name, JSON.stringify(data))//json格式保存数据
    //JSON.parse(window.localStorage.getItem(point_name))//JSON 解析实例数据
    // window.localStorage.setItem(key,value);//设置指定key的数据（JSON格式）
    // window.localStorage.getItem(key);//获取指定key的数据
    // window.localStorage.removeItem(key);//删除指定key的数据
    // window.localStorage.clear();//清空所有的存储数据
    var point_data = window.localStorage.getItem(point_name);//获取指定key的数据
    alert("保存成功\n" + point_data);
}

function save_map() {
    //cmd.data = "roslaunch sunso_car_a save_map.launch filename:=/home/nvidia/map/" + document.getElementById("map_name").value;
    cmd.data = "save_map#" + document.getElementById("map_name").value;
    control_cmd.publish(cmd);
}

function load_map() {
    //cmd.data = "roslaunch sunso_car_a read_map.launch map:=/home/nvidia/map" + document.getElementById("map_name").value + ".yaml";
    cmd.data = "load_map#" + document.getElementById("map_name").value;
    control_cmd.publish(cmd);
}

function delete_map() {
    //cmd.data = "roslaunch sunso_car_a read_map.launch map:=/home/nvidia/map" + document.getElementById("map_name").value + ".yaml";
    cmd.data = "delete_map#" + document.getElementById("map_name").value;
    control_cmd.publish(cmd);
}