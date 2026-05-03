---
id: ch06_isaac_sim
sidebar_position: 6
---

# Chapter 6: High-Fidelity Simulation with Isaac Sim

## Learning Objectives

By the end of this chapter, you will be able to:
- Set up NVIDIA Isaac Sim environment
- Create photorealistic simulations
- Implement domain randomization
- Export synthetic datasets
- Integrate Isaac Sim with ROS 2

## What is Isaac Sim?

Isaac Sim is NVIDIA's advanced robotics simulation platform featuring:
- **Photorealistic Rendering**: RTX ray tracing for realistic visuals
- **Physics Accuracy**: NVIDIA PhysX engine for precise dynamics
- **Domain Randomization**: Automated variation for sim-to-real transfer
- **AI Integration**: Native support for deep learning workflows

## Installation

```bash
# Download from NVIDIA website
# https://developer.nvidia.com/isaac-sim

# Extract and setup
cd isaac-sim-2023.1.1
./python.sh -m pip install omni-isaac-ros2-bridge
```

## Creating a Simulation Environment

### Python Script for Isaac Sim

```python
from omni.isaac.kit import SimulationApp

simulation_app = SimulationApp({"headless": False})

from omni.isaac.core import World
from omni.isaac.core.robots import Robot
from omni.isaac.core.utils.stage import add_reference_to_stage

world = World(stage_units_in_meters=1.0)

# Add ground plane
from omni.isaac.core.prims import XFormPrim
ground = XFormPrim(prim_path="/World/Ground")

# Add robot
add_reference_to_stage(
    usd_path="omniverse://localhost/NVIDIA/Assets/Isaac/2023.1.1/Isaac/Robots/Humanoid/humanoid.usd",
    prim_path="/World/Humanoid"
)

# Simulation loop
for i in range(1000):
    world.step(render=True)
    if i % 100 == 0:
        print(f"Step {i}")

simulation_app.close()
```

## Domain Randomization

Domain randomization varies simulation parameters to improve sim-to-real transfer.

```python
import random
import numpy as np

class DomainRandomizer:
    def __init__(self):
        self.randomization_params = {
            'friction': (0.3, 1.0),
            'restitution': (0.0, 0.5),
            'mass_scale': (0.8, 1.2),
            'lighting_intensity': (0.5, 2.0),
            'camera_noise': (0.0, 0.05),
        }
    
    def randomize_physics(self, prim):
        friction = random.uniform(*self.randomization_params['friction'])
        restitution = random.uniform(*self.randomization_params['restitution'])
        mass_scale = random.uniform(*self.randomization_params['mass_scale'])
        
        # Apply randomization to physics properties
        prim.get_physics_material().set_friction_coefficient(friction)
        prim.get_physics_material().set_restitution_coefficient(restitution)
        
        return {
            'friction': friction,
            'restitution': restitution,
            'mass_scale': mass_scale,
        }
    
    def randomize_lighting(self, light):
        intensity = random.uniform(*self.randomization_params['lighting_intensity'])
        light.set_intensity(intensity)
        return {'intensity': intensity}
    
    def randomize_camera(self):
        noise = random.uniform(*self.randomization_params['camera_noise'])
        return {'noise_std': noise}
```

## Synthetic Dataset Generation

```python
import json
from pathlib import Path

class DatasetGenerator:
    def __init__(self, output_dir):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.frame_count = 0
        self.metadata = []
    
    def capture_frame(self, rgb_image, depth_image, segmentation, pose, randomization_params):
        frame_id = f"{self.frame_count:06d}"
        
        # Save images
        rgb_path = self.output_dir / f"rgb_{frame_id}.png"
        depth_path = self.output_dir / f"depth_{frame_id}.exr"
        seg_path = self.output_dir / f"segmentation_{frame_id}.png"
        
        # Save metadata
        metadata = {
            'frame_id': frame_id,
            'rgb': str(rgb_path),
            'depth': str(depth_path),
            'segmentation': str(seg_path),
            'pose': pose,
            'randomization': randomization_params,
        }
        self.metadata.append(metadata)
        self.frame_count += 1
    
    def save_metadata(self):
        metadata_path = self.output_dir / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(self.metadata, f, indent=2)
```

## ROS 2 Integration

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CameraInfo
from geometry_msgs.msg import TransformStamped
from tf2_ros import TransformBroadcaster
from cv_bridge import CvBridge
import numpy as np

class IsaacSimROS2Bridge(Node):
    def __init__(self):
        super().__init__('isaac_sim_bridge')
        
        self.rgb_pub = self.create_publisher(Image, 'camera/rgb', 10)
        self.depth_pub = self.create_publisher(Image, 'camera/depth', 10)
        self.camera_info_pub = self.create_publisher(CameraInfo, 'camera/camera_info', 10)
        
        self.tf_broadcaster = TransformBroadcaster(self)
        self.bridge = CvBridge()
        
        self.timer = self.create_timer(0.033, self.publish_data)
    
    def publish_data(self):
        # Get data from Isaac Sim
        rgb_image = self.get_rgb_from_isaac()
        depth_image = self.get_depth_from_isaac()
        
        # Convert to ROS messages
        rgb_msg = self.bridge.cv2_to_imgmsg(rgb_image, "bgr8")
        depth_msg = self.bridge.cv2_to_imgmsg(depth_image, "32FC1")
        
        # Publish
        self.rgb_pub.publish(rgb_msg)
        self.depth_pub.publish(depth_msg)
        
        # Publish camera info
        camera_info = CameraInfo()
        camera_info.header.stamp = self.get_clock().now().to_msg()
        camera_info.height = 480
        camera_info.width = 640
        camera_info.K = [640, 0, 320, 0, 640, 240, 0, 0, 1]
        self.camera_info_pub.publish(camera_info)
    
    def get_rgb_from_isaac(self):
        return np.zeros((480, 640, 3), dtype=np.uint8)
    
    def get_depth_from_isaac(self):
        return np.zeros((480, 640), dtype=np.float32)

def main(args=None):
    rclpy.init(args=args)
    bridge = IsaacSimROS2Bridge()
    rclpy.spin(bridge)
    bridge.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Key Takeaways

- Isaac Sim provides photorealistic simulation with RTX rendering
- Domain randomization improves sim-to-real transfer
- Synthetic datasets can be generated at scale
- ROS 2 integration enables seamless robot control
- Physics accuracy enables realistic behavior prediction

## Practice Exercises

1. Create a photorealistic Isaac Sim environment
2. Implement domain randomization for 5 physics parameters
3. Generate a synthetic dataset with 10,000 frames
4. Integrate Isaac Sim with ROS 2 for real-time control
