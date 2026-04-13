"""
Kafka producer for publishing events
"""
from kafka import KafkaProducer
import json
import logging

logger = logging.getLogger(__name__)

class EventProducer:
    def __init__(self, brokers: str = "localhost:9092"):
        self.producer = KafkaProducer(
            bootstrap_servers=brokers.split(","),
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )

    async def publish_message_received(self, channel: str, message_data: dict):
        """Publish message received event"""
        topic = f"channel.{channel}.received"
        self.producer.send(topic, value=message_data)
        logger.info(f"Published event to {topic}")

    async def publish_ticket_created(self, ticket_data: dict):
        """Publish ticket created event"""
        self.producer.send("ticket.created", value=ticket_data)
        logger.info("Published ticket.created event")

    async def publish_agent_assigned(self, assignment_data: dict):
        """Publish agent assignment event"""
        self.producer.send("agent.assigned", value=assignment_data)
        logger.info("Published agent.assigned event")

    async def publish_audit_event(self, audit_data: dict):
        """Publish audit event"""
        self.producer.send("audit.event", value=audit_data)
        logger.info("Published audit.event")
