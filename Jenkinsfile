pipeline {

  agent {
    label 'ci-slave-01'
  }

  environment {
    INSTANCE_TESTCAFE="kouraicozy1156.cozy.rocks"
    TESTCAFE_USER_PASSWORD="c0zyc0zy!"
  }

  stages {

    stage ('Get latest code') {
      steps {
        checkout scm
      }
    }

    stage ('Setup test environment') {
      steps {
        sh '''
          virtualenv .venv
          . .venv/bin/activate
          npm install testcafe
          npm install fs-extra
          npm install unzipper
          npm install request
          npm install colors
          npm install chrome-remote-interface
          npm install git+https://github.com/cozy/VisualReview-node-client.git#v0.0.4
        '''
      }
    }

    stage ('Check versions') {
      steps {
        sh '''
          . .venv/bin/activate
          google-chrome --version
          node --version
          npm --version
          yarn --version
        '''
      }
    }

    stage ('Testcafé') {
      parallel {
        stage('Testcafé Drive') {
          steps {
            sh '''
              . .venv/bin/activate
              export COZY_APP_SLUG='drive'
              yarn testcafe:$COZY_APP_SLUG
            '''
          }
        }
        stage('Testcafé Photos') {
          steps {
            sh '''
              . .venv/bin/activate
              export COZY_APP_SLUG='photos'

              yarn testcafe:$COZY_APP_SLUG
            '''
          }
        }
      }
    }
  }
}
