"""
MongoDB Connection Test Script
This script tests the MongoDB connection and displays database information.
"""

from pymongo import MongoClient
import os
import sys
from dotenv import load_dotenv

# Fix Windows console encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Load environment variables
load_dotenv()

def test_mongodb_connection():
    """Test MongoDB connection and display database info"""
    
    # Get MongoDB URI from environment variables only
    mongodb_uri = os.getenv('MONGODB_URI')
    
    if not mongodb_uri:
        print("[ERROR] MONGODB_URI not found in environment variables!")
        print("Please set MONGODB_URI in your .env file.")
        return False
    
    print("=" * 60)
    print("MongoDB Connection Test")
    print("=" * 60)
    print(f"Connecting to: {mongodb_uri.split('@')[1].split('/')[0]}...")
    print()
    
    try:
        # Connect to MongoDB
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.server_info()
        print("[SUCCESS] MongoDB connection successful!")
        print()
        
        # List all databases
        print("[INFO] Available Databases:")
        databases = client.list_database_names()
        for db in databases:
            print(f"   - {db}")
        print()
        
        # Access irrigation_db
        db = client['irrigation_db']
        print(f"[INFO] Database: irrigation_db")
        print()
        
        # List collections
        collections = db.list_collection_names()
        if collections:
            print("[INFO] Collections:")
            for collection in collections:
                count = db[collection].count_documents({})
                print(f"   - {collection}: {count} documents")
        else:
            print("[INFO] Collections: (none - will be created when data is inserted)")
        print()
        
        # Show sample data from each collection
        if collections:
            print("=" * 60)
            print("Sample Data:")
            print("=" * 60)
            
            for collection_name in collections:
                collection = db[collection_name]
                docs = list(collection.find().limit(3))
                if docs:
                    print(f"\n[COLLECTION] {collection_name} (showing up to 3 documents):")
                    for i, doc in enumerate(docs, 1):
                        print(f"   Document {i}:")
                        for key, value in doc.items():
                            if key != '_id':
                                print(f"      {key}: {value}")
        
        # Test write operation
        print()
        print("=" * 60)
        print("Testing Write Operation:")
        print("=" * 60)
        test_collection = db['connection_test']
        from datetime import datetime
        test_doc = {
            'test': True,
            'message': 'Connection test successful',
            'timestamp': datetime.now().isoformat()
        }
        result = test_collection.insert_one(test_doc)
        print(f"[SUCCESS] Test document inserted with ID: {result.inserted_id}")
        
        # Clean up test document
        test_collection.delete_one({'_id': result.inserted_id})
        print("[SUCCESS] Test document cleaned up")
        
        # Close connection
        client.close()
        print()
        print("=" * 60)
        print("[SUCCESS] All tests passed! MongoDB is working correctly.")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"[ERROR] MongoDB connection failed!")
        print(f"Error: {str(e)}")
        print()
        print("=" * 60)
        print("Troubleshooting:")
        print("=" * 60)
        print("1. Check your MongoDB URI in .env file")
        print("2. Verify your username and password are correct")
        print("3. Check if your IP is whitelisted in MongoDB Atlas")
        print("4. Verify your internet connection")
        print("5. Check if the MongoDB cluster is running")
        print()
        return False

if __name__ == "__main__":
    test_mongodb_connection()

