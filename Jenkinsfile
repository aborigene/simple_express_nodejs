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
                sh 'echo "Cloning repo..."'
                sh 'git clone https://github.com/aborigene/simple_express_nodejs.git'
                sh 'echo "Building application..."'
                sh 'cd simple_express_nodejs && docker build . -t "igoroschsimoes/myexpress:${env.BUILD_ID}"'
                sh 'echo "Pushing image to dockerhub"'
                sh 'echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin'
                sh 'docker push "igoroschsimoes/myexpress:${env.BUILD_ID}"'
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
                    echo "Multiline shell steps works too"
                    ls -lah
                '''
            }
        }
        stage('Quality Gate') {
            steps {
               sh 'curl     '  
            }
        }
    }
}