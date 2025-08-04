pipeline {
    agent any


    stages {
        stage('Checkout') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/koukaa-500/market-place.git',
                        credentialsId: '2'  // Update with your credentials ID
                    ]]
                ]
            }
        }

        stage('Test Docker') {
            steps {
                 sh 'docker --version'
                }
            }

        stage('Build Application') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker-compose build'
                    }
                }
            }
        }
        stage('Run Application') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker-compose up'
                    }
                }
            }
        }

        stage('Push Docker Images') {
             steps {
                script {
                // Login to Docker Hub using the credentials stored in Jenkins
                withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'koukaa', passwordVariable: 'nabil1234')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }

                // Tag and push Docker images
                sh 'docker tag koukaa/frontend koukaa/market-place/frontend:latest'
                sh 'docker tag koukaa/backend koukaa/market-place/backend:latest'
                sh 'docker push koukaa/market-place/frontend:latest'
                sh 'docker push koukaa/market-place/backend:latest'
                }
             }
        }
    

        
    }
}