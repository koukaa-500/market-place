pipeline {
    agent any
    environment {
        DOCKERHUB_USERNAME = 'koukaa'
        IMAGE_NAMESPACE = 'koukaa'
        FRONTEND_IMAGE = 'market-place-frontend'
        BACKEND_IMAGE = 'market-place-backend'
        IMAGE_TAG = 'latest'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/koukaa-500/market-place.git'
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
                    bat '''
                        if exist reports rmdir /s /q reports
                        mkdir reports
                    '''
                    
                    // Initialize HTML report header
                    def timestamp = new Date().format('yyyy-MM-dd HH:mm:ss')
                    def reportHeader = """<!DOCTYPE html>
<html>
<head>
    <title>Trivy Security Scan Report</title>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #f5f5f5; 
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h3 { 
            color: #34495e; 
            margin-top: 30px;
            background-color: #ecf0f1;
            padding: 10px;
            border-left: 4px solid #3498db;
        }
        pre { 
            background-color: #282c34; 
            color: #abb2bf;
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto;
            font-size: 12px;
            line-height: 1.4;
        }
        hr { 
            border: none;
            border-top: 2px solid #ddd; 
            margin: 30px 0;
        }
        .info {
            background-color: #d1ecf1;
            border-left: 4px solid #0c5460;
            padding: 10px;
            margin: 10px 0;
        }
        .success {
            color: #155724;
            background-color: #d4edda;
            border-left: 4px solid #28a745;
            padding: 10px;
            margin: 10px 0;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Trivy Security Scan Report</h1>
        <div class="info">
            <strong>Generated on:</strong> ${timestamp}<br>
            <strong>Project:</strong> Market Place Application<br>
            <strong>Jenkins Job:</strong> ${env.JOB_NAME}<br>
            <strong>Build Number:</strong> ${env.BUILD_NUMBER}
        </div>
        <hr>
"""
                    writeFile file: 'reports/report.html', text: reportHeader, encoding: 'UTF-8'
                    
                    // Define services to scan
                    def services = [
                        [name: 'frontend', image: 'market-place-frontend'],
                        [name: 'backend', image: 'market-place-backend']
                    ]
                    
                    def allContent = reportHeader
                    def scanSuccess = true
                    
                    // Scan each service
                    services.each { service ->
                        echo "🔍 Scanning ${service.image}..."
                        
                        try {
                            def txtReport = "reports/${service.name}_trivy.txt"
                            
                            // Check if image exists
                            def imageCheck = bat(
                                script: "docker images -q ${service.image}:latest",
                                returnStdout: true
                            ).trim()
                            
                            if (imageCheck) {
                                echo "✅ Image ${service.image} found, starting scan..."
                                
                                // Run Trivy scan and save to text file with table format
                                bat """
                                    trivy image --format table --output ${txtReport} ${service.image}:latest
                                """
                                
                                // Read the text report
                                def scanResult = readFile(file: txtReport, encoding: 'UTF-8')
                                
                                // Escape HTML characters
                                scanResult = scanResult
                                    .replaceAll('&', '&amp;')
                                    .replaceAll('<', '&lt;')
                                    .replaceAll('>', '&gt;')
                                    .replaceAll('"', '&quot;')
                                    .replaceAll("'", '&#39;')
                                
                                // Append to HTML
                                def htmlSection = """
        <h3>📦 Image: ${service.image}:latest</h3>
        <div class="info">
            <strong>Scan Status:</strong> ✅ Completed successfully
        </div>
        <pre>${scanResult}</pre>
        <hr>
"""
                                allContent += htmlSection
                                echo "✅ Scan completed for ${service.image}"
                                
                            } else {
                                echo "⚠️ Image ${service.image} not found, skipping..."
                                def htmlSection = """
        <h3>📦 Image: ${service.image}:latest</h3>
        <div class="warning">
            <strong>⚠️ Warning:</strong> Image not found. Build may have failed or image name is incorrect.
        </div>
        <hr>
"""
                                allContent += htmlSection
                            }
                            
                        } catch (Exception e) {
                            echo "❌ Error scanning ${service.image}: ${e.message}"
                            scanSuccess = false
                            def htmlSection = """
        <h3>📦 Image: ${service.image}:latest</h3>
        <div style="background-color: #f8d7da; border-left: 4px solid #721c24; padding: 10px;">
            <strong>❌ Error:</strong> ${e.message.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}
        </div>
        <hr>
"""
                            allContent += htmlSection
                        }
                    }
                    
                    // Add summary footer
                    def summaryClass = scanSuccess ? 'success' : 'warning'
                    def summaryIcon = scanSuccess ? '✅' : '⚠️'
                    allContent += """
        <div class="${summaryClass}">
            <strong>${summaryIcon} Scan Status:</strong> ${scanSuccess ? 'All scans completed successfully' : 'Some scans encountered issues'}
        </div>
    </div>
</body>
</html>
"""
                    
                    // Write final report
                    writeFile file: 'reports/report.html', text: allContent, encoding: 'UTF-8'
                    
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
            when {
                expression { return false } // Set to true to enable
            }
            steps {
                script {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                       usernameVariable: 'DOCKER_USER', 
                                                       passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    }
                    
                    // Tag and push frontend
                    bat "docker tag ${FRONTEND_IMAGE}:latest ${IMAGE_NAMESPACE}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    bat "docker push ${IMAGE_NAMESPACE}/${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    
                    // Tag and push backend
                    bat "docker tag ${BACKEND_IMAGE}:latest ${IMAGE_NAMESPACE}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                    bat "docker push ${IMAGE_NAMESPACE}/${BACKEND_IMAGE}:${IMAGE_TAG}"
                    
                    echo '✅ Images pushed to Docker Hub!'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline succeeded! App deployed successfully.'
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            
            // Publish HTML report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'report.html',
                reportName: 'Trivy Security Report',
                reportTitles: 'Security Scan'
            ])
        }
        failure {
            echo '❌ Pipeline failed! Check logs and Trivy report.'
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            
            // Still publish HTML report on failure
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'report.html',
                reportName: 'Trivy Security Report',
                reportTitles: 'Security Scan'
            ])
        }
        always {
            echo '🏁 Pipeline execution completed.'
            // Optional: Clean up dangling images
            bat 'docker image prune -f || echo "No images to prune"'
        }
    }
}