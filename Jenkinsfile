
pipeline {
    agent {
        label 'docker-agent'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        COMPOSE_FILE = 'docker-compose.ci.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh '''
                    docker compose -p portal-ci-${BUILD_NUMBER} \
                      -f ${COMPOSE_FILE} build
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    set -eu

                    docker compose -p portal-ci-${BUILD_NUMBER} \
                      -f ${COMPOSE_FILE} up -d

                    echo "Esperando respuesta del backend..."

                    docker compose -p portal-ci-${BUILD_NUMBER} \
                      -f ${COMPOSE_FILE} exec -T frontend \
                      sh -c '
                        for i in $(seq 1 30); do
                          if wget -qO- http://backend:3000/api/health; then
                            exit 0
                          fi
                          sleep 2
                        done
                        exit 1
                      '
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker compose -p portal-ci-${BUILD_NUMBER} \
                  -f ${COMPOSE_FILE} down -v --remove-orphans
            '''
        }

        success {
            echo 'Pipeline completado correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisar la consola de Jenkins.'
        }
    }
}
