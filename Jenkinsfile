pipeline {
    agent any

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
                script {
                    echo "🚀 Starting Real-Time CI/CD Pipeline #${BUILD_NUMBER}"
                    sh 'docker run --rm node:20-alpine node -v && docker run --rm node:20-alpine npm -v'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo '📦 Installing Clean NPM Packages via Docker Node Container...'
                    sh 'docker run --rm -v ${WORKSPACE}:/app -w /app node:20-alpine npm ci'
                }
            }
        }

        stage('Code Quality & Tests') {
            parallel {
                stage('TypeScript Type Check') {
                    steps {
                        script {
                            echo '🔍 Running TypeScript Type Check...'
                            sh 'docker run --rm -v ${WORKSPACE}:/app -w /app node:20-alpine npx tsc --noEmit'
                        }
                    }
                }
                stage('Unit & Integration Tests') {
                    steps {
                        script {
                            echo '🧪 Executing Backend & Roster Compliance Test Suite...'
                            sh 'docker run --rm -v ${WORKSPACE}:/app -w /app node:20-alpine npm test'
                        }
                    }
                }
            }
        }

        stage('Build Production Docker Image') {
            steps {
                script {
                    echo '🐳 Building Container Image...'
                    sh "docker build -t ${APP_NAME}:latest -t ${APP_NAME}:${BUILD_NUMBER} ."
                }
            }
        }

        stage('Real-Time Hot Deployment') {
            steps {
                script {
                    echo '⚡ Deploying Updated Application Container in Real-Time...'
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d --build'
                }
            }
        }

        stage('Automated Health Check') {
            steps {
                script {
                    echo '🩺 Verifying Deployment Availability...'
                    sleep 5
                    sh "curl --fail -s ${HEALTH_ENDPOINT} || exit 1"
                }
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
