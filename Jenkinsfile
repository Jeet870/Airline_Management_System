pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        APP_NAME        = 'aeroops-command-center'
        PORT            = '4000'
        HEALTH_ENDPOINT = 'http://localhost:4000/api/metrics'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
        ansiColor('xterm')
    }

    triggers {
        githubPush()
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Audit & Environment') {
            steps {
                echo "🚀 Starting Real-Time CI/CD Pipeline #${BUILD_NUMBER}"
                sh 'node -v && npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Clean NPM Packages...'
                sh 'npm ci'
            }
        }

        stage('Code Quality & Tests') {
            parallel {
                stage('TypeScript Type Check') {
                    steps {
                        echo '🔍 Running Type Check...'
                        sh 'npx tsc --noEmit'
                    }
                }
                stage('Unit & Integration Tests') {
                    steps {
                        echo '🧪 Executing Test Suite...'
                        sh 'npm run test:backend || npm test'
                    }
                }
            }
        }

        stage('Build Production Docker Image') {
            steps {
                echo '🐳 Building Docker Image...'
                sh "docker build -t ${APP_NAME}:latest -t ${APP_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Real-Time Hot Deployment') {
            steps {
                echo '⚡ Deploying Updated Application Container in Real-Time...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Automated Health Check') {
            steps {
                echo '🩺 Verifying Deployment Availability...'
                sleep 5
                sh "curl --fail -s ${HEALTH_ENDPOINT} || exit 1"
            }
        }
    }

    post {
        success {
            echo "✅ REAL-TIME DEPLOYMENT SUCCESSFUL! Build #${BUILD_NUMBER} is live on http://localhost:${PORT}"
        }
        failure {
            echo "❌ BUILD OR DEPLOYMENT FAILED for Build #${BUILD_NUMBER}!"
        }
        always {
            echo "🧹 Cleaning up workspace artifacts..."
        }
    }
}
