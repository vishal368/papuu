pipeline {
    agent any
    environment {
        // adjust these to match your Jenkins setup
        SONARQUBE_SERVER = 'SonarQube'  // name of SonarQube installation in Jenkins
        PROJECT_KEY = 'portfolioo'
        PROJECT_NAME = 'Portfolioo'
    }
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
        // stage('SonarQube Analysis') {
        //     environment {
        //         scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
        //     }
        //     steps {
        //         echo 'Running SonarQube scanner'
        //         withSonarQubeEnv('SonarQube') {
        //             sh "${scannerHome}/bin/sonar-scanner \
        //                 -Dsonar.projectKey=${PROJECT_KEY} \
        //                 -Dsonar.projectName=${PROJECT_NAME} \
        //                 -Dsonar.sources=."
        //         }
        //     }
        // }
        stage('Build & Host with Nginx') {
            steps {
                echo 'Packaging and deploying to nginx'
                // build static assets or copy files to nginx html
                sh 'cp -R * /usr/share/nginx/html/'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}