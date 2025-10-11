pipeline {
    agent any
    environment {
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
                        credentialsId: '1'
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
                    // Clean up previous reports
                    bat 'if exist reports rmdir /s /q reports'
                    bat 'mkdir reports'
                    
                    // Initialize HTML report
                    def reportHeader = """<!DOCTYPE html>
<html>
<head>
    <title>Trivy Security Scan Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; }
        h3 { color: #34495e; margin-top: 30px; }
        pre { background-color: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        hr { border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>🔍 Trivy Security Scan Report</h1>
    <p><strong>Generated on:</strong> ${new Date()}</p>
    <hr>
"""
                    writeFile file: 'reports/report.html', text: reportHeader
                    
                    // Define services to scan
                    def services = [
                        [name: 'frontend', image: 'market-place-frontend'],
                        [name: 'backend', image: 'market-place-backend']
                    ]
                    
                    // Scan each service
                    def allContent = reportHeader
                    services.each { service ->
                        echo "Scanning ${service.image}..."
                        
                        def jsonReport = "reports/${service.name}_trivy.json"
                        def txtReport = "reports/${service.name}_trivy.txt"
                        
                        // Run Trivy scan and save to JSON
                        bat "trivy image --format json --output ${jsonReport} ${service.image}"
                        
                        // Run Trivy scan and save to text file
                        bat "trivy image --format table --output ${txtReport} ${service.image}"
                        
                        // Read the text report
                        def scanResult = readFile(txtReport)
                        
                        // Append to HTML
                        def htmlSection = """
    <h3>📦 Image: ${service.image}</h3>
    <pre>${scanResult.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</pre>
    <hr>
"""
                        allContent += htmlSection
                    }
                    
                    // Close HTML
                    allContent += """
</body>
</html>
"""
                    writeFile file: 'reports/report.html', text: allContent
                    
                    echo '✅ Trivy security scan completed. Report saved to reports/report.html'
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
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                       usernameVariable: 'DOCKER_USER', 
                                                       passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    }
                    
                    // Tag and push frontend
                    bat "docker tag market-place-frontend %IMAGE_NAMESPACE%/market-place-frontend:%IMAGE_TAG%"
                    bat "docker push %IMAGE_NAMESPACE%/market-place-frontend:%IMAGE_TAG%"
                    
                    // Tag and push backend
                    bat "docker tag market-place-backend %IMAGE_NAMESPACE%/market-place-backend:%IMAGE_TAG%"
                    bat "docker push %IMAGE_NAMESPACE%/market-place-backend:%IMAGE_TAG%"
                    
                    echo '✅ Images pushed to Docker Hub!'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline succeeded! App deployed and images pushed.'
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
        }
        failure {
            echo '❌ Pipeline failed! Check logs and Trivy report.'
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
        }
        always {
            // Clean up Docker resources if needed
            echo 'Pipeline execution completed.'
        }
    }
}
