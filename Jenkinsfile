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
                    // Create reports directory
                    bat 'mkdir -p reports'

                    // Start HTML report
                    bat '''
                        echo "<h1>🔍 Trivy Security Scan Report</h1>" > reports/report.html
                        echo "<p><strong>Generated on:</strong> $(date)</p><hr>" >> reports/report.html
                    '''

                    // Define services to scan (must match service names in docker-compose.yml)
                    def services = ['frontend', 'backend']

                    services.each { service ->
                        def jsonReport = "reports/${service}_trivy.json"
                        def htmlSnippet = "reports/${service}_snippet.html"

                        // Run Trivy scan
                        bat """
                            trivy image --format json --output ${jsonReport} ${service}
                            trivy image --format table ${service} > ${htmlSnippet}
                        """

                        // Append to HTML report
                        def snippet = readFile("${htmlSnippet}")
                        def htmlContent = """
                            <h3>📦 Image: ${service}</h3>
                            <pre>${snippet}</pre>
                            <hr>
                        """
                        writeFile file: "reports/report.html", text: htmlContent, append: true
                    }
                }
            }
        }

        stage('Check for Critical Vulnerabilities') {
            steps {
                script {
                    def criticalFound = false
                    ['frontend', 'backend'].each { service ->
                        def json = readJSON file: "reports/${service}_trivy.json"
                        if (json?.Results) {
                            json.Results.each { result ->
                                if (result.Vulnerabilities) {
                                    result.Vulnerabilities.each { vuln ->
                                        if (vuln.Severity == 'CRITICAL') {
                                            criticalFound = true
                                            echo "🚨 CRITICAL: ${service} | ${vuln.VulnerabilityID} | ${vuln.Title}"
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (criticalFound) {
                        error("❌ Build failed: CRITICAL vulnerabilities found! Check Trivy report.")
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
                    withCredentials([usernamePassword(
                        credentialsId: 'docker', // Your Jenkins credentials ID for Docker Hub
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_PASSWORD'
                    )]) {
                        bat """
                            echo "${DOCKERHUB_PASSWORD}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin
                        """
                    }

                    // Tag and push frontend
                    bat "docker tag frontend ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    bat "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"

                    // Tag and push backend
                    bat "docker tag backend ${BACKEND_IMAGE}:${IMAGE_TAG}"
                    bat "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"

                    echo '✅ Images pushed to Docker Hub!'
                }
            }
        }
    }

    post {
        always {
            // Archive reports
            archiveArtifacts artifacts: 'reports/*', allowEmptyArchive: true

            // Publish HTML report in Jenkins UI
            publishHTML(target: [
                name: 'Trivy Security Report',
                reportDir: 'reports',
                reportFiles: 'report.html',
                keepAll: true
            ])
        }
        success {
            echo 'Pipeline succeeded! Images scanned, deployed, and pushed to Docker Hub.'
        }
        failure {
            echo 'Pipeline failed! Check logs and Trivy report.'
        }
    }
}