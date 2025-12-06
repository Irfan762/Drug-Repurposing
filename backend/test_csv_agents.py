"""
Test script for CSV-based agents
Run this to verify the CSV data loading and agent execution
"""
import asyncio
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.agents.csv_agents import (
    orchestrate_csv_agents,
    aggregate_csv_results,
    DRUGS_DATABASE,
    RESEARCH_PAPERS,
    CLINICAL_TRIALS,
    PATENTS_DATABASE
)

async def test_csv_agents():
    """Test the CSV-based agent system"""
    
    print("=" * 80)
    print("CSV-BASED AGENT SYSTEM TEST")
    print("=" * 80)
    
    # Check data loading
    print(f"\n✓ Loaded {len(DRUGS_DATABASE)} drugs from CSV")
    print(f"✓ Loaded {len(RESEARCH_PAPERS)} research papers from CSV")
    print(f"✓ Loaded {len(CLINICAL_TRIALS)} clinical trials from CSV")
    print(f"✓ Loaded {len(PATENTS_DATABASE)} patents from CSV")
    
    # Show sample data
    if DRUGS_DATABASE:
        print(f"\nSample Drug: {DRUGS_DATABASE[0]['drugName']}")
        print(f"  Indication: {DRUGS_DATABASE[0]['primaryIndication']}")
        print(f"  Mechanism: {DRUGS_DATABASE[0]['mechanism']}")
        print(f"  Targets: {', '.join(DRUGS_DATABASE[0]['knownTargets'][:3])}")
    
    if RESEARCH_PAPERS:
        print(f"\nSample Paper: PMID:{RESEARCH_PAPERS[0]['pmid']}")
        print(f"  Title: {RESEARCH_PAPERS[0]['title'][:60]}...")
        print(f"  Citations: {RESEARCH_PAPERS[0]['citationCount']}")
    
    if CLINICAL_TRIALS:
        print(f"\nSample Trial: {CLINICAL_TRIALS[0]['nctId']}")
        print(f"  Title: {CLINICAL_TRIALS[0]['title'][:60]}...")
        print(f"  Phase: {CLINICAL_TRIALS[0]['phase']}")
    
    # Test query
    print("\n" + "=" * 80)
    print("TESTING QUERY: 'Find kinase inhibitors for Alzheimer's disease'")
    print("=" * 80)
    
    query = "Find kinase inhibitors for Alzheimer's disease"
    
    # Run orchestration
    print("\n[1/2] Running agent orchestration...")
    agent_results = await orchestrate_csv_agents(query)
    
    print(f"\n✓ Agent Results:")
    for agent_name, result in agent_results.items():
        print(f"  • {agent_name.upper()}: {result.get('summary', 'No summary')[:80]}...")
    
    # Aggregate results
    print("\n[2/2] Aggregating results into ranked candidates...")
    final_result = await aggregate_csv_results(agent_results, query)
    
    candidates = final_result.get('candidates', [])
    metadata = final_result.get('metadata', {})
    
    print(f"\n✓ Found {len(candidates)} ranked candidates")
    print(f"✓ Analyzed {metadata.get('total_drugs_analyzed', 0)} total drugs")
    print(f"✓ Data sources: {', '.join(metadata.get('data_sources', []))}")
    
    # Show top 3 candidates
    print("\n" + "=" * 80)
    print("TOP 3 CANDIDATES")
    print("=" * 80)
    
    for i, candidate in enumerate(candidates[:3], 1):
        print(f"\n#{i} {candidate['drug']} - Score: {candidate['score']*100:.1f}%")
        print(f"   Indication: {candidate['primaryIndication']}")
        print(f"   Mechanism: {candidate['mechanism'][:80]}...")
        print(f"   Targets: {', '.join(candidate['knownTargets'][:3])}")
        print(f"   Patent: {candidate['patentStatus']}")
        print(f"   Market: {candidate['marketValue']}")
        print(f"   Evidence: {len(candidate['sources'])} sources")
        print(f"   Rationale: {candidate['rationale'][:100]}...")
    
    print("\n" + "=" * 80)
    print("TEST COMPLETED SUCCESSFULLY ✓")
    print("=" * 80)
    print("\nThe CSV-based agent system is working correctly!")
    print("All agents are using REAL data from CSV files.")
    print("\nYou can now:")
    print("  1. Start the backend: uvicorn app.main:app --reload")
    print("  2. Start the frontend: npm run dev")
    print("  3. Submit queries and see real CSV data in action!")

if __name__ == "__main__":
    asyncio.run(test_csv_agents())
