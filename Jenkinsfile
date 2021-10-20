@Library('keptn-library@4.1')
import sh.keptn.Keptn

def keptn = new sh.keptn.Keptn()

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
                sh 'kubectl apply -f k8s_deploy/deployment.yaml -n simple-express'
                sh 'echo "Done!"'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Deploying load generator..."'
                sh 'kubectl apply -f k8s_deploy/deployment-loadgenerator.yaml -n simple-express'
                
                sh 'sleep 60'
            }
        }
        stage('Quality Gate') {
            
            
            steps {
               //sh 'curl -X POST "https://vxd38726.cloudautomation.live.dynatrace.com/api/controlPlane/v1/project/dynatrace/stage/quality-gate/service/myexpress/evaluation" -H  "accept: application/json" -H  "x-token: f5RD1gH8uCYyVRl1VRe1vlHGtFBygj3C4desyn3uyti4O" -H  "Content-Type: application/json" -d "{  \\"labels\\": {    \\"executedBy\\": \\"api\\",    \\"buildId\\": \\"3\\"  },  \\"timeframe\\": \\"5m\\"}"'
               //sh 'curl -X GET "https://vxd38726.cloudautomation.live.dynatrace.com/api/mongodb-datastore/event?keptnContext={keptnContext}&type=sh.keptn.events.evaluation-done" -H "accept: application/json; charset=utf-8" -H "x-token: f5RD1gH8uCYyVRl1VRe1vlHGtFBygj3C4desyn3uyti4O"'
            script{
                keptn.keptnInit project:"dynatrace", service:"myexpress", stage:"quality-gate", monitoring:"dynatrace" 
                def keptnContext = keptn.sendStartEvaluationEvent starttime:"60", endtime:""
                echo "${keptnContext}"
                //def keptnContext = keptn.sendStartEvaluationEvent starttime:"600", endtime:"0" 
                echo "Open Keptns Bridge: https://vxd38726.cloudautomation.live.dynatrace.com/bridge/trace/${keptnContext}"
                def result = keptn.waitForEvaluationDoneEvent setBuildResult:true, waitTime:120
                echo "${result}"
            }
               
            }
        }
    }
}



