---
id: ch10_cognitive_skill_acquisition
sidebar_position: 10
---

# Chapter 10: Cognitive Architectures & Skill Acquisition

## Learning Objectives

By the end of this chapter, you will be able to:
- Design cognitive architectures for robots
- Implement reinforcement learning for skill acquisition
- Learn from human demonstrations
- Build hierarchical skill libraries
- Evaluate learning performance

## Cognitive Architectures

### SOAR-inspired Architecture

```python
class CognitiveArchitecture:
    def __init__(self):
        self.perception = PerceptionModule()
        self.memory = MemoryModule()
        self.decision_making = DecisionMakingModule()
        self.action_execution = ActionExecutionModule()
    
    def cognitive_cycle(self, sensor_data):
        # Perception: Process sensor data
        perceived_state = self.perception.process(sensor_data)
        
        # Memory: Retrieve relevant knowledge
        relevant_knowledge = self.memory.retrieve(perceived_state)
        
        # Decision Making: Choose action
        action = self.decision_making.decide(perceived_state, relevant_knowledge)
        
        # Action Execution: Execute and monitor
        result = self.action_execution.execute(action)
        
        # Learning: Update memory
        self.memory.update(perceived_state, action, result)
        
        return action, result

class MemoryModule:
    def __init__(self):
        self.episodic_memory = []
        self.semantic_memory = {}
        self.procedural_memory = {}
    
    def retrieve(self, state):
        similar_episodes = self.find_similar_episodes(state)
        relevant_concepts = self.find_relevant_concepts(state)
        relevant_skills = self.find_relevant_skills(state)
        
        return {
            'episodes': similar_episodes,
            'concepts': relevant_concepts,
            'skills': relevant_skills,
        }
    
    def update(self, state, action, result):
        self.episodic_memory.append({
            'state': state,
            'action': action,
            'result': result,
        })
    
    def find_similar_episodes(self, state):
        similar = []
        for episode in self.episodic_memory:
            similarity = self.compute_similarity(state, episode['state'])
            if similarity > 0.7:
                similar.append(episode)
        return similar
    
    def compute_similarity(self, state1, state2):
        return 1.0 - (sum(abs(a - b) for a, b in zip(state1, state2)) / len(state1))
```

## Reinforcement Learning

### Deep Q-Learning

```python
import torch
import torch.nn as nn
import numpy as np
from collections import deque

class DQNAgent:
    def __init__(self, state_dim, action_dim, learning_rate=0.001):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.learning_rate = learning_rate
        
        self.q_network = self.build_network()
        self.target_network = self.build_network()
        self.optimizer = torch.optim.Adam(self.q_network.parameters(), lr=learning_rate)
        
        self.replay_buffer = deque(maxlen=10000)
        self.epsilon = 1.0
        self.epsilon_decay = 0.995
    
    def build_network(self):
        return nn.Sequential(
            nn.Linear(self.state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, self.action_dim)
        )
    
    def select_action(self, state):
        if np.random.rand() < self.epsilon:
            return np.random.randint(self.action_dim)
        
        state_tensor = torch.FloatTensor(state).unsqueeze(0)
        q_values = self.q_network(state_tensor)
        return q_values.argmax(dim=1).item()
    
    def store_experience(self, state, action, reward, next_state, done):
        self.replay_buffer.append((state, action, reward, next_state, done))
    
    def train(self, batch_size=32):
        if len(self.replay_buffer) < batch_size:
            return
        
        batch = np.random.choice(len(self.replay_buffer), batch_size, replace=False)
        states, actions, rewards, next_states, dones = zip(*[self.replay_buffer[i] for i in batch])
        
        states = torch.FloatTensor(np.array(states))
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(np.array(next_states))
        dones = torch.FloatTensor(dones)
        
        q_values = self.q_network(states).gather(1, actions.unsqueeze(1))
        next_q_values = self.target_network(next_states).max(1)[0]
        target_q_values = rewards + (1 - dones) * 0.99 * next_q_values
        
        loss = nn.MSELoss()(q_values.squeeze(), target_q_values)
        
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()
        
        self.epsilon *= self.epsilon_decay
        
        return loss.item()
```

### Policy Gradient Methods

```python
class PolicyGradientAgent:
    def __init__(self, state_dim, action_dim, learning_rate=0.001):
        self.policy_network = nn.Sequential(
            nn.Linear(state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, action_dim),
            nn.Softmax(dim=1)
        )
        self.optimizer = torch.optim.Adam(self.policy_network.parameters(), lr=learning_rate)
    
    def select_action(self, state):
        state_tensor = torch.FloatTensor(state).unsqueeze(0)
        action_probs = self.policy_network(state_tensor)
        action = torch.multinomial(action_probs, 1).item()
        return action, action_probs
    
    def train(self, trajectory, rewards):
        policy_loss = 0
        
        for t, (state, action, action_probs) in enumerate(trajectory):
            discounted_reward = sum(rewards[t:])
            
            log_prob = torch.log(action_probs[0, action])
            policy_loss -= log_prob * discounted_reward
        
        self.optimizer.zero_grad()
        policy_loss.backward()
        self.optimizer.step()
        
        return policy_loss.item()
```

## Learning from Demonstration

```python
class LearningFromDemonstration:
    def __init__(self, state_dim, action_dim):
        self.behavior_cloning_model = nn.Sequential(
            nn.Linear(state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, action_dim)
        )
        self.optimizer = torch.optim.Adam(self.behavior_cloning_model.parameters())
    
    def collect_demonstrations(self, num_episodes=10):
        demonstrations = []
        
        for episode in range(num_episodes):
            trajectory = self.record_human_demonstration()
            demonstrations.append(trajectory)
        
        return demonstrations
    
    def behavior_cloning(self, demonstrations):
        for epoch in range(100):
            total_loss = 0
            
            for trajectory in demonstrations:
                for state, action in trajectory:
                    state_tensor = torch.FloatTensor(state).unsqueeze(0)
                    action_tensor = torch.LongTensor([action])
                    
                    predicted_action = self.behavior_cloning_model(state_tensor)
                    loss = nn.CrossEntropyLoss()(predicted_action, action_tensor)
                    
                    self.optimizer.zero_grad()
                    loss.backward()
                    self.optimizer.step()
                    
                    total_loss += loss.item()
            
            if epoch % 10 == 0:
                print(f"Epoch {epoch}, Loss: {total_loss}")
    
    def inverse_reinforcement_learning(self, demonstrations, reward_model):
        for iteration in range(100):
            expert_trajectories = demonstrations
            agent_trajectories = self.generate_trajectories(reward_model)
            
            expert_reward = self.compute_trajectory_reward(expert_trajectories, reward_model)
            agent_reward = self.compute_trajectory_reward(agent_trajectories, reward_model)
            
            reward_loss = max(0, agent_reward - expert_reward + 1)
            
            self.update_reward_model(reward_loss)
    
    def record_human_demonstration(self):
        return []
    
    def generate_trajectories(self, reward_model):
        return []
    
    def compute_trajectory_reward(self, trajectories, reward_model):
        return 0
    
    def update_reward_model(self, loss):
        pass
```

## Skill Library

```python
class SkillLibrary:
    def __init__(self):
        self.skills = {}
        self.skill_hierarchy = {}
    
    def register_skill(self, name, policy, preconditions, postconditions):
        self.skills[name] = {
            'policy': policy,
            'preconditions': preconditions,
            'postconditions': postconditions,
        }
    
    def compose_skills(self, skill_sequence):
        composed_policy = ComposedPolicy(skill_sequence, self.skills)
        return composed_policy
    
    def find_applicable_skills(self, state):
        applicable = []
        for skill_name, skill_info in self.skills.items():
            if self.check_preconditions(state, skill_info['preconditions']):
                applicable.append(skill_name)
        return applicable
    
    def check_preconditions(self, state, preconditions):
        for condition in preconditions:
            if not condition(state):
                return False
        return True

class ComposedPolicy:
    def __init__(self, skill_sequence, skill_library):
        self.skill_sequence = skill_sequence
        self.skill_library = skill_library
        self.current_skill_idx = 0
    
    def select_action(self, state):
        current_skill = self.skill_sequence[self.current_skill_idx]
        policy = self.skill_library[current_skill]['policy']
        
        action = policy.select_action(state)
        
        postconditions = self.skill_library[current_skill]['postconditions']
        if all(cond(state) for cond in postconditions):
            self.current_skill_idx += 1
        
        return action
```

## Key Takeaways

- Cognitive architectures integrate perception, memory, and decision-making
- Reinforcement learning enables autonomous skill acquisition
- Learning from demonstration accelerates training
- Skill libraries enable hierarchical task composition
- Evaluation metrics measure learning progress

## Practice Exercises

1. Implement a DQN agent for a robotic control task
2. Train a policy gradient agent on continuous control
3. Collect human demonstrations and apply behavior cloning
4. Build a skill library with 5 basic skills
5. Compose skills to solve complex tasks
