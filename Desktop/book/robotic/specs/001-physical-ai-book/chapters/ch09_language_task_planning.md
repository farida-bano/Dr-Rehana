---
sidebar_position: 9
---

# Chapter 9: Language Interfaces & Task Planning

## Learning Objectives

By the end of this chapter, you will be able to:
- Integrate large language models with robots
- Parse natural language commands
- Generate task plans from language
- Implement human-robot interaction
- Build conversational interfaces

## Language Models for Robotics

### LLM Integration

```python
import openai
import json

class RobotLanguageInterface:
    def __init__(self, api_key):
        openai.api_key = api_key
        self.system_prompt = """You are a robot control system. 
        Convert natural language commands into structured task plans.
        Return JSON with task sequences."""
    
    def parse_command(self, user_input):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7
        )
        
        try:
            task_plan = json.loads(response['choices'][0]['message']['content'])
            return task_plan
        except json.JSONDecodeError:
            return None
    
    def execute_plan(self, task_plan):
        for task in task_plan.get('tasks', []):
            action = task.get('action')
            parameters = task.get('parameters', {})
            
            self.execute_action(action, parameters)
    
    def execute_action(self, action, parameters):
        if action == 'move':
            self.move_to(parameters['x'], parameters['y'])
        elif action == 'grasp':
            self.grasp_object(parameters['object_id'])
        elif action == 'place':
            self.place_object(parameters['object_id'], parameters['location'])
```

### Semantic Parsing

```python
import spacy
from typing import Dict, List

class SemanticParser:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.action_verbs = {
            'move': ['go', 'move', 'navigate', 'walk'],
            'grasp': ['grab', 'pick', 'grasp', 'hold'],
            'place': ['put', 'place', 'set', 'drop'],
            'look': ['see', 'look', 'observe', 'watch'],
        }
    
    def parse(self, text: str) -> Dict:
        doc = self.nlp(text)
        
        action = self.extract_action(doc)
        objects = self.extract_objects(doc)
        locations = self.extract_locations(doc)
        
        return {
            'action': action,
            'objects': objects,
            'locations': locations,
            'raw_text': text,
        }
    
    def extract_action(self, doc) -> str:
        for token in doc:
            if token.pos_ == "VERB":
                for action, verbs in self.action_verbs.items():
                    if token.lemma_ in verbs:
                        return action
        return None
    
    def extract_objects(self, doc) -> List[str]:
        objects = []
        for token in doc:
            if token.pos_ == "NOUN":
                objects.append(token.text)
        return objects
    
    def extract_locations(self, doc) -> List[str]:
        locations = []
        for token in doc:
            if token.pos_ == "PROPN" or token.dep_ == "pobj":
                locations.append(token.text)
        return locations
```

## Task Planning

### Hierarchical Task Network (HTN)

```python
class TaskNetwork:
    def __init__(self):
        self.tasks = {}
        self.methods = {}
    
    def register_task(self, name, preconditions, effects):
        self.tasks[name] = {
            'preconditions': preconditions,
            'effects': effects,
        }
    
    def register_method(self, task_name, method_name, subtasks, constraints):
        if task_name not in self.methods:
            self.methods[task_name] = []
        
        self.methods[task_name].append({
            'name': method_name,
            'subtasks': subtasks,
            'constraints': constraints,
        })
    
    def plan(self, goal_task, state):
        if goal_task not in self.tasks:
            return None
        
        if self.check_preconditions(goal_task, state):
            return [goal_task]
        
        if goal_task in self.methods:
            for method in self.methods[goal_task]:
                plan = self.decompose(method, state)
                if plan:
                    return plan
        
        return None
    
    def decompose(self, method, state):
        plan = []
        for subtask in method['subtasks']:
            subplan = self.plan(subtask, state)
            if subplan:
                plan.extend(subplan)
            else:
                return None
        return plan
    
    def check_preconditions(self, task, state):
        preconditions = self.tasks[task]['preconditions']
        for condition in preconditions:
            if condition not in state:
                return False
        return True
```

## Human-Robot Interaction

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Twist

class HumanRobotInterface(Node):
    def __init__(self):
        super().__init__('human_robot_interface')
        
        self.command_sub = self.create_subscription(
            String, 'voice_commands', self.command_callback, 10)
        
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.feedback_pub = self.create_publisher(String, 'robot_feedback', 10)
        
        self.parser = SemanticParser()
        self.language_interface = RobotLanguageInterface(api_key='your-key')
    
    def command_callback(self, msg):
        command = msg.data
        self.get_logger().info(f'Received command: {command}')
        
        parsed = self.parser.parse(command)
        self.get_logger().info(f'Parsed: {parsed}')
        
        task_plan = self.language_interface.parse_command(command)
        if task_plan:
            self.execute_plan(task_plan)
            feedback = f"Executing: {task_plan}"
        else:
            feedback = "Could not understand command"
        
        feedback_msg = String()
        feedback_msg.data = feedback
        self.feedback_pub.publish(feedback_msg)
    
    def execute_plan(self, task_plan):
        for task in task_plan.get('tasks', []):
            action = task.get('action')
            if action == 'move':
                self.move(task.get('parameters', {}))
    
    def move(self, params):
        twist = Twist()
        twist.linear.x = params.get('velocity', 0.5)
        self.cmd_vel_pub.publish(twist)

def main(args=None):
    rclpy.init(args=args)
    interface = HumanRobotInterface()
    rclpy.spin(interface)
    interface.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Conversational Interfaces

```python
class ConversationalAgent:
    def __init__(self):
        self.conversation_history = []
        self.context = {}
    
    def process_input(self, user_input):
        self.conversation_history.append({
            'role': 'user',
            'content': user_input
        })
        
        response = self.generate_response(user_input)
        
        self.conversation_history.append({
            'role': 'assistant',
            'content': response
        })
        
        return response
    
    def generate_response(self, user_input):
        messages = [
            {"role": "system", "content": "You are a helpful robot assistant."},
        ] + self.conversation_history
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7
        )
        
        return response['choices'][0]['message']['content']
    
    def get_context(self):
        return self.context
    
    def update_context(self, key, value):
        self.context[key] = value
```

## Key Takeaways

- Language models enable natural human-robot interaction
- Semantic parsing extracts structured information from text
- Hierarchical task networks decompose complex goals
- Conversational interfaces provide intuitive control
- Integration with ROS 2 enables real-time execution

## Practice Exercises

1. Build a semantic parser for robot commands
2. Integrate GPT-4 with a robot control system
3. Implement hierarchical task planning
4. Create a conversational robot interface
5. Test natural language understanding on diverse commands
