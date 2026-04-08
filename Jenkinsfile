pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/vishal368/papuu.git'
            }
        }
        stage('Unit Tests') {
            steps {
                echo 'Running unit tests'
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Build & Host with Nginx') {
            steps {
                // Add your build and nginx hosting commands here
                echo 'Building and hosting with Nginx'
                // Example commands:
                // sh 'npm run build'
                // sh 'sudo systemctl restart nginx'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                rm -rf /var/www/portfolio/*
                cp -r * /var/www/portfolio/
                '''
            }
        }
    }

    post {
        failure {
            script {
                analyzeFailure()
            }
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
        always {
            script {
                collectAndPrintLogs()
            }
        }
    }
}

// ─── Log Collection ───────────────────────────────────────────────
def collectAndPrintLogs() {
    echo "=============================="
    echo "📋 PIPELINE LOG SUMMARY"
    echo "=============================="
    echo "Job       : ${env.JOB_NAME}"
    echo "Build No  : ${env.BUILD_NUMBER}"
    echo "Status    : ${currentBuild.currentResult}"
    echo "Duration  : ${currentBuild.durationString}"
    echo "=============================="
}

// ─── Failure Analyzer ─────────────────────────────────────────────
def analyzeFailure() {
    echo "=============================="
    echo "❌ PIPELINE FAILED — Analyzing..."
    echo "=============================="

    // Capture the full build log
    def buildLog = currentBuild.rawBuild.getLog(200).join('\n')

    // ── Rule-based pattern matching ──
    def reason = detectFailureReason(buildLog)

    echo "🔍 Detected Failure Reason:"
    echo "   → ${reason}"
    echo "=============================="

    // Optional: save report to workspace
    writeFile file: 'failure_report.txt', text: """
Pipeline Failure Report
========================
Job       : ${env.JOB_NAME}
Build No  : ${env.BUILD_NUMBER}
Timestamp : ${new Date()}
Duration  : ${currentBuild.durationString}

Detected Reason:
  ${reason}

Full Log (last 200 lines):
${buildLog}
"""
    echo "📄 Failure report saved to: failure_report.txt"
    archiveArtifacts artifacts: 'failure_report.txt', allowEmptyArchive: true
}

// ─── Pattern Matching Rules ────────────────────────────────────────
def detectFailureReason(String log) {

    // Git / Clone issues
    if (log.contains('Could not read from remote repository') || log.contains('Repository not found')) {
        return "❌ Git Clone Failed: Repository not found or access denied. Check the URL and credentials."
    }
    if (log.contains('error: pathspec') && log.contains('did not match')) {
        return "❌ Git Failed: Branch not found. Check if 'main' branch exists."
    }

    // Permission / File system issues
    if (log.contains('Permission denied') || log.contains('EACCES')) {
        return "❌ Permission Denied: Jenkins lacks write access to /var/www/portfolio/. Run: sudo chown -R jenkins /var/www/portfolio"
    }
    if (log.contains('No such file or directory')) {
        return "❌ Missing File/Directory: Target path doesn't exist. Ensure /var/www/portfolio/ is created."
    }

    // Disk space
    if (log.contains('No space left on device')) {
        return "❌ Disk Full: Server has no disk space left. Free up space and retry."
    }

    // Shell/Script errors
    if (log.contains('command not found')) {
        return "❌ Command Not Found: A shell command is missing. Check if required tools are installed on the agent."
    }
    if (log.contains('exit code 1') || log.contains('exit status 1')) {
        return "❌ Script Exited with Error (exit code 1): One of the shell steps failed. Review the sh block output above."
    }
    if (log.contains('exit code 127')) {
        return "❌ Exit Code 127: Command not found in shell. Check PATH or install the required binary."
    }

    // Network issues
    if (log.contains('Could not resolve host') || log.contains('Network is unreachable')) {
        return "❌ Network Error: DNS resolution or connectivity failed. Check server network/firewall settings."
    }
    if (log.contains('Connection timed out') || log.contains('timed out')) {
        return "❌ Connection Timeout: Network request timed out. Check connectivity to the remote host."
    }

    // Timeout
    if (log.contains('FlowInterruptedException') || log.contains('Timeout has been exceeded')) {
        return "❌ Pipeline Timeout: A stage took too long. Consider increasing timeout or optimizing the step."
    }

    // Groovy/Script compilation
    if (log.contains('WorkflowScript') && log.contains('expecting')) {
        return "❌ Jenkinsfile Syntax Error: Groovy script has a syntax issue. Validate your Jenkinsfile."
    }

    // Default fallback
    return "⚠️ Unknown Failure: Could not auto-detect reason. Review the full console log for details."
}
