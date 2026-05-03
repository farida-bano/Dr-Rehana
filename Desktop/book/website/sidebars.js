// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Part 1: Foundations',
      items: [
        'book-chapters/ch01_introduction',
        'book-chapters/ch02_hardware_stack',
        'book-chapters/ch03_ros2_fundamentals',
        'book-chapters/ch04_robot_description_kinematics',
      ],
    },
    {
      type: 'category',
      label: 'Part 2: Simulation & Perception',
      items: [
        'book-chapters/ch05_gazebo_simulation',
        'book-chapters/ch06_isaac_sim',
        'book-chapters/ch07_perception_systems',
        'book-chapters/ch08_navigation_motion_planning',
      ],
    },
    {
      type: 'category',
      label: 'Part 3: AI Integration & Deployment',
      items: [
        'book-chapters/ch09_language_task_planning',
        'book-chapters/ch10_cognitive_skill_acquisition',
        'book-chapters/ch11_capstone_projects',
        'book-chapters/ch12_deployment_sim_to_real',
        'book-chapters/ch13_future_ethical_ai',
      ],
    },
  ],
};

export default sidebars;
