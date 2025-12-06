"""
Test script to verify real agent progress tracking
"""
import asyncio
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.agents.csv_agents import orchestrate_csv_agents, get_agent_progress

async def test_real_agents():
    """Test real agent execution with progress tracking"""
    print("=" * 80)
    print("TESTING REAL AGENT PROGRESS TRACKING")
    print("=" * 80)
    
    query = "Find kinase inhibitors for Alzheimer's disease"
    job_id = "test-job-123"
    
    print(f"\nQuery: {query}")
    print(f"Job ID: {job_id}\n")
    
    # Start agent orchestration in background
    task = asyncio.create_task(orchestrate_csv_agents(query, job_id))
    
    # Monitor progress in real-time
    print("Monitoring agent progress...\n")
    
    for i in range(30):  # Monitor for 30 seconds
        await asyncio.sleep(1)
        
        progress = get_agent_progress()
        
        print(f"\n--- Progress Update {i+1} ---")
        for agent_name, agent_data in progress.items():
            if agent_name != job_id:  # Skip job_id key
                status = agent_data.get('status', 'unknown')
                prog = agent_data.get('progress', 0)
                task_desc = agent_data.get('task', 'N/A')
                print(f"  {agent_name.upper():12} [{prog:3}%] {status:10} - {task_desc}")
        
        # Check if all agents completed
        all_completed = all(
            agent_data.get('progress', 0) >= 100 
            for agent_name, agent_data in progress.items() 
            if agent_name != job_id
        )
        
        if all_completed and len(progress) > 1:
            print("\n✓ All agents completed!")
            break
    
    # Wait for task to complete
    try:
        results = await task
        print(f"\n{'=' * 80}")
        print("AGENT RESULTS SUMMARY")
        print(f"{'=' * 80}")
        
        for agent_name, agent_result in results.items():
            summary = agent_result.get('summary', 'No summary')
            print(f"\n{agent_name.upper()}:")
            print(f"  {summary}")
        
        print(f"\n{'=' * 80}")
        print("✓ TEST COMPLETED SUCCESSFULLY")
        print(f"{'=' * 80}")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_real_agents())
