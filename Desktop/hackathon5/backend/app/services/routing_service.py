"""
Routing service for intelligent message routing
"""
from typing import Dict, List, Optional
from uuid import UUID

class RoutingService:
    def __init__(self):
        self.routing_rules = self._load_routing_rules()

    def _load_routing_rules(self) -> Dict:
        """Load routing rules from configuration"""
        return {
            "billing": "billing_agents",
            "technical": "technical_agents",
            "general": "general_agents"
        }

    async def route_message(self, message_content: str, available_agents: List[Dict]) -> Optional[UUID]:
        """Route message to best available agent"""
        issue_type = await self.classify_issue(message_content)
        queue = self.routing_rules.get(issue_type, "general_agents")

        # Find best agent in queue
        for agent in available_agents:
            if queue in agent.get("queues", []):
                return agent["id"]

        return None

    async def classify_issue(self, content: str) -> str:
        """Classify issue type from content"""
        content_lower = content.lower()

        if any(word in content_lower for word in ["billing", "invoice", "payment", "charge"]):
            return "billing"
        elif any(word in content_lower for word in ["error", "bug", "crash", "not working"]):
            return "technical"
        else:
            return "general"

    async def get_agent_workload(self, agent_id: UUID) -> int:
        """Get current workload for agent"""
        # TODO: Query from database
        return 0
