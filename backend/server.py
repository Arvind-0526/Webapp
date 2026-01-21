from fastapi import FastAPI, Request
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import httpx
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Node.js server URL
NODE_SERVER = "http://localhost:8002"

# Proxy all /api requests to Node.js server
@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy_to_node(request: Request, path: str):
    """Proxy all API requests to Node.js server"""
    url = f"{NODE_SERVER}/api/{path}"
    
    # Get query parameters
    query_params = str(request.url.query)
    if query_params:
        url += f"?{query_params}"
    
    # Get headers
    headers = dict(request.headers)
    headers.pop('host', None)  # Remove host header
    
    # Handle different content types
    body = None
    files = None
    data = None
    
    if request.method in ["POST", "PUT", "PATCH"]:
        content_type = headers.get('content-type', '')
        
        if 'multipart/form-data' in content_type:
            # For file uploads, we need to handle multipart data
            form = await request.form()
            
            # Separate files and data
            files = {}
            data = {}
            
            for key, value in form.items():
                if hasattr(value, 'file'):  # It's a file
                    files[key] = (value.filename, await value.read(), value.content_type)
                else:  # It's regular form data
                    data[key] = value
            
            # Remove content-type header for multipart requests
            headers.pop('content-type', None)
            headers.pop('content-length', None)
        else:
            # For JSON and other content types
            body = await request.body()
    
    # Forward request to Node.js server
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            if files:
                # Use files and data for multipart requests
                response = await client.request(
                    method=request.method,
                    url=url,
                    headers=headers,
                    files=files,
                    data=data,
                )
            else:
                # Use body for other requests
                response = await client.request(
                    method=request.method,
                    url=url,
                    headers=headers,
                    content=body,
                )
            
            # Return response
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
            )
        except Exception as e:
            return Response(
                content=f'{{"error": "Node server error: {str(e)}"}}',
                status_code=500,
                media_type="application/json"
            )

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "proxy_to": NODE_SERVER}

# Startup: Start Node.js server
@app.on_event("startup")
async def startup_event():
    import subprocess
    import time
    
    # Start Node.js server
    subprocess.Popen(
        ["node", "server_node.js"],
        cwd="/app/backend",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    
    # Wait a bit for Node.js server to start
    time.sleep(2)
    print("✅ Node.js server started on port 8002")
    print("✅ FastAPI proxy running on port 8001")
