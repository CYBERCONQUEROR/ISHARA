# ISHARA Docker Setup Guide

## Overview

This Docker setup provides multiple deployment options for the ISHARA application:

1. **Development Environment** - Single container for development
2. **Production Environment** - Multi-container setup with nginx reverse proxy
3. **Backend-only** - Python FastAPI backend only

## Quick Start

### Development Environment

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
```

### Production Environment

```bash
# Start production environment
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
```

### Production with HTTPS (Nginx)

```bash
# Create SSL certificates directory
mkdir -p ssl

# Generate self-signed certificates (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem

# Start with nginx reverse proxy
docker-compose --profile production up --build

# Access via HTTPS
# https://localhost
```

## File Structure

```
├── docker-compose.yml          # Production multi-container setup
├── docker-compose.dev.yml      # Development single-container setup
├── Dockerfile                  # Development container
├── Dockerfile.frontend         # Production frontend container
├── Dockerfile.backend          # Production backend container
├── nginx.conf                  # Main nginx configuration
├── nginx-frontend.conf         # Frontend nginx configuration
├── requirements.txt            # Python dependencies
├── docker-entrypoint.sh        # Development startup script
└── .dockerignore              # Files to exclude from build
```

## Services

### Frontend (React + Vite)
- **Port**: 3000
- **Technology**: Node.js 18, React, Vite
- **Features**: 
  - Speech recognition
  - Sign language translation
  - Multi-language support

### Backend (FastAPI)
- **Port**: 8001
- **Technology**: Python 3.10, FastAPI, TensorFlow
- **Features**:
  - Hand gesture recognition
  - Text translation
  - AI model inference

### Nginx (Production)
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Features**:
  - Reverse proxy
  - SSL termination
  - Load balancing
  - Rate limiting
  - Security headers

## Environment Variables

### Frontend
```bash
NODE_ENV=production
VITE_API_URL=http://localhost:8001
```

### Backend
```bash
PYTHONPATH=/app
MODEL_PATH=/app/backend
```

## Development Commands

```bash
# Build and start development environment
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

## Production Commands

```bash
# Build and start production environment
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop production environment
docker-compose down

# Scale backend services
docker-compose up --scale backend=3 -d
```

## Health Checks

The application includes health checks:

```bash
# Check frontend health
curl http://localhost:3000/health

# Check backend health
curl http://localhost:8001/

# Check nginx health (production)
curl http://localhost/health
```

## SSL Configuration

For production HTTPS:

1. **Generate SSL certificates**:
```bash
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem
```

2. **Start with nginx**:
```bash
docker-compose --profile production up --build
```

## Monitoring

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f
```

### Resource Usage
```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8001
```

2. **Permission issues**:
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

3. **Model files missing**:
```bash
# Ensure model files are in backend directory
ls -la backend/*.h5 backend/*.pkl
```

4. **Memory issues**:
```bash
# Increase Docker memory limit
# In Docker Desktop: Settings > Resources > Memory
```

### Debug Commands

```bash
# Enter running container
docker-compose exec backend bash
docker-compose exec frontend sh

# Check container status
docker-compose ps

# View container details
docker inspect <container_name>
```

## Deployment

### Local Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Server
```bash
# Clone repository
git clone <repository-url>
cd ISHARA

# Set up SSL certificates
mkdir -p ssl
# Add your SSL certificates to ssl/ directory

# Start production environment
docker-compose --profile production up --build -d
```

### Cloud Deployment

#### AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t ishara .
docker tag ishara:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ishara:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ishara:latest
```

#### Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/<project-id>/ishara
gcloud run deploy ishara --image gcr.io/<project-id>/ishara --platform managed
```

## Security Considerations

1. **Use HTTPS in production**
2. **Set up proper SSL certificates**
3. **Configure firewall rules**
4. **Regular security updates**
5. **Monitor logs for suspicious activity**

## Performance Optimization

1. **Enable gzip compression** (already configured)
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Monitor resource usage**
5. **Scale services as needed**

## Backup and Recovery

```bash
# Backup volumes
docker run --rm -v ishara_model-data:/data -v $(pwd):/backup alpine tar czf /backup/model-data-backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v ishara_model-data:/data -v $(pwd):/backup alpine tar xzf /backup/model-data-backup.tar.gz -C /data
``` 