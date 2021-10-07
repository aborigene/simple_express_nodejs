pipeline {
    agent { label 'cloudautomation' }
    environment{
        DOCKER_IMAGE = "igoroschsimoes/myexpress:${env.BUILD_ID}"
    }
    stages {
        stage('Build') {
            environment {
                DOCKER_USER  = credentials('igor-docker-login')
                DOCKER_TOKEN = credentials('igor-docker-hub-token')
            }
            steps {
                sh 'echo "Starting to build image..."'
                //sh 'echo "Cloning repo..."'
                //sh 'git clone https://github.com/aborigene/simple_express_nodejs.git'
                sh 'echo "Building application..."'
                sh 'docker build . -t "$DOCKER_IMAGE"'
                sh 'echo "Pushing image to dockerhub"'
                sh 'echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin'
                sh 'docker push "$DOCKER_IMAGE"'
                sh 'echo "Build complete!"'
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo "Deploying to EKS..."'
                sh 'kubectl apply -f k8s_deploy/deployment.yaml'
                sh 'echo "Done!"'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Hello World"'
                sh '''
                    echo "Multiline shell steps works too..."
                    ls -lah
                '''
            }
        }
        stage('Quality Gate') {
            steps {
               sh 'curl -X POST "https://vxd38726.cloudautomation.live.dynatrace.com/api/controlPlane/v1/project/dynatrace/stage/quality-gate/service/simple_express/evaluation" -H  "accept: application/json" -H  "x-token: f5RD1gH8uCYyVRl1VRe1vlHGtFBygj3C4desyn3uyti4O" -H  "Content-Type: application/json" -d \\"{  \\"labels\\": {    \\"executedBy\\": \\"api\\",    \\"buildId\\": \\"3\\"  },  \\"timeframe\\": \\"5m\\"}\\"'  
            }
        }
    }
}



