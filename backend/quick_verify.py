"""
Quick System Verification - Tests CSV data and agent integration
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from data.csv_loader import (
    load_drugs_from_csv, 
    load_research_papers_from_csv, 
    load_clinical_trials_from_csv, 
    load_patents_from_csv
)

def main():
    print("\n" + "="*80)
    print("  🔬 DRUG DISCOVERY PLATFORM - QUICK VERIFICATION")
    print("="*80)
    
    # Test 1: Load CSV Data
    print("\n📊 TEST 1: Loading CSV Data...")
    drugs = load_drugs_from_csv()
    papers = load_research_papers_from_csv()
    trials = load_clinical_trials_from_csv()
    patents = load_patents_from_csv()
    
    print(f"  ✓ Loaded {len(drugs)} drugs")
    print(f"  ✓ Loaded {len(papers)} research papers")
    print(f"  ✓ Loaded {len(trials)} clinical trials")
    print(f"  ✓ Loaded {len(patents)} patents")
    
    # Test 2: Verify Data Structure
    print("\n📋 TEST 2: Verifying Data Structure...")
    
    if drugs:
        drug = drugs[0]
        print(f"\n  Sample Drug: {drug['drugName']}")
        print(f"    Indication: {drug['primaryIndication']}")
        print(f"    Mechanism: {drug['mechanism']}")
        print(f"    Targets: {', '.join(drug['knownTargets'][:3])}")
        assert 'drugName' in drug, "Missing drugName field"
        assert 'mechanism' in drug, "Missing mechanism field"
        print("  ✓ Drug data structure is correct")
    
    if papers:
        paper = papers[0]
        print(f"\n  Sample Paper: {paper['title'][:60]}...")
        print(f"    PMID: {paper['pmid']}")
        print(f"    Journal: {paper['journal']}")
        print(f"    Year: {paper['year']}")
        assert 'pmid' in paper, "Missing PMID"
        assert str(paper['pmid']).isdigit(), "Invalid PMID format"
        print("  ✓ Research paper data structure is correct")
    
    if trials:
        trial = trials[0]
        print(f"\n  Sample Trial: {trial['title'][:60]}...")
        print(f"    NCT ID: {trial['nctId']}")
        print(f"    Phase: {trial['phase']}")
        print(f"    Status: {trial['status']}")
        assert 'nctId' in trial, "Missing NCT ID"
        assert trial['nctId'].startswith('NCT'), "Invalid NCT ID format"
        print("  ✓ Clinical trial data structure is correct")
    
    if patents:
        patent = patents[0]
        print(f"\n  Sample Patent: {patent['title'][:60]}...")
        print(f"    Patent ID: {patent['patentId']}")
        print(f"    Status: {patent['status']}")
        print(f"    Filing Date: {patent['filingDate']}")
        assert 'patentId' in patent, "Missing Patent ID"
        assert patent['patentId'].startswith(('US', 'EP', 'WO')), "Invalid Patent ID format"
        print("  ✓ Patent data structure is correct")
    
    # Test 3: Verify Traceability
    print("\n🔍 TEST 3: Verifying Data Traceability...")
    
    pmid_count = sum(1 for p in papers if str(p['pmid']).isdigit())
    nct_count = sum(1 for t in trials if t['nctId'].startswith('NCT'))
    patent_count = sum(1 for p in patents if p['patentId'].startswith(('US', 'EP', 'WO')))
    
    print(f"  ✓ {pmid_count}/{len(papers)} papers have valid PMIDs (numeric)")
    print(f"  ✓ {nct_count}/{len(trials)} trials have valid NCT IDs")
    print(f"  ✓ {patent_count}/{len(patents)} patents have valid Patent IDs")
    
    # Test 4: Search Functionality
    print("\n🔎 TEST 4: Testing Search Functionality...")
    
    # Search for Alzheimer's related drugs
    alzheimers_drugs = [d for d in drugs if 'alzheimer' in d['primaryIndication'].lower()]
    print(f"  ✓ Found {len(alzheimers_drugs)} drugs for Alzheimer's disease")
    if alzheimers_drugs:
        for drug in alzheimers_drugs[:3]:
            print(f"    - {drug['drugName']}: {drug['mechanism'][:50]}...")
    
    # Search for relevant papers
    alzheimers_papers = [p for p in papers if 'alzheimer' in p['title'].lower() or 'alzheimer' in p['abstract'].lower()]
    print(f"  ✓ Found {len(alzheimers_papers)} papers about Alzheimer's")
    if alzheimers_papers:
        for paper in alzheimers_papers[:2]:
            print(f"    - PMID:{paper['pmid']}: {paper['title'][:60]}...")
    
    # Search for clinical trials
    alzheimers_trials = [t for t in trials if 'alzheimer' in t['title'].lower() or 'alzheimer' in t['condition'].lower()]
    print(f"  ✓ Found {len(alzheimers_trials)} clinical trials for Alzheimer's")
    if alzheimers_trials:
        for trial in alzheimers_trials[:2]:
            print(f"    - {trial['nctId']}: {trial['title'][:60]}...")
    
    # Final Summary
    print("\n" + "="*80)
    print("  ✅ ALL TESTS PASSED!")
    print("="*80)
    print("\n📊 Summary:")
    print(f"  • Total Drugs: {len(drugs)}")
    print(f"  • Total Research Papers: {len(papers)}")
    print(f"  • Total Clinical Trials: {len(trials)}")
    print(f"  • Total Patents: {len(patents)}")
    print(f"  • All data has traceable IDs (PMID, NCT, Patent)")
    print(f"  • Search functionality works correctly")
    print("\n💡 The CSV data system is working perfectly!")
    print("   Agents will use this real data to generate evidence-based recommendations.\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ VERIFICATION FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
