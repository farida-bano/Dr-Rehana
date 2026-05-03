---
sidebar_position: 7
---

# Chapter 7: Perception Systems

## Learning Objectives

By the end of this chapter, you will be able to:
- Implement VSLAM (Visual Simultaneous Localization and Mapping)
- Build object detection pipelines
- Perform sensor fusion
- Reconstruct 3D environments
- Process real-time sensor data

## Visual SLAM (VSLAM)

VSLAM enables robots to build maps while localizing themselves in unknown environments.

### ORB-SLAM3 Implementation

```python
import cv2
import numpy as np
from collections import defaultdict

class ORBFeatureDetector:
    def __init__(self, n_features=500):
        self.orb = cv2.ORB_create(nfeatures=n_features)
    
    def detect_and_compute(self, image):
        keypoints, descriptors = self.orb.detectAndCompute(image, None)
        return keypoints, descriptors

class VLAMTracker:
    def __init__(self):
        self.feature_detector = ORBFeatureDetector()
        self.matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        self.pose_history = []
        self.map_points = []
    
    def track_frame(self, image, previous_image=None):
        keypoints, descriptors = self.feature_detector.detect_and_compute(image)
        
        if previous_image is None:
            return keypoints, descriptors
        
        prev_keypoints, prev_descriptors = self.feature_detector.detect_and_compute(previous_image)
        
        matches = self.matcher.match(prev_descriptors, descriptors)
        matches = sorted(matches, key=lambda x: x.distance)
        
        # Estimate motion from matches
        if len(matches) > 10:
            src_pts = np.float32([prev_keypoints[m.queryIdx].pt for m in matches]).reshape(-1, 1, 2)
            dst_pts = np.float32([keypoints[m.trainIdx].pt for m in matches]).reshape(-1, 1, 2)
            
            H, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
            
            return keypoints, descriptors, H
        
        return keypoints, descriptors, None
```

## Object Detection

### YOLO-based Detection

```python
import torch
from torchvision.models import detection

class ObjectDetector:
    def __init__(self, model_name='fasterrcnn_resnet50_fpn'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = detection.fasterrcnn_resnet50_fpn(pretrained=True)
        self.model.to(self.device)
        self.model.eval()
    
    def detect(self, image):
        image_tensor = torch.from_numpy(image).permute(2, 0, 1).float() / 255.0
        image_tensor = image_tensor.unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            predictions = self.model(image_tensor)
        
        detections = []
        for pred in predictions:
            boxes = pred['boxes'].cpu().numpy()
            scores = pred['scores'].cpu().numpy()
            labels = pred['labels'].cpu().numpy()
            
            for box, score, label in zip(boxes, scores, labels):
                if score > 0.5:
                    detections.append({
                        'bbox': box,
                        'score': score,
                        'label': label,
                    })
        
        return detections
```

## Sensor Fusion

Combining multiple sensors for robust perception.

```python
import numpy as np
from scipy.linalg import block_diag

class ExtendedKalmanFilter:
    def __init__(self, state_dim, measurement_dim):
        self.x = np.zeros(state_dim)
        self.P = np.eye(state_dim)
        self.Q = np.eye(state_dim) * 0.01
        self.R = np.eye(measurement_dim) * 0.1
    
    def predict(self, F, u=None):
        self.x = F @ self.x
        if u is not None:
            self.x += u
        self.P = F @ self.P @ F.T + self.Q
    
    def update(self, z, H):
        y = z - H @ self.x
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        
        self.x = self.x + K @ y
        self.P = (np.eye(len(self.x)) - K @ H) @ self.P
        
        return self.x

class SensorFusion:
    def __init__(self):
        self.ekf = ExtendedKalmanFilter(state_dim=6, measurement_dim=3)
    
    def fuse_imu_lidar(self, imu_data, lidar_data):
        # IMU prediction
        F = np.eye(6)
        F[0:3, 3:6] = np.eye(3) * 0.01
        self.ekf.predict(F)
        
        # LiDAR update
        H = np.hstack([np.eye(3), np.zeros((3, 3))])
        z = lidar_data['position']
        
        state = self.ekf.update(z, H)
        return state
```

## 3D Reconstruction

```python
import open3d as o3d

class PointCloudReconstructor:
    def __init__(self):
        self.point_cloud = o3d.geometry.PointCloud()
    
    def add_depth_frame(self, depth_image, intrinsics):
        depth = o3d.geometry.Image(depth_image)
        pcd = o3d.geometry.PointCloud.create_from_depth_image(
            depth, intrinsics)
        
        self.point_cloud += pcd
    
    def downsample(self, voxel_size=0.05):
        self.point_cloud = self.point_cloud.voxel_down_sample(voxel_size)
    
    def remove_outliers(self, nb_neighbors=20, std_ratio=2.0):
        self.point_cloud, _ = self.point_cloud.remove_statistical_outlier(
            nb_neighbors=nb_neighbors, std_ratio=std_ratio)
    
    def get_mesh(self):
        mesh, _ = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
            self.point_cloud, depth=9)
        return mesh
```

## ROS 2 Perception Pipeline

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, PointCloud2
from std_msgs.msg import Header
from cv_bridge import CvBridge
import numpy as np

class PerceptionPipeline(Node):
    def __init__(self):
        super().__init__('perception_pipeline')
        
        self.image_sub = self.create_subscription(
            Image, 'camera/image_raw', self.image_callback, 10)
        self.depth_sub = self.create_subscription(
            Image, 'camera/depth', self.depth_callback, 10)
        
        self.detection_pub = self.create_publisher(Image, 'detections', 10)
        self.pointcloud_pub = self.create_publisher(PointCloud2, 'point_cloud', 10)
        
        self.bridge = CvBridge()
        self.detector = ObjectDetector()
        self.reconstructor = PointCloudReconstructor()
    
    def image_callback(self, msg):
        image = self.bridge.imgmsg_to_cv2(msg, "bgr8")
        detections = self.detector.detect(image)
        
        # Draw detections
        for det in detections:
            x1, y1, x2, y2 = det['bbox'].astype(int)
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        result_msg = self.bridge.cv2_to_imgmsg(image, "bgr8")
        self.detection_pub.publish(result_msg)
    
    def depth_callback(self, msg):
        depth = self.bridge.imgmsg_to_cv2(msg, "32FC1")
        intrinsics = o3d.camera.PinholeCameraIntrinsic(
            640, 480, 640, 640, 320, 240)
        
        self.reconstructor.add_depth_frame(depth, intrinsics)

def main(args=None):
    rclpy.init(args=args)
    pipeline = PerceptionPipeline()
    rclpy.spin(pipeline)
    pipeline.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Key Takeaways

- VSLAM enables simultaneous mapping and localization
- Object detection provides semantic understanding
- Sensor fusion combines multiple modalities for robustness
- 3D reconstruction builds environmental models
- ROS 2 integration enables real-time perception

## Practice Exercises

1. Implement VSLAM tracking on video sequences
2. Build an object detection pipeline with confidence filtering
3. Fuse IMU and LiDAR data with EKF
4. Reconstruct 3D scenes from depth images
