pipeline {
    agent any

    environment {
        APP_NAME     = 'aeroops-command-center'
        PORT         = '5000'
        HEALTH_ENDPOINT = 'http://localhost:5000/api/metrics'
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
                    if (isUnix()) {
                        sh 'cd Airline && node -v && npm -v'
                    } else {
                        bat 'cd Airline && node -v && npm -v'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo '📦 Installing Clean NPM Packages...'
                    if (isUnix()) {
                        sh 'cd Airline && npm ci'
                    } else {
                        bat 'cd Airline && npm ci'
                    }
                }
            }
        }

        stage('Code Quality & Tests') {
            parallel {
                stage('TypeScript Type Check') {
                    steps {
                        script {
                            echo '🔍 Running Type Check...'
                            if (isUnix()) {
                                sh 'cd Airline && npx tsc --noEmit'
                            } else {
                                bat 'cd Airline && npx tsc --noEmit'
                            }
                        }
                    }
                }
                stage('Unit & Integration Tests') {
                    steps {
                        script {
                            echo '🧪 Executing Test Suite...'
                            if (isUnix()) {
                                sh 'cd Airline && (npm run test:backend || npm test)'
                            } else {
                                bat 'cd Airline && (npm run test:backend || npm test)'
                            }
                        }
                    }
                }
            }
        }

        stage('Build Production Docker Image') {
            steps {
                script {
                    echo '🐳 Building Docker Image...'
                    if (isUnix()) {
                        sh "cd Airline && docker build -t ${APP_NAME}:latest -t ${APP_NAME}:${BUILD_NUMBER} ."
                    } else {
                        bat "cd Airline && docker build -t ${APP_NAME}:latest -t ${APP_NAME}:${BUILD_NUMBER} ."
                    }
                }
            }
        }

        stage('Real-Time Hot Deployment') {
            steps {
                script {
                    echo '⚡ Deploying Updated Application Container in Real-Time...'
                    if (isUnix()) {
                        sh 'cd Airline && docker-compose down || true'
                        sh 'cd Airline && docker-compose up -d --build'
                    } else {
                        bat 'cd Airline && docker-compose down || echo Container was not active'
                        bat 'cd Airline && docker-compose up -d --build'
                    }
                }
            }
        }

        stage('Automated Health Check') {
            steps {
                script {
                    echo '🩺 Verifying Deployment Availability...'
                    sleep 5
                    if (isUnix()) {
                        sh "curl --fail -s ${HEALTH_ENDPOINT} || exit 1"
                    } else {
                        powershell "try { \$res = Invoke-WebRequest -Uri '${HEALTH_ENDPOINT}' -UseBasicParsing; if (\$res.StatusCode -ne 200) { exit 1 } } catch { exit 1 }"
                    }
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
    }
}
