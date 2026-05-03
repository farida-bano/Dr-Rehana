---
sidebar_position: 12
---

# Chapter 12: Deployment & Sim-to-Real Transfer

## Learning Objectives

By the end of this chapter, you will be able to:
- Prepare robots for real-world deployment
- Implement sim-to-real transfer techniques
- Handle real-world uncertainties
- Monitor and debug deployed systems
- Optimize performance in production

## Sim-to-Real Transfer

### Domain Randomization

Domain randomization varies simulation parameters to improve generalization to the real world.

```python
import random
import numpy as np

class SimToRealTransfer:
    def __init__(self):
        self.randomization_config = {
            'friction': (0.3, 1.0),
            'restitution': (0.0, 0.5),
            'mass_scale': (0.8, 1.2),
            'gravity': (8.0, 10.0),
            'sensor_noise': (0.0, 0.05),
            'actuator_delay': (0.0, 0.05),
            'lighting': (0.5, 2.0),
        }
    
    def randomize_environment(self, env):
        friction = random.uniform(*self.randomization_config['friction'])
        restitution = random.uniform(*self.randomization_config['restitution'])
        mass_scale = random.uniform(*self.randomization_config['mass_scale'])
        gravity = random.uniform(*self.randomization_config['gravity'])
        
        env.set_friction(friction)
        env.set_restitution(restitution)
        env.set_mass_scale(mass_scale)
        env.set_gravity(gravity)
        
        return {
            'friction': friction,
            'restitution': restitution,
            'mass_scale': mass_scale,
            'gravity': gravity,
        }
    
    def randomize_sensors(self, sensor_data):
        noise_std = random.uniform(*self.randomization_config['sensor_noise'])
        noise = np.random.normal(0, noise_std, sensor_data.shape)
        return sensor_data + noise
    
    def randomize_actuators(self, command):
        delay = random.uniform(*self.randomization_config['actuator_delay'])
        return command, delay
```

### System Identification

```python
class SystemIdentification:
    def __init__(self):
        self.parameters = {}
    
    def identify_dynamics(self, trajectories):
        for trajectory in trajectories:
            states = trajectory['states']
            actions = trajectory['actions']
            
            for i in range(len(states) - 1):
                state = states[i]
                action = actions[i]
                next_state = states[i + 1]
                
                self.fit_dynamics_model(state, action, next_state)
    
    def fit_dynamics_model(self, state, action, next_state):
        dt = 0.01
        acceleration = (next_state - state) / dt
        
        mass = self.estimate_mass(action, acceleration)
        friction = self.estimate_friction(state, action)
        
        self.parameters['mass'] = mass
        self.parameters['friction'] = friction
    
    def estimate_mass(self, force, acceleration):
        if np.linalg.norm(acceleration) > 0:
            return np.linalg.norm(force) / np.linalg.norm(acceleration)
        return 1.0
    
    def estimate_friction(self, velocity, force):
        if np.linalg.norm(velocity) > 0:
            return np.linalg.norm(force) / np.linalg.norm(velocity)
        return 0.1
```

## Real-World Deployment

### Safety Checks

```python
class SafetyMonitor:
    def __init__(self):
        self.limits = {
            'joint_velocity': 2.0,
            'joint_torque': 100.0,
            'end_effector_force': 500.0,
            'temperature': 80.0,
        }
        self.violations = []
    
    def check_safety(self, robot_state):
        safe = True
        
        if not self.check_joint_limits(robot_state):
            safe = False
            self.violations.append('Joint limits exceeded')
        
        if not self.check_velocity_limits(robot_state):
            safe = False
            self.violations.append('Velocity limits exceeded')
        
        if not self.check_torque_limits(robot_state):
            safe = False
            self.violations.append('Torque limits exceeded')
        
        if not self.check_temperature(robot_state):
            safe = False
            self.violations.append('Temperature too high')
        
        return safe
    
    def check_joint_limits(self, robot_state):
        for joint in robot_state['joints']:
            if abs(joint['position']) > joint['limit']:
                return False
        return True
    
    def check_velocity_limits(self, robot_state):
        for joint in robot_state['joints']:
            if abs(joint['velocity']) > self.limits['joint_velocity']:
                return False
        return True
    
    def check_torque_limits(self, robot_state):
        for joint in robot_state['joints']:
            if abs(joint['torque']) > self.limits['joint_torque']:
                return False
        return True
    
    def check_temperature(self, robot_state):
        for motor in robot_state['motors']:
            if motor['temperature'] > self.limits['temperature']:
                return False
        return True
    
    def emergency_stop(self):
        return {'all_joints': 0.0}
```

### Monitoring and Logging

```python
import logging
import json
from datetime import datetime

class RobotMonitor:
    def __init__(self, log_dir='logs'):
        self.log_dir = log_dir
        self.logger = self.setup_logger()
        self.metrics = {}
        self.start_time = datetime.now()
    
    def setup_logger(self):
        logger = logging.getLogger('robot_monitor')
        handler = logging.FileHandler(f'{self.log_dir}/robot.log')
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
    
    def log_state(self, robot_state):
        self.logger.info(f'State: {json.dumps(robot_state, default=str)}')
    
    def log_error(self, error_msg):
        self.logger.error(error_msg)
    
    def log_performance(self, metric_name, value):
        if metric_name not in self.metrics:
            self.metrics[metric_name] = []
        self.metrics[metric_name].append({
            'timestamp': datetime.now().isoformat(),
            'value': value,
        })
    
    def save_metrics(self):
        with open(f'{self.log_dir}/metrics.json', 'w') as f:
            json.dump(self.metrics, f, indent=2)
    
    def get_uptime(self):
        return (datetime.now() - self.start_time).total_seconds()
```

### Graceful Degradation

```python
class RobotController:
    def __init__(self):
        self.safety_monitor = SafetyMonitor()
        self.monitor = RobotMonitor()
        self.performance_mode = 'normal'
    
    def control_loop(self, sensor_data, desired_action):
        robot_state = self.parse_sensor_data(sensor_data)
        
        if not self.safety_monitor.check_safety(robot_state):
            self.monitor.log_error('Safety violation detected')
            self.performance_mode = 'safe'
            return self.safety_monitor.emergency_stop()
        
        if self.performance_mode == 'safe':
            action = self.reduce_action(desired_action)
        else:
            action = desired_action
        
        self.monitor.log_state(robot_state)
        self.monitor.log_performance('action_magnitude', np.linalg.norm(action))
        
        return action
    
    def reduce_action(self, action):
        return action * 0.5
    
    def parse_sensor_data(self, sensor_data):
        return {}
```

## Performance Optimization

### Latency Reduction

```python
class LatencyOptimizer:
    def __init__(self):
        self.latency_measurements = []
    
    def measure_latency(self, start_time, end_time):
        latency = (end_time - start_time).total_seconds() * 1000
        self.latency_measurements.append(latency)
        return latency
    
    def get_statistics(self):
        if not self.latency_measurements:
            return None
        
        return {
            'mean': np.mean(self.latency_measurements),
            'std': np.std(self.latency_measurements),
            'min': np.min(self.latency_measurements),
            'max': np.max(self.latency_measurements),
            'p95': np.percentile(self.latency_measurements, 95),
            'p99': np.percentile(self.latency_measurements, 99),
        }
    
    def optimize_pipeline(self):
        stats = self.get_statistics()
        if stats and stats['p99'] > 50:
            return 'Reduce computation or increase hardware'
        return 'Performance acceptable'
```

### Resource Management

```python
class ResourceManager:
    def __init__(self):
        self.cpu_usage = []
        self.memory_usage = []
        self.gpu_usage = []
    
    def monitor_resources(self):
        import psutil
        
        cpu = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory().percent
        
        self.cpu_usage.append(cpu)
        self.memory_usage.append(memory)
        
        if cpu > 80:
            return 'CPU overloaded'
        if memory > 80:
            return 'Memory overloaded'
        
        return 'Resources OK'
    
    def optimize_resources(self):
        if np.mean(self.cpu_usage[-10:]) > 70:
            return 'Reduce update frequency or offload computation'
        return 'No optimization needed'
```

## Key Takeaways

- Domain randomization improves sim-to-real transfer
- System identification captures real-world dynamics
- Safety monitoring prevents damage and injury
- Graceful degradation maintains functionality under constraints
- Performance optimization ensures real-time operation

## Practice Exercises

1. Implement domain randomization for 5 parameters
2. Identify system dynamics from real robot data
3. Design a safety monitoring system
4. Measure and optimize latency
5. Deploy a trained policy to real hardware
