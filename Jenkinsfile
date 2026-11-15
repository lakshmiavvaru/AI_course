pipeline {
  agent any

  parameters {
    string(name: 'TAG', defaultValue: '@smoke', description: 'Playwright tag to run')
  }

  environment {
    TEST_ENV = 'trial'
    CI = 'true'
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }
    stage('Test') {
      steps {
        withCredentials([
          string(credentialsId: 'sf-base-url', variable: 'SF_BASE_URL'),
          string(credentialsId: 'sf-login-url', variable: 'SF_LOGIN_URL'),
          string(credentialsId: 'sf-username', variable: 'SF_USERNAME'),
          string(credentialsId: 'sf-password', variable: 'SF_PASSWORD'),
          string(credentialsId: 'sf-mfa-secret', variable: 'SF_MFA_SECRET')
        ]) {
          sh 'npx playwright test --grep "${TAG}"'
        }
      }
    }
  }

  post {
    always {
      junit 'test-results/junit.xml'
      archiveArtifacts artifacts: 'playwright-report/**, allure-results/**', allowEmptyArchive: true
    }
  }
}
