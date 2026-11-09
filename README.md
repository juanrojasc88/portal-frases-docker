
# Portal de Frases - Grupo 9

Aplicación web desarrollada para la asignatura de Integración Continua, utilizando Docker, Docker Compose, Nginx y Node.js.

## Arquitectura

La aplicación utiliza dos contenedores:

- **Frontend:** Nginx, disponible en el puerto 8080.
- **Backend:** Node.js con Express, puerto 3000.

Ambos contenedores se comunican mediante la red Docker `app-network`, utilizando el nombre DNS `backend`.

Las frases se almacenan en un volumen Docker persistente.

## Requisitos

- Docker Desktop o Docker Engine
- Docker Compose v2

## Ejecución

1. Copiar `.env.example` a `.env`.
2. Ejecutar `docker compose up -d --build`.
3. Abrir http://localhost:8080.

## API REST

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/health | Verificar estado |
| GET | /api/frases | Consultar frases |
| POST | /api/frases | Registrar frase |

## Comandos de validación

    docker compose ps
    docker network inspect app-network
    docker compose exec frontend wget -qO- http://backend:3000/api/health

## Persistencia

Las frases se guardan en `/app/data/frases.json`, dentro del volumen `frases_data`.

## Integración continua

GitHub Actions valida Docker Compose, construye las imágenes, inicia los servicios y comprueba la comunicación entre contenedores en cada push o pull request.

## Integrantes

Grupo 9.
