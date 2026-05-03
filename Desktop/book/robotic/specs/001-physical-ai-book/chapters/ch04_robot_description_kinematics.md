---
id: ch04_robot_description_kinematics
sidebar_position: 4
---

# Chapter 4: Robot Description & Kinematics

## Learning Objectives

By the end of this chapter, you will be able to:
- Understand URDF (Unified Robot Description Format) and its structure
- Create URDF files for humanoid robots
- Implement forward kinematics calculations
- Solve inverse kinematics problems
- Work with robot state publishers and TF transforms

## What is URDF?

**URDF** (Unified Robot Description Format) is an XML format for specifying the structure of robots. It defines:
- **Links**: Rigid bodies with mass and geometry
- **Joints**: Connections between links with constraints
- **Sensors**: Cameras, IMUs, and other sensors
- **Actuators**: Motors and control interfaces

### URDF Structure

```xml
<?xml version="1.0"?>
<robot name="my_robot">
  <link name="base_link">
    <inertial>
      <mass value="10.0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
    <visual>
      <geometry>
        <box size="0.2 0.2 0.3"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.2 0.2 0.3"/>
      </geometry>
    </collision>
  </link>

  <joint name="shoulder_joint" type="revolute">
    <parent link="base_link"/>
    <child link="upper_arm"/>
    <origin xyz="0 0 0.15" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1.0"/>
  </joint>

  <link name="upper_arm">
    <inertial>
      <mass value="5.0"/>
      <inertia ixx="0.05" ixy="0.0" ixz="0.0" iyy="0.05" iyz="0.0" izz="0.01"/>
    </inertial>
    <visual>
      <geometry>
        <cylinder length="0.3" radius="0.05"/>
      </geometry>
    </visual>
  </link>
</robot>
```

## Forward Kinematics

Forward kinematics calculates the end-effector position given joint angles using homogeneous transformation matrices.

```python
import numpy as np
from scipy.spatial.transform import Rotation as R

class ForwardKinematics:
    def __init__(self, dh_params):
        self.dh_params = dh_params
    
    def dh_matrix(self, a, d, alpha, theta):
        cos_theta = np.cos(theta)
        sin_theta = np.sin(theta)
        cos_alpha = np.cos(alpha)
        sin_alpha = np.sin(alpha)
        
        T = np.array([
            [cos_theta, -sin_theta*cos_alpha, sin_theta*sin_alpha, a*cos_theta],
            [sin_theta, cos_theta*cos_alpha, -cos_theta*sin_alpha, a*sin_theta],
            [0, sin_alpha, cos_alpha, d],
            [0, 0, 0, 1]
        ])
        return T
    
    def forward_kinematics(self, joint_angles):
        T = np.eye(4)
        for i, theta in enumerate(joint_angles):
            a, d, alpha, _ = self.dh_params[i]
            T_i = self.dh_matrix(a, d, alpha, theta)
            T = T @ T_i
        
        position = T[:3, 3]
        rotation = R.from_matrix(T[:3, :3])
        return position, rotation.as_euler('xyz')
```

## Inverse Kinematics

Inverse kinematics finds joint angles for a desired end-effector pose using numerical optimization.

```python
from scipy.optimize import minimize

class InverseKinematics:
    def __init__(self, fk_solver):
        self.fk = fk_solver
    
    def objective(self, joint_angles, target_pos, target_orient):
        pos, orient = self.fk.forward_kinematics(joint_angles)
        pos_error = np.linalg.norm(pos - target_pos)
        orient_error = np.linalg.norm(orient - target_orient)
        return pos_error + 0.1 * orient_error
    
    def solve(self, target_pos, target_orient, initial_guess=None):
        if initial_guess is None:
            initial_guess = np.zeros(len(self.fk.dh_params))
        
        result = minimize(
            self.objective,
            initial_guess,
            args=(target_pos, target_orient),
            method='SLSQP'
        )
        return result.x if result.success else None
```

## Key Takeaways

- URDF defines robot structure with links, joints, and sensors
- Forward kinematics calculates end-effector pose from joint angles
- Inverse kinematics finds joint angles for desired poses
- Numerical methods enable practical IK solutions

## Practice Exercises

1. Create a URDF file for a 3-DOF robotic arm
2. Implement forward kinematics for a 2-DOF planar arm
3. Solve inverse kinematics using numerical optimization
4. Visualize robot motion in RVIZ2
