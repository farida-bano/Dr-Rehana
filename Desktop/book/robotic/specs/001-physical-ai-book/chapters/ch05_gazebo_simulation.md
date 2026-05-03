---
sidebar_position: 5
---

# Chapter 5: Physics Simulation with Gazebo

## Learning Objectives

By the end of this chapter, you will be able to:
- Set up Gazebo simulation environment
- Create physics-accurate robot simulations
- Generate synthetic training data
- Debug robot behavior in simulation
- Integrate Gazebo with ROS 2

## What is Gazebo?

Gazebo is a powerful open-source 3D robotics simulator that provides:
- **Physics Engine**: Accurate simulation of forces, friction, and collisions
- **Sensor Simulation**: Virtual cameras, LiDAR, IMU sensors
- **Plugin System**: Extensible architecture for custom behaviors
- **ROS 2 Integration**: Native support for ROS 2 communication

## Installation

```bash
# Install Gazebo and ROS 2 integration
sudo apt update
sudo apt install gazebo ros-humble-gazebo-ros-pkgs

# Verify installation
gazebo --version
```

## Creating a Simulation World

### World File Structure

```xml
<?xml version="1.0"?>
<sdf version="1.9">
  <world name="robot_world">
    <!-- Physics engine configuration -->
    <physics name="default_physics" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
    </physics>

    <!-- Lighting -->
    <light name="sun" type="directional">
      <cast_shadows>true</cast_shadows>
      <pose>0 0 10 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <attenuation>
        <range>1000</range>
        <constant>0.9</constant>
        <linear>0.01</linear>
        <quadratic>0.001</quadratic>
      </attenuation>
    </light>

    <!-- Ground plane -->
    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
          <material>
            <ambient>0.8 0.8 0.8 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
            <specular>0.8 0.8 0.8 1</specular>
          </material>
        </visual>
      </link>
    </model>

    <!-- Robot model -->
    <include>
      <uri>model://humanoid_robot</uri>
      <pose>0 0 0.5 0 0 0</pose>
    </include>
  </world>
</sdf>
```

## Launching Gazebo with ROS 2

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import ExecuteProcess

def generate_launch_description():
    gazebo = ExecuteProcess(
        cmd=['gazebo', '--verbose', 'worlds/robot_world.world'],
        output='screen'
    )

    spawn_robot = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=['-entity', 'humanoid', '-file', 'models/humanoid.urdf'],
        output='screen'
    )

    return LaunchDescription([
        gazebo,
        spawn_robot,
    ])
```

## Sensor Simulation

### Camera Sensor

```xml
<sensor name="camera" type="camera">
  <camera>
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
      <format>R8G8B8</format>
    </image>
    <clip>
      <near>0.02</near>
      <far>300</far>
    </clip>
  </camera>
  <always_on>1</always_on>
  <update_rate>30</update_rate>
  <visualize>true</visualize>
  <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
    <ros>
      <remapping>~/image_raw:=camera/image_raw</remapping>
      <remapping>~/camera_info:=camera/camera_info</remapping>
    </ros>
  </plugin>
</sensor>
```

### LiDAR Sensor

```xml
<sensor name="lidar" type="ray">
  <pose>0 0 0.1 0 0 0</pose>
  <ray>
    <scan>
      <horizontal>
        <samples>360</samples>
        <resolution>1</resolution>
        <min_angle>-3.14159</min_angle>
        <max_angle>3.14159</max_angle>
      </horizontal>
    </scan>
    <range>
      <min>0.08</min>
      <max>10.0</max>
      <resolution>0.01</resolution>
    </range>
  </ray>
  <always_on>1</always_on>
  <update_rate>10</update_rate>
  <visualize>true</visualize>
  <plugin name="lidar_controller" filename="libgazebo_ros_ray_sensor.so">
    <ros>
      <remapping>~/out:=scan</remapping>
    </ros>
  </plugin>
</sensor>
```

## Physics Configuration

### Tuning Physics Parameters

```xml
<physics name="default_physics" type="ode">
  <max_step_size>0.001</max_step_size>
  <real_time_factor>1.0</real_time_factor>
  <real_time_update_rate>1000</real_time_update_rate>
  
  <ode>
    <solver>
      <type>quick</type>
      <iters>50</iters>
      <precon_iters>0</precon_iters>
      <sor>1.3</sor>
      <use_dynamic_moi_rescaling>false</use_dynamic_moi_rescaling>
    </solver>
    <constraints>
      <cfm>0</cfm>
      <erp>0.2</erp>
      <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
      <contact_surface_layer>0.001</contact_surface_layer>
    </constraints>
  </ode>
</physics>
```

## Synthetic Data Generation

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class DataCollector(Node):
    def __init__(self):
        super().__init__('data_collector')
        self.subscription = self.create_subscription(
            Image,
            'camera/image_raw',
            self.image_callback,
            10)
        self.bridge = CvBridge()
        self.frame_count = 0
    
    def image_callback(self, msg):
        cv_image = self.bridge.imgmsg_to_cv2(msg, "bgr8")
        filename = f'data/frame_{self.frame_count:06d}.png'
        cv2.imwrite(filename, cv_image)
        self.frame_count += 1
        
        if self.frame_count % 100 == 0:
            self.get_logger().info(f'Collected {self.frame_count} frames')

def main(args=None):
    rclpy.init(args=args)
    collector = DataCollector()
    rclpy.spin(collector)
    collector.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Key Takeaways

- Gazebo provides accurate physics simulation for robotics
- World files define environment, lighting, and physics parameters
- Sensors can be simulated with realistic noise and properties
- ROS 2 integration enables seamless communication
- Synthetic data generation accelerates machine learning workflows

## Practice Exercises

1. Create a Gazebo world with obstacles and a humanoid robot
2. Add camera and LiDAR sensors to the robot
3. Collect synthetic training data from simulation
4. Tune physics parameters for realistic behavior
