---
sidebar_position: 2
---

# Chapter 2: The Hardware Stack

## Learning Objectives

By the end of this chapter, you will be able to:
- Understand the complete hardware stack required for physical AI development
- Specify appropriate workstation configurations for simulation and development
- Evaluate edge computing platforms like NVIDIA Jetson
- Identify and select appropriate sensors for robotic applications
- Compare different humanoid robot platforms and their capabilities

## Overview: The Hardware Stack

The hardware stack for physical AI consists of multiple layers:

```
┌─────────────────────────────────────┐
│   Robot Platforms (Hardware)        │
├─────────────────────────────────────┤
│   Actuators & Sensors               │
├─────────────────────────────────────┤
│   Edge Computing (Jetson, etc.)     │
├─────────────────────────────────────┤
│   Development Workstation           │
├─────────────────────────────────────┤
│   Simulation Infrastructure         │
└─────────────────────────────────────┘
```

## Development Workstation Specifications

### Minimum Requirements

For running simulations and development:

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | Intel i5 / AMD Ryzen 5 | Intel i7/i9 or AMD Ryzen 7/9 |
| RAM | 16 GB | 32 GB or more |
| GPU | NVIDIA GTX 1660 | NVIDIA RTX 3080 / RTX 4090 |
| Storage | 256 GB SSD | 1 TB NVMe SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### GPU Considerations

NVIDIA GPUs are strongly recommended for:
- Physics simulation acceleration (Gazebo, Isaac Sim)
- Deep learning model training
- Real-time rendering

**Supported GPU Architectures:**
- Ampere (RTX 30 series)
- Ada (RTX 40 series)
- Hopper (H100, L40S)

### Network Setup

- **Ethernet**: Gigabit minimum for ROS 2 communication
- **WiFi**: 5GHz or 6GHz for wireless robot communication
- **Latency**: Less than 10ms for real-time control

## Edge Computing with NVIDIA Jetson Platforms

Edge computing brings AI inference and control to the robot itself, reducing latency and network dependency.

### Jetson Platform Lineup

| Platform | GPU Cores | RAM | Power | Use Case |
|----------|-----------|-----|-------|----------|
| Jetson Nano | 128 | 4 GB | 5W | Lightweight inference |
| Jetson Orin Nano | 1024 | 8 GB | 5-15W | Entry-level robotics |
| Jetson Orin NX | 1024 | 8 GB | 10-25W | Mobile robots |
| Jetson Orin AGX | 12 cores | 64 GB | 60W | Humanoid robots |

### Jetson Setup

```bash
# Flash Jetson with JetPack (includes CUDA, cuDNN, TensorRT)
# Download from: https://developer.nvidia.com/embedded/jetpack

# Install ROS 2 on Jetson
sudo apt update
sudo apt install ros-humble-desktop

# Verify GPU access
nvidia-smi
```

### Performance Considerations

- **Thermal Management**: Jetson devices can throttle under sustained load
- **Power Budget**: Plan for adequate power supply (especially Orin AGX)
- **Storage**: Use fast NVMe SSDs for model loading
- **Network**: Ensure stable connection to development workstation

## Sensor Systems

### Vision Sensors

#### RGB Cameras
- **Resolution**: 1080p to 4K
- **Frame Rate**: 30-120 fps
- **Use Cases**: Object detection, semantic segmentation
- **Examples**: Intel RealSense D435, Basler ace2

#### Depth Cameras
- **Technology**: Stereo, ToF (Time-of-Flight), or Structured Light
- **Range**: 0.1m to 10m depending on technology
- **Use Cases**: 3D reconstruction, obstacle detection
- **Examples**: Intel RealSense D455, Azure Kinect

#### LiDAR Sensors
- **Type**: 2D (planar) or 3D (volumetric)
- **Range**: 5m to 100m+
- **Accuracy**: ±2-5cm
- **Use Cases**: SLAM, navigation, obstacle avoidance
- **Examples**: Velodyne VLP-16, Livox Mid-360

### Inertial Measurement Units (IMUs)

**Specifications:**
- **Accelerometers**: ±2g to ±16g range
- **Gyroscopes**: ±250°/s to ±2000°/s range
- **Magnetometers**: For heading estimation
- **Sampling Rate**: 100-1000 Hz

**Applications:**
- Balance and stability control
- Orientation estimation
- Fall detection

### Force/Torque Sensors

**Specifications:**
- **Force Range**: 0-500 N typical
- **Torque Range**: 0-50 Nm typical
- **Sampling Rate**: 1000 Hz+

**Applications:**
- Gripper control
- Manipulation force feedback
- Contact detection

### Sensor Fusion

Combining multiple sensors provides robust perception:

```python
# Example: Fusing IMU and LiDAR for localization
from sensor_fusion import EKF

ekf = EKF()
while True:
    imu_data = imu.read()
    lidar_data = lidar.read()
    
    # Predict step with IMU
    ekf.predict(imu_data)
    
    # Update step with LiDAR
    ekf.update(lidar_data)
    
    pose = ekf.get_state()
```

## Robot Platforms Comparison

### Boston Dynamics Atlas

- **Height**: 1.5m
- **Weight**: 80 kg
- **Actuators**: 28 electric motors
- **Sensors**: Multiple cameras, IMU, force sensors
- **Capabilities**: Bipedal locomotion, manipulation, dynamic movement
- **Status**: Research platform, limited availability

### Tesla Optimus

- **Height**: 1.73m
- **Weight**: 57 kg
- **Actuators**: 40 electric motors
- **Focus**: General-purpose manufacturing tasks
- **Status**: Early production, scaling phase

### Unitree H1

- **Height**: 1.85m
- **Weight**: 52 kg
- **Actuators**: 30 electric motors
- **Sensors**: Cameras, IMU, force sensors
- **Capabilities**: Bipedal walking, stair climbing, manipulation
- **Status**: Commercial availability

### Comparison Table

| Feature | Atlas | Optimus | H1 |
|---------|-------|---------|-----|
| Bipedal Walking | ✓ | ✓ | ✓ |
| Manipulation | ✓ | ✓ | ✓ |
| Outdoor Capable | ✓ | Limited | Limited |
| Commercial | ✗ | In Progress | ✓ |
| Research Access | Limited | Limited | ✓ |

## Actuator Technologies

### Electric Motors

**Advantages:**
- Precise control
- Quiet operation
- Energy efficient
- Easy integration with electronics

**Types:**
- Brushless DC (BLDC)
- Stepper motors
- Servo motors

### Hydraulic Actuators

**Advantages:**
- High power density
- Smooth motion
- Good force control

**Disadvantages:**
- Maintenance intensive
- Fluid leaks
- Noise and heat

### Series Elastic Actuators (SEA)

**Characteristics:**
- Spring between motor and load
- Enables force control
- Safer human interaction
- Better compliance

## Power Systems

### Battery Technologies

| Type | Energy Density | Cycle Life | Cost | Safety |
|------|----------------|-----------|------|--------|
| Li-Po | High | 500-1000 | Low | Requires care |
| Li-Ion | High | 1000-3000 | Medium | Good |
| LiFePO4 | Medium | 3000-5000 | High | Excellent |

### Power Budget Calculation

```
Total Power = Motor Power + Sensor Power + Compute Power + Margin

Example for Humanoid:
- Motors: 500W (peak), 200W (average)
- Sensors: 50W
- Jetson Orin AGX: 60W
- Margin (20%): 62W
─────────────────────
Total: ~372W average, ~612W peak
```

### Battery Selection

For a 2-hour operation:
- Energy needed: 372W × 2h = 744 Wh
- Select: 800 Wh battery (accounting for efficiency losses)

## Connectivity and Communication

### ROS 2 Network Setup

```bash
# Set ROS domain ID (isolate multiple robots)
export ROS_DOMAIN_ID=42

# Configure network for multiple machines
export ROS_LOCALHOST_ONLY=0

# Use Fast DDS for better network performance
export RMW_IMPLEMENTATION=rmw_fastrtps_cpp
```

### Wireless Considerations

- **5GHz WiFi**: Lower latency, shorter range
- **Ethernet**: Most reliable for development
- **LTE/5G**: For remote operation (high latency)

## Setting Up Your Development Environment

### Step 1: Install Ubuntu 22.04 LTS

```bash
# Download from: https://ubuntu.com/download/desktop
# Create bootable USB and install
```

### Step 2: Install NVIDIA Drivers

```bash
sudo apt update
sudo apt install nvidia-driver-535
sudo reboot
```

### Step 3: Install CUDA and cuDNN

```bash
# Download from NVIDIA website
# Follow installation guide for your GPU
```

### Step 4: Install ROS 2 Humble

```bash
sudo apt install ros-humble-desktop
source /opt/ros/humble/setup.bash
```

### Step 5: Install Simulation Tools

```bash
sudo apt install gazebo ros-humble-gazebo-*
```

## Troubleshooting Common Hardware Issues

### GPU Not Detected

```bash
# Check GPU
nvidia-smi

# If not found, reinstall drivers
sudo apt remove nvidia-*
sudo apt install nvidia-driver-535
```

### ROS 2 Network Issues

```bash
# Check network connectivity
ping <robot_ip>

# Verify ROS 2 discovery
ros2 daemon status
ros2 node list
```

### Sensor Connection Problems

```bash
# List USB devices
lsusb

# Check device permissions
ls -la /dev/ttyUSB*
sudo usermod -a -G dialout $USER
```

## Key Takeaways

- A well-configured workstation is essential for development and simulation
- Edge computing platforms like Jetson bring AI to the robot
- Sensor fusion combines multiple sensors for robust perception
- Different robot platforms have different capabilities and trade-offs
- Proper power budgeting ensures reliable robot operation
- Network setup is critical for multi-machine ROS 2 systems

## Further Reading

- NVIDIA Jetson Documentation: https://docs.nvidia.com/jetson/
- ROS 2 Hardware Acceleration: https://docs.ros.org/en/humble/Concepts/About-Hardware-Acceleration.html
- Sensor Fusion Techniques: Thrun, S., Burgard, W., & Fox, D. (2005). *Probabilistic Robotics*

## Practice Exercises

1. **Hardware Audit**: Document your current workstation specifications and identify upgrade priorities.
2. **Power Calculation**: Calculate the power budget for a robot with 20 motors (50W each), 5 sensors (10W each), and a Jetson Orin NX.
3. **Sensor Selection**: Choose appropriate sensors for a robot that needs to navigate indoors and manipulate objects.
4. **Research**: Compare the specifications of three different humanoid robot platforms and create a comparison matrix.