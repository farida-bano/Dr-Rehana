#!/bin/bash

# Create Kafka topics for Multi-Channel Digital FTE

KAFKA_BROKER="localhost:9092"

# Channel ingestion topics
kafka-topics --create --topic channel.email.received --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true
kafka-topics --create --topic channel.sms.received --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true
kafka-topics --create --topic channel.web_form.received --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true
kafka-topics --create --topic channel.voice.received --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true

# Processing topics
kafka-topics --create --topic message.processed --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true
kafka-topics --create --topic ticket.created --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true
kafka-topics --create --topic ticket.updated --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true

# Agent and SLA topics
kafka-topics --create --topic agent.assigned --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true
kafka-topics --create --topic sla.milestone --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true

# Audit topic
kafka-topics --create --topic audit.event --bootstrap-server $KAFKA_BROKER --partitions 3 --replication-factor 1 || true

echo "Kafka topics created successfully"
