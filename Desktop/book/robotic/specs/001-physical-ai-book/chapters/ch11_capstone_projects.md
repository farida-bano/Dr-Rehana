---
sidebar_position: 11
---

# Chapter 11: Capstone Projects

## Learning Objectives

By the end of this chapter, you will be able to:
- Design end-to-end robotics projects
- Integrate multiple subsystems
- Implement real-world applications
- Evaluate project success
- Document and present results

## Project 1: Autonomous Mobile Manipulation

### Objective
Build a robot that autonomously picks objects from a table and places them in a bin.

### System Architecture

```
┌─────────────────────────────────────┐
│   Perception System                 │
│   - Object Detection (YOLO)         │
│   - Pose Estimation                 │
│   - Depth Sensing                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Planning System                   │
│   - Motion Planning (RRT)           │
│   - Grasp Planning                  │
│   - Task Sequencing                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Control System                    │
│   - Arm Control                     │
│   - Gripper Control                 │
│   - Base Navigation                 │
└─────────────────────────────────────┘
```

### Implementation

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from geometry_msgs.msg import Twist, PoseStamped
from std_msgs.msg import Float32MultiArray

class AutonomousManipulator(Node):
    def __init__(self):
        super().__init__('autonomous_manipulator')
        
        self.image_sub = self.create_subscription(
            Image, 'camera/image_raw', self.image_callback, 10)
        self.depth_sub = self.create_subscription(
            Image, 'camera/depth', self.depth_callback, 10)
        
        self.arm_cmd_pub = self.create_publisher(Float32MultiArray, 'arm/joint_commands', 10)
        self.gripper_pub = self.create_publisher(Float32MultiArray, 'gripper/command', 10)
        self.base_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        
        self.detector = ObjectDetector()
        self.planner = MotionPlanner()
        self.grasp_planner = GraspPlanner()
        
        self.state = 'idle'
        self.target_object = None
    
    def image_callback(self, msg):
        image = self.bridge.imgmsg_to_cv2(msg, "bgr8")
        detections = self.detector.detect(image)
        
        if self.state == 'idle' and detections:
            self.target_object = detections[0]
            self.state = 'planning'
            self.plan_manipulation()
    
    def plan_manipulation(self):
        if not self.target_object:
            return
        
        # Get object pose
        object_pose = self.get_object_pose(self.target_object)
        
        # Plan grasp
        grasp_pose = self.grasp_planner.plan_grasp(object_pose)
        
        # Plan arm motion
        arm_trajectory = self.planner.plan_arm_motion(grasp_pose)
        
        # Execute
        self.execute_trajectory(arm_trajectory)
        self.grasp_object()
        self.place_object()
        
        self.state = 'idle'
    
    def execute_trajectory(self, trajectory):
        for waypoint in trajectory:
            cmd = Float32MultiArray()
            cmd.data = waypoint
            self.arm_cmd_pub.publish(cmd)
            self.get_logger().info(f'Moving to: {waypoint}')
    
    def grasp_object(self):
        cmd = Float32MultiArray()
        cmd.data = [1.0]
        self.gripper_pub.publish(cmd)
    
    def place_object(self):
        cmd = Float32MultiArray()
        cmd.data = [0.0]
        self.gripper_pub.publish(cmd)

def main(args=None):
    rclpy.init(args=args)
    manipulator = AutonomousManipulator()
    rclpy.spin(manipulator)
    manipulator.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Project 2: Humanoid Navigation in Dynamic Environments

### Objective
Develop a humanoid robot that navigates crowded indoor environments while avoiding dynamic obstacles.

### Key Components

1. **Perception**: Real-time obstacle detection and tracking
2. **Planning**: Dynamic path planning with collision avoidance
3. **Control**: Bipedal locomotion with balance maintenance
4. **Interaction**: Human detection and social navigation

### Evaluation Metrics

```python
class NavigationEvaluator:
    def __init__(self):
        self.metrics = {}
    
    def evaluate(self, trajectory, obstacles, goal):
        self.metrics['path_length'] = self.compute_path_length(trajectory)
        self.metrics['collision_count'] = self.count_collisions(trajectory, obstacles)
        self.metrics['time_to_goal'] = self.compute_time(trajectory)
        self.metrics['smoothness'] = self.compute_smoothness(trajectory)
        self.metrics['success'] = self.check_goal_reached(trajectory, goal)
        
        return self.metrics
    
    def compute_path_length(self, trajectory):
        length = 0
        for i in range(len(trajectory) - 1):
            length += np.linalg.norm(trajectory[i+1] - trajectory[i])
        return length
    
    def count_collisions(self, trajectory, obstacles):
        collisions = 0
        for point in trajectory:
            for obstacle in obstacles:
                if self.point_in_obstacle(point, obstacle):
                    collisions += 1
        return collisions
    
    def compute_smoothness(self, trajectory):
        curvatures = []
        for i in range(1, len(trajectory) - 1):
            v1 = trajectory[i] - trajectory[i-1]
            v2 = trajectory[i+1] - trajectory[i]
            curvature = np.arccos(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
            curvatures.append(curvature)
        return np.mean(curvatures)
```

## Project 3: Learning-based Manipulation

### Objective
Train a robot to learn manipulation skills through reinforcement learning and human demonstration.

### Training Pipeline

```python
class ManipulationLearner:
    def __init__(self):
        self.agent = DQNAgent(state_dim=20, action_dim=7)
        self.demonstrations = []
        self.training_episodes = 0
    
    def collect_demonstrations(self, num_demos=50):
        for i in range(num_demos):
            trajectory = self.record_human_demo()
            self.demonstrations.append(trajectory)
            self.get_logger().info(f'Collected demo {i+1}/{num_demos}')
    
    def pretrain_from_demonstrations(self):
        for demo in self.demonstrations:
            for state, action in demo:
                self.agent.store_experience(state, action, reward=1.0, next_state=None, done=False)
        
        for _ in range(100):
            loss = self.agent.train(batch_size=32)
            self.get_logger().info(f'Pretraining loss: {loss}')
    
    def train_with_rl(self, num_episodes=1000):
        for episode in range(num_episodes):
            state = self.reset_environment()
            episode_reward = 0
            
            for step in range(100):
                action = self.agent.select_action(state)
                next_state, reward, done = self.step_environment(action)
                
                self.agent.store_experience(state, action, reward, next_state, done)
                loss = self.agent.train(batch_size=32)
                
                episode_reward += reward
                state = next_state
                
                if done:
                    break
            
            self.training_episodes += 1
            if episode % 100 == 0:
                self.get_logger().info(f'Episode {episode}, Reward: {episode_reward}')
    
    def evaluate(self, num_episodes=100):
        success_count = 0
        
        for episode in range(num_episodes):
            state = self.reset_environment()
            
            for step in range(100):
                action = self.agent.select_action(state)
                next_state, reward, done = self.step_environment(action)
                state = next_state
                
                if done:
                    if reward > 0:
                        success_count += 1
                    break
        
        success_rate = success_count / num_episodes
        self.get_logger().info(f'Success rate: {success_rate:.2%}')
        return success_rate
```

## Project Documentation Template

```markdown
# Project Report: [Project Name]

## Executive Summary
Brief overview of project goals and results.

## Problem Statement
Clear definition of the problem being solved.

## Approach
Description of methodology and system design.

## Implementation
Technical details and code structure.

## Results
Quantitative and qualitative results.

## Challenges and Solutions
Obstacles encountered and how they were overcome.

## Future Work
Potential improvements and extensions.

## References
Citations and resources used.
```

## Key Takeaways

- Capstone projects integrate multiple robotics subsystems
- Evaluation metrics quantify project success
- Documentation enables reproducibility
- Real-world constraints require practical solutions
- Iterative development improves performance

## Practice Exercises

1. Design a capstone project proposal
2. Implement a complete perception-planning-control pipeline
3. Evaluate system performance with multiple metrics
4. Document results in a professional report
5. Present findings to stakeholders
