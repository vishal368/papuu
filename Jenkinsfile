pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git https://github.com/vishal368/papuu.git
            }
        }
        stage('Unit Tests') {
            steps {
                echo 'Running unit tests'
                // example for a Node.js/JS project
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build & Host with Nginx') {
            steps {
                echo 'Packaging and deploying to nginx'
                // build static assets or copy files to nginx html
                sh "rm -rf /var/www/html/*"
                sh "cp -r * /var/www/html/"
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}