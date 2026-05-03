---
id: ch08_navigation_motion_planning
sidebar_position: 8
---

# Chapter 8: Navigation & Motion Planning

## Learning Objectives

By the end of this chapter, you will be able to:
- Implement path planning algorithms
- Use Nav2 for autonomous navigation
- Develop footstep planning for humanoids
- Control robot motion in real-time
- Handle dynamic obstacles

## Path Planning Algorithms

### Rapidly-exploring Random Trees (RRT)

```python
import numpy as np
from scipy.spatial.distance import euclidean

class RRTPlanner:
    def __init__(self, start, goal, obstacles, max_iterations=5000, step_size=0.5):
        self.start = np.array(start)
        self.goal = np.array(goal)
        self.obstacles = obstacles
        self.max_iterations = max_iterations
        self.step_size = step_size
        self.tree = [self.start]
        self.parent = {0: None}
    
    def is_collision_free(self, point1, point2):
        for obstacle in self.obstacles:
            if self.line_intersects_circle(point1, point2, obstacle):
                return False
        return True
    
    def line_intersects_circle(self, p1, p2, circle):
        center, radius = circle
        t = max(0, min(1, np.dot(center - p1, p2 - p1) / np.dot(p2 - p1, p2 - p1)))
        closest = p1 + t * (p2 - p1)
        return euclidean(closest, center) < radius
    
    def plan(self):
        for iteration in range(self.max_iterations):
            if np.random.rand() < 0.1:
                random_point = self.goal
            else:
                random_point = np.random.rand(2) * 10
            
            nearest_idx = self.find_nearest(random_point)
            nearest_point = self.tree[nearest_idx]
            
            direction = random_point - nearest_point
            direction = direction / np.linalg.norm(direction)
            new_point = nearest_point + direction * self.step_size
            
            if self.is_collision_free(nearest_point, new_point):
                self.tree.append(new_point)
                self.parent[len(self.tree) - 1] = nearest_idx
                
                if euclidean(new_point, self.goal) < self.step_size:
                    self.tree.append(self.goal)
                    self.parent[len(self.tree) - 1] = len(self.tree) - 2
                    return self.extract_path()
        
        return None
    
    def find_nearest(self, point):
        distances = [euclidean(point, node) for node in self.tree]
        return np.argmin(distances)
    
    def extract_path(self):
        path = []
        current = len(self.tree) - 1
        while current is not None:
            path.append(self.tree[current])
            current = self.parent[current]
        return path[::-1]
```

### Probabilistic Roadmap (PRM)

```python
class PRMPlanner:
    def __init__(self, num_samples=500, k_neighbors=10):
        self.num_samples = num_samples
        self.k_neighbors = k_neighbors
        self.roadmap = []
        self.edges = []
    
    def build_roadmap(self, bounds, obstacles):
        samples = []
        while len(samples) < self.num_samples:
            point = np.random.rand(2) * bounds
            if not self.in_collision(point, obstacles):
                samples.append(point)
        
        self.roadmap = samples
        
        for i, point1 in enumerate(samples):
            distances = [euclidean(point1, point2) for point2 in samples]
            neighbors = np.argsort(distances)[1:self.k_neighbors+1]
            
            for j in neighbors:
                point2 = samples[j]
                if self.is_collision_free(point1, point2, obstacles):
                    self.edges.append((i, j))
    
    def in_collision(self, point, obstacles):
        for obstacle in obstacles:
            center, radius = obstacle
            if euclidean(point, center) < radius:
                return True
        return False
    
    def is_collision_free(self, p1, p2, obstacles):
        for obstacle in obstacles:
            center, radius = obstacle
            t = max(0, min(1, np.dot(center - p1, p2 - p1) / np.dot(p2 - p1, p2 - p1)))
            closest = p1 + t * (p2 - p1)
            if euclidean(closest, center) < radius:
                return False
        return True
```

## Nav2 Integration

```python
import rclpy
from rclpy.node import Node
from nav2_simple_commander.robot_navigator import BasicNavigator
from geometry_msgs.msg import PoseStamped

class Nav2Navigator(Node):
    def __init__(self):
        super().__init__('nav2_navigator')
        self.navigator = BasicNavigator()
    
    def navigate_to_pose(self, x, y, theta):
        goal_pose = PoseStamped()
        goal_pose.header.frame_id = 'map'
        goal_pose.header.stamp = self.get_clock().now().to_msg()
        goal_pose.pose.position.x = x
        goal_pose.pose.position.y = y
        goal_pose.pose.orientation.z = np.sin(theta / 2)
        goal_pose.pose.orientation.w = np.cos(theta / 2)
        
        self.navigator.goToPose(goal_pose)
        
        while not self.navigator.isTaskComplete():
            feedback = self.navigator.getFeedback()
            if feedback:
                self.get_logger().info(f'Distance remaining: {feedback.distance_remaining:.2f}')
        
        result = self.navigator.getResult()
        if result == TaskResult.SUCCEEDED:
            self.get_logger().info('Navigation succeeded!')
        else:
            self.get_logger().error('Navigation failed!')
```

## Footstep Planning for Humanoids

```python
class FootstepPlanner:
    def __init__(self, step_length=0.3, step_width=0.2):
        self.step_length = step_length
        self.step_width = step_width
        self.footsteps = []
    
    def plan_footsteps(self, start_pose, goal_pose, num_steps=10):
        footsteps = []
        current_pose = start_pose
        
        for i in range(num_steps):
            alpha = i / num_steps
            
            if i % 2 == 0:
                foot = 'left'
                y_offset = self.step_width / 2
            else:
                foot = 'right'
                y_offset = -self.step_width / 2
            
            x = start_pose[0] + (goal_pose[0] - start_pose[0]) * alpha
            y = start_pose[1] + y_offset
            theta = start_pose[2]
            
            footsteps.append({
                'foot': foot,
                'pose': [x, y, theta],
                'duration': 0.8,
            })
        
        return footsteps
    
    def execute_footsteps(self, footsteps):
        for step in footsteps:
            self.move_foot(step['foot'], step['pose'], step['duration'])
    
    def move_foot(self, foot, pose, duration):
        pass
```

## Motion Control

```python
class MotionController:
    def __init__(self):
        self.velocity_pub = None
        self.current_velocity = [0, 0, 0]
    
    def set_velocity(self, linear_x, linear_y, angular_z):
        self.current_velocity = [linear_x, linear_y, angular_z]
    
    def follow_path(self, path, max_velocity=0.5):
        for i in range(len(path) - 1):
            current = path[i]
            next_point = path[i + 1]
            
            direction = next_point - current
            distance = np.linalg.norm(direction)
            
            if distance > 0:
                direction = direction / distance
                velocity = min(max_velocity, distance)
                
                self.set_velocity(
                    direction[0] * velocity,
                    direction[1] * velocity,
                    0
                )
    
    def stop(self):
        self.set_velocity(0, 0, 0)
```

## Obstacle Avoidance

```python
class DynamicWindowApproach:
    def __init__(self, max_velocity=1.0, max_angular_velocity=1.0):
        self.max_velocity = max_velocity
        self.max_angular_velocity = max_angular_velocity
    
    def evaluate_trajectory(self, velocity, angular_velocity, obstacles, goal):
        heading_score = self.heading_score(velocity, angular_velocity, goal)
        distance_score = self.distance_score(velocity, angular_velocity, obstacles)
        velocity_score = velocity / self.max_velocity
        
        total_score = heading_score + distance_score + velocity_score
        return total_score
    
    def heading_score(self, velocity, angular_velocity, goal):
        angle_to_goal = np.arctan2(goal[1], goal[0])
        return 1.0 - abs(angle_to_goal) / np.pi
    
    def distance_score(self, velocity, angular_velocity, obstacles):
        min_distance = float('inf')
        for obstacle in obstacles:
            distance = np.linalg.norm(obstacle)
            min_distance = min(min_distance, distance)
        
        return min_distance / 10.0
    
    def compute_best_velocity(self, obstacles, goal):
        best_score = -float('inf')
        best_velocity = (0, 0)
        
        for v in np.linspace(0, self.max_velocity, 10):
            for w in np.linspace(-self.max_angular_velocity, self.max_angular_velocity, 10):
                score = self.evaluate_trajectory(v, w, obstacles, goal)
                if score > best_score:
                    best_score = score
                    best_velocity = (v, w)
        
        return best_velocity
```

## Key Takeaways

- RRT and PRM are fundamental path planning algorithms
- Nav2 provides production-ready navigation stack
- Footstep planning enables humanoid locomotion
- Motion control translates plans to robot commands
- Obstacle avoidance ensures safe navigation

## Practice Exercises

1. Implement RRT path planning in 2D environment
2. Build a PRM roadmap and query paths
3. Use Nav2 for autonomous navigation
4. Plan footsteps for humanoid walking
5. Implement dynamic window approach for obstacle avoidance
