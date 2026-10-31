pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    tools {
        // Ensure you configure a NodeJS tool named 'NodeJS-20' in Jenkins (Manage Jenkins > Tools)
        nodejs "NodeJS-20"
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(
            name: 'DEPLOY_TO_NETLIFY',
            defaultValue: true,
            description: 'Deploy the built dist/ to Netlify when building main/master'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    if [ -f package-lock.json ]; then
                        npm ci --legacy-peer-deps || npm install --legacy-peer-deps
                    else
                        npm install --legacy-peer-deps
                    fi
                '''
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test:run'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true, allowEmptyArchive: false
            }
        }

        stage('Deploy to Netlify') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
                expression { return params.DEPLOY_TO_NETLIFY }
            }
            steps {
                // Requires Jenkins credentials:
                //   - netlify-auth-token (Secret text)
                //   - netlify-site-id    (Secret text)
                withCredentials([
                    string(credentialsId: 'netlify-auth-token', variable: 'NETLIFY_AUTH_TOKEN'),
                    string(credentialsId: 'netlify-site-id', variable: 'NETLIFY_SITE_ID')
                ]) {
                    sh '''
                        # NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID are exported above
                        # and read automatically by the Netlify CLI.
                        npx --yes --package netlify-cli@23.15.1 netlify deploy \
                            --dir=dist \
                            --prod \
                            --message "Jenkins #$BUILD_NUMBER - $(git rev-parse --short HEAD)"
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    def imageTag = "${env.BUILD_NUMBER}"
                    def imageLatest = "latest"
                    docker.build("agy-demo:${imageTag}")
                    docker.build("agy-demo:${imageLatest}")
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }
        always {
            cleanWs()
        }
    }
}
