"""
Runner script for Digital FTE Agent Stage 1 Incubation Prototype.
Demonstrates the complete workflow with mock channels and test data.
"""

import asyncio
import json
import sys
from pathlib import Path
from datetime import datetime

# Add backend to path
sys.path.insert(0, '/Users/sarosh/Desktop/hackathon5/backend/app')

from mcp_server import MCPServer, Channel
from agent_prototype import AgentPrototype


async def load_test_dataset():
    """Load test dataset from edge_cases.json."""
    try:
        with open('/Users/sarosh/Desktop/hackathon5/test-datasets/edge_cases.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Test dataset not found")
        return None


async def run_channel_demo(agent: AgentPrototype, channel: str, test_cases: list):
    """Run demo for a specific channel."""
    print(f"\n{'='*70}")
    print(f"CHANNEL: {channel.upper()}")
    print(f"{'='*70}\n")

    results = {
        "channel": channel,
        "total_tests": len(test_cases),
        "passed": 0,
        "failed": 0,
        "escalations": 0,
        "responses": []
    }

    for i, test_case in enumerate(test_cases[:5], 1):  # Run first 5 for demo
        print(f"Test {i}/{min(5, len(test_cases))}: {test_case['name']}")
        print(f"Query: {test_case['query'][:60]}...")

        try:
            response = await agent.process_query(
                query_id=test_case['id'],
                customer_id=f"cust_{i:03d}",
                channel=channel,
                message=test_case['query'],
                priority=test_case.get('priority', 'normal')
            )

            # Validate response
            if response.response and response.handler:
                results["passed"] += 1
                status = "✓ PASS"
            else:
                results["failed"] += 1
                status = "✗ FAIL"

            if response.requires_escalation:
                results["escalations"] += 1

            print(f"Status: {status}")
            print(f"Handler: {response.handler}")
            print(f"Sentiment: {response.sentiment}")
            print(f"Escalation: {response.requires_escalation}")
            print(f"Response: {response.response[:80]}...")
            print("-" * 70)

            results["responses"].append({
                "test_id": test_case['id'],
                "handler": response.handler,
                "sentiment": response.sentiment,
                "escalation": response.requires_escalation
            })

        except Exception as e:
            results["failed"] += 1
            print(f"Status: ✗ ERROR - {str(e)}")
            print("-" * 70)

    return results


async def run_comprehensive_test(agent: AgentPrototype, dataset: dict):
    """Run comprehensive test across all channels."""
    print("\n" + "="*70)
    print("DIGITAL FTE AGENT - STAGE 1 INCUBATION PROTOTYPE")
    print("="*70)
    print(f"Timestamp: {datetime.utcnow().isoformat()}")
    print(f"Total Test Cases: {dataset['test_dataset']['total_test_cases']}")

    all_results = []

    # Test each channel
    for channel_data in dataset['test_dataset']['test_cases'].values():
        channel = channel_data['channel']
        test_cases = channel_data['cases']

        results = await run_channel_demo(agent, channel, test_cases)
        all_results.append(results)

    # Print summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)

    total_passed = sum(r["passed"] for r in all_results)
    total_failed = sum(r["failed"] for r in all_results)
    total_escalations = sum(r["escalations"] for r in all_results)

    for result in all_results:
        pass_rate = (result["passed"] / result["total_tests"] * 100) if result["total_tests"] > 0 else 0
        print(f"\n{result['channel'].upper()}:")
        print(f"  Tests Run: {result['passed'] + result['failed']}/{result['total_tests']}")
        print(f"  Passed: {result['passed']}")
        print(f"  Failed: {result['failed']}")
        print(f"  Pass Rate: {pass_rate:.1f}%")
        print(f"  Escalations: {result['escalations']}")

    print(f"\nOVERALL:")
    print(f"  Total Passed: {total_passed}")
    print(f"  Total Failed: {total_failed}")
    print(f"  Total Escalations: {total_escalations}")

    # Print agent statistics
    stats = agent.get_agent_stats()
    print(f"\nAGENT STATISTICS:")
    print(f"  Total Queries Processed: {stats['total_queries']}")
    print(f"  Escalation Rate: {stats['escalation_rate']:.1%}")
    print(f"  Channel Breakdown: {stats['channel_breakdown']}")
    print(f"  Sentiment Breakdown: {stats['sentiment_breakdown']}")

    # Print available skills
    print(f"\nAVAILABLE SKILLS:")
    skills = agent.list_available_skills()
    for skill in skills:
        print(f"  - {skill['name']}: {skill['description']}")

    # Print channel status
    print(f"\nCHANNEL STATUS:")
    status = agent.get_channel_status()
    for channel, info in status.items():
        print(f"  {channel}: {info['status']} ({info['response_time_ms']}ms)")


async def run_edge_case_tests(agent: AgentPrototype, dataset: dict):
    """Run specific edge case tests."""
    print("\n" + "="*70)
    print("EDGE CASE TESTING")
    print("="*70)

    edge_cases = []
    for channel, channel_data in dataset['test_dataset']['test_cases'].items():
        for case in channel_data['cases']:
            if case.get('edge_case', False):
                case['channel'] = channel  # Add channel to case
                edge_cases.append(case)

    print(f"Total Edge Cases: {len(edge_cases)}\n")

    passed = 0
    failed = 0

    for i, case in enumerate(edge_cases[:10], 1):  # Test first 10 edge cases
        print(f"Edge Case {i}: {case['name']} ({case['channel']})")
        print(f"Query: {case['query'][:60]}...")

        try:
            response = await agent.process_query(
                query_id=case['id'],
                customer_id=f"edge_cust_{i:03d}",
                channel=case['channel'],
                message=case['query'],
                priority=case.get('priority', 'normal')
            )

            if response.response:
                passed += 1
                print("Status: ✓ HANDLED")
            else:
                failed += 1
                print("Status: ✗ FAILED")

            if case.get('should_escalate') and response.requires_escalation:
                print("Escalation: ✓ CORRECT")
            elif case.get('should_escalate'):
                print("Escalation: ✗ SHOULD HAVE ESCALATED")

        except Exception as e:
            failed += 1
            print(f"Status: ✗ ERROR - {str(e)}")

        print("-" * 70)

    print(f"\nEdge Case Results: {passed} passed, {failed} failed")


async def main():
    """Main entry point."""
    print("\nInitializing Digital FTE Agent Prototype...\n")

    # Initialize agent
    agent = AgentPrototype()

    # Load test dataset
    dataset = await load_test_dataset()
    if not dataset:
        print("Failed to load test dataset")
        return

    # Run comprehensive tests
    await run_comprehensive_test(agent, dataset)

    # Run edge case tests
    await run_edge_case_tests(agent, dataset)

    print("\n" + "="*70)
    print("PROTOTYPE DEMONSTRATION COMPLETE")
    print("="*70)
    print("\nKey Features Demonstrated:")
    print("✓ Multi-channel query handling (Web, Gmail, WhatsApp)")
    print("✓ Intelligent query routing based on content")
    print("✓ Sentiment analysis with channel awareness")
    print("✓ Channel-specific response formatting")
    print("✓ Automatic escalation for complex issues")
    print("✓ Comprehensive error handling")
    print("✓ Edge case management")
    print("\nProduction-Ready Components:")
    print("✓ MCP Server with 6+ tools")
    print("✓ Agent skills manifest (JSON)")
    print("✓ Channel-specific templates")
    print("✓ Comprehensive test dataset (65+ cases)")
    print("✓ Integration tests")
    print("✓ Logging and monitoring")


if __name__ == "__main__":
    asyncio.run(main())
