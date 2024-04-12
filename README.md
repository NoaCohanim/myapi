# Autodesk YouTube Service

## Live API on Heroku
(https://ancient-fjord-43618-c0b060d623da.herokuapp.com/)

## Documentation

### Endpoints

1. **GET /videos**
   - Description: Retrieves a list of 10 videos related to Autodesk from the YouTube API.
   - Response:
     - Title: Title of the video
     - Length: Duration of the video
     - Views: Number of views for the video

2. **GET /health**
   - Description: Provides a health check of the service.
   - Response:
     - OS: Operating system name
     - Node Version: Version of Node.js
     - Memory Usage: Percentage of memory usage
     - CPU Usage: Percentage of CPU usage

## How to Use

1. **Step 1**: Clone the repository.

2. **Step 2**: Build the Docker image.

3. **Step 3**: Run the Docker container.
  
4. **Step 4**: Access the API endpoints at `http://localhost:3000`.


