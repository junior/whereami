# WhereAmI - MultiCloud Demo App

A React-based web application that displays IP information and identifies the cloud provider based on the IP address. This app demonstrates multi-cloud deployment capabilities.

## Features

- Fetches IP information from ipinfo.io
- Displays city, region, IP, and hostname
- Identifies cloud providers (Oracle, Azure, AWS, Akamai, etc.) with corresponding logos
- Animated cloud background
- Responsive design

## Technologies

- React 18
- Node.js
- Nginx
- Docker

## Quickstart

### Using Docker

1. Run the application using Docker:

   ```bash
   docker run --rm -it -p 8000:80 ghcr.io/junior/whereami
   ```

1. Open your browser and navigate to `http://localhost:8000` to see the application in action.

### Kubernetes Deployment (Quick)

1. Run container on the Kubernetes cluster:

   ```bash
   kubectl run whereami --image=ghcr.io/junior/whereami --port=80
   ```

1. Temporary access to the application:

   ```bash
   kubectl port-forward pod/whereami 8000:80
   ```

1. Open your browser and navigate to `http://localhost:8000` to see the application in action.

### Kubernetes Deployment (Persistent)

1. Apply the Kubernetes manifests:

   Deployment

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/junior/whereami/main/k8s/deployment.yaml
   ```

   Service

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/junior/whereami/main/k8s/service.yaml
   ```

   Optionally, if your cluster supports it, create a LoadBalancer service:

   ```bash
   kubectl expose deployment whereami-lb --type=LoadBalancer --port=80
   ```

1. Create an ingress to expose the application:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/junior/whereami/main/k8s/ingress.yaml
   ```

1. Check the deployment status:

   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

1. Access the application via the ingress URL or the service IP address.

## Development

1. Clone the repository:

   ```bash
   git clone https://github.com/junior/whereami.git
   cd whereami
   ```

1. Install dependencies:

   ```bash
   npm install
   ```

1. Start the development server:

   ```bash
   npm start
   ```

1. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Build Container (Single platform)

1. Build the Docker image:

   ```bash
   docker build -t whereami .
   ```

1. Run the Docker container:

   ```bash
   docker run --rm -it -p 8000:80 whereami
   ```

## Build Container (Multi-platform)

1. Build the Docker image for multiple platforms and push to a container registry:

   ```bash
   docker buildx create --use
   docker buildx build --pull --rm --push --platform linux/amd64,linux/arm64 -t your-registry/whereami:latest .
   ```

1. Run the Docker container:

   ```bash
   docker run --rm -it -p 8000:80 your-registry/whereami:latest
   ```

## License

MIT License - See the [LICENSE](LICENSE) file for details.
