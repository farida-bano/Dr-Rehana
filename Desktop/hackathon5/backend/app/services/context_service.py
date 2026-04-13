"""
Context service for managing unified customer context
"""
import redis
import json
from uuid import UUID
from typing import Optional, Dict, Any

class ContextService:
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = redis.from_url(redis_url)

    async def get_customer_context(self, customer_id: UUID) -> Optional[Dict[str, Any]]:
        """Get unified customer context"""
        key = f"context:{customer_id}"
        context = self.redis_client.get(key)
        return json.loads(context) if context else None

    async def update_context(self, customer_id: UUID, updates: Dict[str, Any]):
        """Update customer context"""
        key = f"context:{customer_id}"
        context = await self.get_customer_context(customer_id) or {}
        context.update(updates)
        self.redis_client.setex(key, 3600, json.dumps(context))

    async def add_interaction(self, customer_id: UUID, interaction: Dict[str, Any]):
        """Add interaction to customer context"""
        key = f"interactions:{customer_id}"
        self.redis_client.lpush(key, json.dumps(interaction))
        self.redis_client.ltrim(key, 0, 99)  # Keep last 100

    async def get_recent_interactions(self, customer_id: UUID, limit: int = 10):
        """Get recent interactions for customer"""
        key = f"interactions:{customer_id}"
        interactions = self.redis_client.lrange(key, 0, limit - 1)
        return [json.loads(i) for i in interactions]
