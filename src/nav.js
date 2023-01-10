/**
* Setup all visualization elements when the page is loaded. 
*/
function init() {
    // Connect to ROS.
    var ros = new ROSLIB.Ros({
        url: IP
    });

    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
        divID: 'nav',
        width: 500,
        height: 500
    });

    // Setup the nav client.
    var nav = NAV2D.OccupancyGridClientNav({//为保证与rviz定点的frame_id相同，将Navigator.js文件中的"/map"改为了"map"，经验证不能多一个"/"
        //启用选择方向功能应在if(withOrientation === ???)中将false改为true，已修改
        ros: ros,
        rootObject: viewer.scene,
        viewer: viewer,
        robot_pose: '/robot_pose',
        serverName: '/move_base'
    });
}
