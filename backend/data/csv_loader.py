"""
CSV Data Loader for EYAI Drug Repurposing Platform
Loads real data from CSV files for agent analysis
"""
import csv
import os
from pathlib import Path
from typing import List, Dict, Any

DATA_DIR = Path(__file__).parent

def load_drugs_from_csv() -> List[Dict[str, Any]]:
    """Load drug database from CSV"""
    drugs = []
    csv_path = DATA_DIR / 'drugs_database.csv'
    
    if not csv_path.exists():
        print(f"[CSV_LOADER] Warning: {csv_path} not found")
        return []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Parse comma-separated fields
            drug = {
                'id': int(row['id']),
                'drugName': row['drugName'],
                'primaryIndication': row['primaryIndication'],
                'mechanism': row['mechanism'],
                'knownTargets': [t.strip() for t in row['knownTargets'].split(',')],
                'adverseEvents': [ae.strip() for ae in row['adverseEvents'].split(',')],
                'patentStatus': row['patentStatus'],
                'marketValue': row['marketValue'],
                'fdaApprovalDate': row['fdaApprovalDate'],
                'pkSummary': row['pkSummary'],
                'molecularWeight': float(row['molecularWeight']),
                'bioavailability': row['bioavailability'],
                'halfLife': row['halfLife']
            }
            drugs.append(drug)
    
    print(f"[CSV_LOADER] Loaded {len(drugs)} drugs from CSV")
    return drugs


def load_research_papers_from_csv() -> List[Dict[str, Any]]:
    """Load research papers from CSV"""
    papers = []
    csv_path = DATA_DIR / 'research_papers.csv'
    
    if not csv_path.exists():
        print(f"[CSV_LOADER] Warning: {csv_path} not found")
        return []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            paper = {
                'pmid': row['pmid'],
                'title': row['title'],
                'authors': row['authors'],
                'journal': row['journal'],
                'year': int(row['year']),
                'citationCount': int(row['citationCount']),
                'abstract': row['abstract'],
                'drugMentioned': row['drugMentioned'],
                'studyType': row['studyType'],
                'keyFindings': row['keyFindings']
            }
            papers.append(paper)
    
    print(f"[CSV_LOADER] Loaded {len(papers)} research papers from CSV")
    return papers


def load_clinical_trials_from_csv() -> List[Dict[str, Any]]:
    """Load clinical trials from CSV"""
    trials = []
    csv_path = DATA_DIR / 'clinical_trials.csv'
    
    if not csv_path.exists():
        print(f"[CSV_LOADER] Warning: {csv_path} not found")
        return []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            trial = {
                'nctId': row['nctId'],
                'title': row['title'],
                'condition': row['condition'],
                'intervention': row['intervention'],
                'phase': row['phase'],
                'status': row['status'],
                'enrollment': int(row['enrollment']),
                'startDate': row['startDate'],
                'completionDate': row['completionDate'],
                'primaryOutcome': row['primaryOutcome'],
                'adverseEvents': row['adverseEvents'],
                'sponsor': row['sponsor'],
                'location': row['location']
            }
            trials.append(trial)
    
    print(f"[CSV_LOADER] Loaded {len(trials)} clinical trials from CSV")
    return trials


def load_patents_from_csv() -> List[Dict[str, Any]]:
    """Load patents from CSV"""
    patents = []
    csv_path = DATA_DIR / 'patents.csv'
    
    if not csv_path.exists():
        print(f"[CSV_LOADER] Warning: {csv_path} not found")
        return []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            patent = {
                'patentId': row['patentId'],
                'title': row['title'],
                'abstract': row['abstract'],
                'drugName': row['drugName'],
                'filingDate': row['filingDate'],
                'expiryDate': row['expiryDate'],
                'status': row['status'],
                'owner': row['owner'],
                'legalStatus': row['legalStatus'],
                'claims': int(row['claims']),
                'citationCount': int(row['citationCount'])
            }
            patents.append(patent)
    
    print(f"[CSV_LOADER] Loaded {len(patents)} patents from CSV")
    return patents


def search_drugs_by_query(query: str, drugs: List[Dict]) -> List[Dict]:
    """
    Smart search through drug database based on query keywords
    Returns drugs ranked by relevance
    """
    query_lower = query.lower()
    matched_drugs = []
    
    for drug in drugs:
        score = 0
        drug_name = drug.get('drugName', '').lower()
        indication = drug.get('primaryIndication', '').lower()
        mechanism = drug.get('mechanism', '').lower()
        targets = ' '.join(drug.get('knownTargets', [])).lower()
        
        # Drug name mentioned
        if drug_name in query_lower:
            score += 100
        
        # Indication matching
        indication_keywords = {
            'alzheimer': ['alzheimer', 'dementia', 'cognitive'],
            'parkinson': ['parkinson'],
            'diabetes': ['diabetes', 'diabetic'],
            'cancer': ['cancer', 'tumor', 'oncology'],
            'pain': ['pain', 'analgesic'],
            'inflammation': ['inflammation', 'inflammatory'],
            'cardiovascular': ['cardiovascular', 'heart', 'hypertension'],
            'epilepsy': ['epilepsy', 'seizure'],
            'depression': ['depression', 'anxiety'],
            'infection': ['infection', 'bacterial', 'antibiotic']
        }
        
        for category, keywords in indication_keywords.items():
            if any(kw in query_lower for kw in keywords):
                if any(kw in indication for kw in keywords):
                    score += 50
        
        # Mechanism keywords
        mechanism_keywords = ['kinase', 'inhibitor', 'agonist', 'antagonist', 'ampk', 'cox', 'pde5']
        for kw in mechanism_keywords:
            if kw in query_lower and kw in mechanism:
                score += 40
        
        # Target matching
        if any(word in targets for word in query_lower.split() if len(word) > 3):
            score += 30
        
        # General neuroscience
        if any(word in query_lower for word in ['brain', 'neuro', 'cognit', 'memory']):
            if any(word in indication for word in ['alzheimer', 'parkinson', 'epilep', 'depression']):
                score += 25
        
        if score > 0:
            matched_drugs.append({
                'drug': drug,
                'relevance_score': score
            })
    
    # Sort by relevance
    matched_drugs = sorted(matched_drugs, key=lambda x: x['relevance_score'], reverse=True)
    
    return [item['drug'] for item in matched_drugs[:15]]


def search_papers_by_drug(drug_name: str, papers: List[Dict]) -> List[Dict]:
    """Find research papers mentioning a specific drug"""
    drug_lower = drug_name.lower()
    matching_papers = []
    
    for paper in papers:
        if drug_lower in paper.get('drugMentioned', '').lower():
            matching_papers.append(paper)
        elif drug_lower in paper.get('title', '').lower():
            matching_papers.append(paper)
        elif drug_lower in paper.get('abstract', '').lower():
            matching_papers.append(paper)
    
    return matching_papers


def search_trials_by_drug(drug_name: str, trials: List[Dict]) -> List[Dict]:
    """Find clinical trials for a specific drug"""
    drug_lower = drug_name.lower()
    matching_trials = []
    
    for trial in trials:
        if drug_lower in trial.get('intervention', '').lower():
            matching_trials.append(trial)
        elif drug_lower in trial.get('title', '').lower():
            matching_trials.append(trial)
    
    return matching_trials


def search_patents_by_drug(drug_name: str, patents: List[Dict]) -> List[Dict]:
    """Find patents related to a specific drug"""
    drug_lower = drug_name.lower()
    matching_patents = []
    
    for patent in patents:
        if drug_lower in patent.get('drugName', '').lower():
            matching_patents.append(patent)
        elif drug_lower in patent.get('title', '').lower():
            matching_patents.append(patent)
    
    return matching_patents


# Export all functions
__all__ = [
    'load_drugs_from_csv',
    'load_research_papers_from_csv',
    'load_clinical_trials_from_csv',
    'load_patents_from_csv',
    'search_drugs_by_query',
    'search_papers_by_drug',
    'search_trials_by_drug',
    'search_patents_by_drug'
]
