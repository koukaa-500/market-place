pipeline {
    agent any

    environment {
        // These will be used for Docker Hub
        DOCKERHUB_USERNAME = 'koukaa'
        IMAGE_NAMESPACE = 'koukaa'
        FRONTEND_IMAGE = '${IMAGE_NAMESPACE}/market-place-frontend'
        BACKEND_IMAGE = '${IMAGE_NAMESPACE}/market-place-backend'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/koukaa-500/market-place.git',
                        credentialsId: '1'  // GitHub token or password
                    ]]
                ]
            }
        }

        stage('Check Tools') {
            steps {
                bat 'docker --version'
                bat 'docker-compose --version'
                bat 'trivy --version || echo "Trivy not installed"'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker-compose build'
            }
        }

        stage('Security Scan with Trivy') {
    steps {
        script {
            bat 'rmdir /s /q reports || echo "No previous reports found"'
            bat 'mkdir reports'

            writeFile file: 'reports/report.html', text: """
                <h1>🔍 Trivy Security Scan Report</h1>
                <p><strong>Generated on:</strong> ${new Date()}</p>
                <hr>
            """

            def services = [
                [name: 'frontend', image: 'market-place-frontend'],
                [name: 'backend', image: 'market-place-backend']
            ]

            services.each { service ->
                def jsonReport = "reports/${service.name}_trivy.json"
                def htmlSnippet = "reports/${service.name}_snippet.html"

                bat "trivy image --format json --output ${jsonReport} ${service.image}"
                bat "trivy image --format table ${service.image} > ${htmlSnippet}"

                def snippet = readFile("${htmlSnippet}")
                def htmlContent = """
                    <h3>📦 Image: ${service.image}</h3>
                    <pre>${snippet}</pre>
                    <hr>
                """
                writeFile file: 'reports/report.html', text: htmlContent, append: true
            }
        }
    }
}

        

        stage('Run Application') {
            steps {
                bat 'docker-compose down'
                bat 'docker-compose up -d'
                echo '✅ Application is running in detached mode.'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'docker',usernameVariable: 'koukaa', passwordVariable: 'nabil1234')]) {
                    bat 'echo $DOCKER_PASSWORD | docker login -u koukaa -p nabil1234'
                }

                    // Tag and push frontend
                    bat "docker tag market-place-frontend ${env.FRONTEND_IMAGE}:${env.IMAGE_TAG}"
                    bat "docker push ${env.FRONTEND_IMAGE}:${env.IMAGE_TAG}"

                    // Tag and push backend
                    bat "docker tag market-place-backend ${env.BACKEND_IMAGE}:${env.IMAGE_TAG}"
                    bat "docker push ${env.BACKEND_IMAGE}:${env.IMAGE_TAG}"

                    echo '✅ Images pushed to Docker Hub!'
                }
            }
        }
    }

    post {
    always {
        archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
        script {
            if (fileExists('reports/report.html')) {
                publishHTML([
                    reportDir: 'reports',
                    reportFiles: 'report.html',
                    keepAll: true
                ])
            } else {
                echo '⚠️ report.html not generated. Skipping HTML report publish.'
            }
        }
    }
    success {
        echo 'Pipeline succeeded! App deployed and images pushed.'
    }
    failure {
        echo 'Pipeline failed! Check logs and Trivy report.'
    }
}
}