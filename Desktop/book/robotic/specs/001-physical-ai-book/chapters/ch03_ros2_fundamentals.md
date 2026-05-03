---
id: ch03_ros2_fundamentals
sidebar_position: 3
---

# Chapter 3: ROS 2 Fundamentals

## Learning Objectives

By the end of this chapter, you will be able to:
- Understand ROS 2 architecture and core concepts
- Set up ROS 2 Humble on Ubuntu 22.04
- Create and build custom ROS 2 packages
- Work with launch files and parameter management
- Debug and visualize robot systems with RVIZ2

## What is ROS 2?

**ROS 2** (Robot Operating System 2) is a flexible framework for writing robot software. It provides:

- **Middleware**: Communication between processes
- **Tools**: Visualization, simulation, and debugging
- **Libraries**: Pre-built functionality for common tasks
- **Ecosystem**: Community packages and integrations

### ROS 2 vs ROS 1

| Feature | ROS 1 | ROS 2 |
|---------|-------|-------|
| Architecture | Master-based | Decentralized |
| Middleware | Custom | DDS-based |
| Real-time | Limited | Full support |
| Security | Minimal | Built-in |
| Multi-robot | Difficult | Native |
| Production Ready | Mature | Yes |

## ROS 2 Architecture

### Core Concepts

```
┌─────────────────────────────────────┐
│         ROS 2 Application           │
├─────────────────────────────────────┤
│  Nodes (Processes)                  │
│  ├─ Publisher                       │
│  ├─ Subscriber                      │
│  ├─ Service Server/Client           │
│  └─ Action Server/Client            │
├─────────────────────────────────────┤
│  DDS Middleware (Communication)     │
├─────────────────────────────────────┤
│  Operating System (Linux)           │
└─────────────────────────────────────┘
```

### Nodes

A **node** is an executable that performs computation. Nodes communicate with each other through topics, services, and actions.

```python
import rclpy
from rclpy.node import Node

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Topics

**Topics** are named buses over which nodes exchange messages. They implement a publish-subscribe pattern.

```python
# Subscriber example
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalSubscriber(Node):
    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: "{msg.data}"')

def main(args=None):
    rclpy.init(args=args)
    minimal_subscriber = MinimalSubscriber()
    rclpy.spin(minimal_subscriber)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Services

**Services** implement a request-response pattern. A service client sends a request and waits for a response.

```python
# Service server
from example_interfaces.srv import AddTwoInts

class AddTwoIntsService(Node):
    def __init__(self):
        super().__init__('add_two_ints_service')
        self.srv = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_two_ints_callback)

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'Incoming request: a={request.a}, b={request.b}')
        return response
```

### Actions

**Actions** are for long-running tasks with feedback. They combine goal, result, and feedback.

```python
from rclpy.action import ActionServer
from example_interfaces.action import Fibonacci

class FibonacciActionServer(Node):
    def __init__(self):
        super().__init__('fibonacci_action_server')
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback)

    async def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')
        feedback_msg = Fibonacci.Feedback()
        feedback_msg.sequence = [0, 1]
        
        for i in range(1, goal_handle.request.order):
            feedback_msg.sequence.append(
                feedback_msg.sequence[i] + feedback_msg.sequence[i-1])
            goal_handle.publish_feedback(feedback_msg)
        
        goal_handle.succeed()
        result = Fibonacci.Result()
        result.sequence = feedback_msg.sequence
        return result
```

## Setting Up ROS 2 Humble

### Installation

```bash
# Set locale
locale  # check for UTF-8
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

# Setup sources
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/ros.key | sudo apt-key add -
sudo apt-repository "deb [arch=$(dpkg --print-architecture)] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main"

# Install ROS 2
sudo apt update
sudo apt install ros-humble-desktop
```

### Environment Setup

```bash
# Add to ~/.bashrc
source /opt/ros/humble/setup.bash

# Verify installation
ros2 --version
```

## Creating Custom ROS 2 Packages

### Package Structure

```
my_robot_package/
├── CMakeLists.txt
├── package.xml
├── src/
│   └── my_node.py
└── launch/
    └── my_launch.py
```

### Creating a Package

```bash
# Create workspace
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src

# Create package
ros2 pkg create --build-type ament_python my_robot_package

# Build
cd ~/ros2_ws
colcon build

# Source setup
source install/setup.bash
```

### Package Configuration (package.xml)

```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>my_robot_package</name>
  <version>0.0.0</version>
  <description>My robot package</description>
  <maintainer email="user@example.com">User</maintainer>
  <license>Apache License 2.0</license>

  <depend>rclpy</depend>
  <depend>std_msgs</depend>
  <depend>geometry_msgs</depend>

  <exec_depend>ros2launch</exec_depend>

  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>python3-pytest</test_depend>
</package>
```

## Launch Files

Launch files allow you to start multiple nodes with a single command.

### Python Launch File

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_robot_package',
            executable='my_node',
            name='my_node',
            output='screen',
            parameters=[
                {'param_name': 'param_value'}
            ]
        ),
        Node(
            package='my_robot_package',
            executable='another_node',
            name='another_node',
            output='screen'
        ),
    ])
```

### Running Launch Files

```bash
ros2 launch my_robot_package my_launch.py
```

## Parameter Management

### Setting Parameters

```python
class ParameterizedNode(Node):
    def __init__(self):
        super().__init__('parameterized_node')
        
        # Declare parameters
        self.declare_parameter('speed', 1.0)
        self.declare_parameter('direction', 'forward')
        
        # Get parameters
        speed = self.get_parameter('speed').value
        direction = self.get_parameter('direction').value
        
        self.get_logger().info(f'Speed: {speed}, Direction: {direction}')
```

### Parameter Files (YAML)

```yaml
my_node:
  ros__parameters:
    speed: 2.5
    direction: "forward"
    max_iterations: 100
```

### Loading Parameters

```bash
ros2 run my_robot_package my_node --ros-args --params-file config/params.yaml
```

## Debugging with ROS 2 CLI

### Common Commands

```bash
# List all nodes
ros2 node list

# List all topics
ros2 topic list

# Echo topic messages
ros2 topic echo /topic_name

# Publish to topic
ros2 topic pub /topic_name std_msgs/String "data: 'hello'"

# List services
ros2 service list

# Call service
ros2 service call /service_name example_interfaces/srv/AddTwoInts "{a: 5, b: 3}"

# List actions
ros2 action list

# Send action goal
ros2 action send_goal /action_name example_interfaces/action/Fibonacci "{order: 5}"
```

## Visualization with RVIZ2

RVIZ2 is the primary visualization tool for ROS 2.

### Basic RVIZ2 Configuration

```bash
# Launch RVIZ2
rviz2

# Or with a config file
rviz2 -d config/my_config.rviz
```

### Common Visualizations

- **TF (Transform)**: Robot coordinate frames
- **PointCloud2**: 3D point clouds from LiDAR
- **Image**: Camera feeds
- **LaserScan**: 2D LiDAR data
- **Marker**: Custom shapes and text

### RVIZ2 in Launch File

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    rviz_config_path = '/path/to/config.rviz'
    
    return LaunchDescription([
        Node(
            package='rviz2',
            executable='rviz2',
            name='rviz2',
            arguments=['-d', rviz_config_path],
            output='screen'
        ),
    ])
```

## ROS 2 Best Practices

### 1. Node Design
- Keep nodes focused on a single responsibility
- Use meaningful node and topic names
- Document parameters and their ranges

### 2. Communication
- Use appropriate communication patterns (topics vs services vs actions)
- Set reasonable queue sizes for subscribers
- Handle communication failures gracefully

### 3. Performance
- Monitor CPU and memory usage
- Use appropriate message rates
- Profile your nodes with `ros2_tracing`

### 4. Testing
- Write unit tests for your nodes
- Use launch tests for integration testing
- Test with multiple machines

## Troubleshooting

### Nodes Not Communicating

```bash
# Check ROS domain ID
echo $ROS_DOMAIN_ID

# Check network connectivity
ros2 daemon status
ros2 node list

# Enable verbose logging
export RCL_LOGGING_LEVEL_rcl=DEBUG
```

### Performance Issues

```bash
# Profile node execution
ros2 run rclcpp_components component_container_mt

# Monitor system resources
ros2 run system_monitor system_monitor
```

## Key Takeaways

- ROS 2 provides a decentralized, DDS-based middleware for robot software
- Nodes communicate through topics, services, and actions
- Launch files enable complex multi-node systems
- Parameters allow runtime configuration
- RVIZ2 provides powerful visualization capabilities
- Proper debugging tools help identify and fix issues

## Further Reading

- ROS 2 Documentation: https://docs.ros.org/en/humble/
- ROS 2 Tutorials: https://docs.ros.org/en/humble/Tutorials.html
- DDS Specification: https://www.omg.org/spec/DDS/

## Practice Exercises

1. **Create a Publisher-Subscriber**: Build a simple publisher that sends numbers and a subscriber that prints them.
2. **Implement a Service**: Create a service that calculates the distance between two points.
3. **Launch Multiple Nodes**: Create a launch file that starts 3 different nodes with different parameters.
4. **Visualize in RVIZ2**: Set up RVIZ2 to display a robot model and sensor data.