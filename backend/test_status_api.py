"""
Test the job status API endpoint
"""
import requests
import time

def test_status_api():
    """Test the /api/v1/jobs/{job_id}/status endpoint"""
    
    print("Testing job status API endpoint...")
    
    # Wait for backend to be ready
    time.sleep(2)
    
    try:
        # Test with a dummy job ID
        response = requests.get("http://localhost:8000/api/v1/jobs/test-123/status")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            print("\n✓ API endpoint working!")
            print(f"  Status: {data.get('status')}")
            print(f"  Progress: {data.get('percentComplete')}%")
            print(f"  Agents: {len(data.get('perAgentStatus', []))}")
        else:
            print(f"\n✗ API returned error: {response.status_code}")
            
    except Exception as e:
        print(f"\n✗ Error: {e}")

if __name__ == "__main__":
    test_status_api()
