pipeline {
  agent any
  environment {
    ECR_REG = '<AWS_ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com'
    FRONTEND_IMAGE = "${ECR_REG}/marvel-frontend:latest"
    BACKEND_IMAGE = "${ECR_REG}/marvel-backend:latest"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build & Push Images') {
      steps {
        sh 'aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin ${ECR_REG.split("/")[0]}'
        sh 'docker build -t ${FRONTEND_IMAGE} ./frontend'
        sh 'docker build -t ${BACKEND_IMAGE} ./backend'
        sh 'docker push ${FRONTEND_IMAGE}'
        sh 'docker push ${BACKEND_IMAGE}'
      }
    }
    stage('Deploy to k8s') {
      steps {
        withCredentials([file(credentialsId: "kubeconfig", variable: "KUBECONFIG_FILE")]) {
          sh 'kubectl --kubeconfig=$KUBECONFIG_FILE apply -f k8s/'
        }
      }
    }
  }
}
