"""
Seed Data Loader for EY Drug Repurposing Platform
Loads 47+ FDA-approved drugs and reference datasets
"""
import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent

def load_seed_drugs():
    """Load all seed drug data"""
    drugs = []
    
    # Load from multiple parts
    for filename in ['seed_drugs_part1.json', 'seed_drugs_part2.json']:
        filepath = DATA_DIR / filename
        if filepath.exists():
            with open(filepath, 'r') as f:
                drugs.extend(json.load(f))
    
    # Add 22 more drugs to reach 47+
    additional_drugs = [
        {"id": 26, "drugName": "Gabapentin", "primaryIndication": "Neuropathic Pain, Epilepsy"},
        {"id": 27, "drugName": "Prednisone", "primaryIndication": "Inflammation, Autoimmune Diseases"},
        {"id": 28, "drugName": "Hydrochlorothiazide", "primaryIndication": "Hypertension, Edema"},
        {"id": 29, "drugName": "Simvastatin", "primaryIndication": "Hypercholesterolemia"},
        {"id": 30, "drugName": "Metoprolol", "primary Indication": "Hypertension, Heart Failure"},
        {"id": 31, "drugName": "Azithromycin", "primaryIndication": "Bacterial Infections"},
        {"id": 32, "drugName": "Amoxicillin", "primaryIndication": "Bacterial Infections"},
        {"id": 33, "drugName": "Ciprofloxacin", "primaryIndication": "Bacterial Infections"},
        {"id": 34, "drugName": "Methylphenidate", "primaryIndication": "ADHD"},
        {"id": 35, "drugName": "Insulin Glargine", "primaryIndication": "Diabetes"},
        {"id": 36, "drugName": "Clopidogrel", "primaryIndication": "Cardiovascular Disease"},
        {"id": 37, "drugName": "Duloxetine", "primaryIndication": "Depression, Neuropathic Pain"},
        {"id": 38, "drugName": "Escitalopram", "primaryIndication": "Depression, Anxiety"},
        {"id": 39, "drugName": "Rosuvastatin", "primaryIndication": "Hypercholesterolemia"},
        {"id": 40, "drugName": "Venlafaxine", "primaryIndication": "Depression, Anxiety"},
        {"id": 41, "drugName": "Quetiapine", "primaryIndication": "Schizophrenia, Bipolar"},
        {"id": 42, "drugName": "Aripiprazole", "primaryIndication": "Schizophrenia, Bipolar"},
        {"id": 43, "drugName": "Risperidone", "primaryIndication": "Schizophrenia"},
        {"id": 44, "drugName": "Olanzapine", "primaryIndication": "Schizophrenia, Bipolar"},
        {"id": 45, "drugName": "Lamotrigine", "primaryIndication": "Epilepsy, Bipolar"},
        {"id": 46, "drugName": "Topiramate", "primaryIndication": "Epilepsy, Migraine"},
        {"id": 47, "drugName": "Zolpidem", "primaryIndication": "Insomnia"},
        {"id": 48, "drugName": "Memantine", "primaryIndication": "Alzheimer's Disease"},
        {"id": 49, "drugName": "Rivastigmine", "primaryIndication": "Alzheimer's, Parkinson's Dementia"},
        {"id": 50, "drugName": "Bupropion", "primaryIndication": "Depression, Smoking Cessation"}
    ]
    
    drugs.extend(additional_drugs)
    return drugs


def load_clinical_trials():
    """Load seed clinical trials data"""
    return [
        {
            "nctId": "NCT04123456",
            "title": "Metformin for Alzheimer's Disease Prevention",
            "condition": "Alzheimer's Disease",
            "intervention": "Metformin",
            "phase": "Phase II",
            "status": "Completed",
            "enrollment": 120,
            "outcome": "65% showed reduced cognitive decline",
            "adverseEvents": ["GI distress (12%)", "Vitamin B12 deficiency (5%)"]
        },
        {
            "nctId": "NCT03998877",
            "title": "Sildenafil in Vascular Dementia",
            "condition": "Vascular Dementia",
            "intervention": "Sildenafil",
            "phase": "Phase II",
            "status": "Recruiting",
            "enrollment": 80,
            "outcome": "Preliminary: Improved cerebral blood flow",
            "adverseEvents": ["Headache (18%)", "Flushing (10%)"]
        },
        {
            "nctId": "NCT05234567",
            "title": "Imatinib for Neurodegenerative Diseases",
            "condition": "Parkinson's Disease",
            "intervention": "Imatinib",
            "phase": "Phase I",
            "status": "Active",
            "enrollment": 40,
            "outcome": "Safety profile established",
            "adverseEvents": ["Mild nausea (8%)"]
        }
    ]


def load_patent_data():
    """Load seed patent data"""
    return [
        {
            "patentId": "US20240012345",
            "title": "Use of Metformin for Neuroprotection",
            "abstract": "Methods of using metformin...",
            "filingDate": "2015-03-15",
            "expiryDate": "2023-01-20",
            "status": "Expired",
            "owner": "Generic Pharma Inc",
            "legalStatus": "Public domain"
        },
        {
            "patentId": "EP3456789",
            "title": "Kinase Inhibitors for Alzheimer's",
            "abstract": "Novel formulations of kinase inhibitors...",
            "filingDate": "2018-06-01",
            "expiryDate": "2038-06-01",
            "status": "Active",
            "owner": "NeuroPharma AG",
            "legalStatus": "May require licensing"
        }
    ]


def load_market_data():
    """Load IQVIA-style market data"""
    return {
        "alzheimers_market": {
            "size_2024": "$8.2B",
            "projected_2030": "$14.5B",
            "cagr": "12.5%",
            "top_players": ["Biogen", "Eli Lilly", "Eisai"],
            "unmet_need": "High - limited disease-modifying therapies"
        },
        "repurposing_advantage": {
            "time_savings": "60-80% vs de novo development",
            "cost_savings": "~$1.2B saved per candidate",
            "success_rate": "10× higher than new molecular entities"
        }
    }


def get_demo_query_suggestions():
    """Get example queries matching the PPT"""
    return [
        "Find kinase inhibitors for Alzheimer's disease with proven safety profiles",
        "Discover FDA-approved drugs targeting AMPK pathway for neurodegenerative conditions",
        "Identify anti-inflammatory drugs suitable for repurposing in Parkinson's disease",
        "Find cardiovascular drugs with potential neuroprotective effects"
    ]


# Export all loaders
__all__ = [
    'load_seed_drugs',
    'load_clinical_trials',
    'load_patent_data',
    'load_market_data',
    'get_demo_query_suggestions'
]
