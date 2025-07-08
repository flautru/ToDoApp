[![Backend Build](https://github.com/flautru/ToDoApp/actions/workflows/backend.yml/badge.svg)](https://github.com/flautru/ToDoApp/actions/workflows/backend.yml)
[![Frontend Build](https://github.com/flautru/ToDoApp/actions/workflows/frontend.yml/badge.svg)](https://github.com/flautru/ToDoApp/actions/workflows/frontend.yml)
# ToDoApp

Application de gestion de tâches (To-Do List) comprenant :
- Un backend Java 17 avec Spring Boot
- Un frontend Angular 19 moderne et responsive

## Sommaire
- [ToDoApp](#todoapp)
  - [Sommaire](#sommaire)
  - [Fonctionnalités](#fonctionnalités)
  - [Architecture](#architecture)
  - [Installation \& Lancement](#installation--lancement)
    - [Backend Java](#backend-java)
  - [L’API sera accessible sur http://localhost:8080/api/tasks.](#lapi-sera-accessible-sur-httplocalhost8080apitasks)
    - [Frontend Angular](#frontend-angular)
  - [API REST](#api-rest)
  - [Tests](#tests)
  - [Auteur](#auteur)

---

## Fonctionnalités

- Créer, lire, modifier, supprimer des tâches
- Filtrer les tâches selon leur statut (complétée/non complétée)
- Marquer une tâche comme terminée ou non
- Interface utilisateur Angular avec vue liste et carte
- Gestion des erreurs utilisateur et serveur
- Application responsive

---

## Architecture
```
ToDoApp/
├── back/ToDoApp/        # Backend Java 17 - Spring Boot
│   ├── src/main/java/com/fabien/ToDoApp/
│   │   ├── controller/  # Contrôleurs REST (TaskController)
│   │   ├── service/     # Logique métier (TaskServiceImpl)
│   │   ├── repository/  # Accès BDD (TaskRepository)
│   │   └── model/       # Entités JPA (Task, etc.)
│   └── ...              # Configurations, tests, etc.
├── front/ToDoFront/     # Frontend Angular 19
│   ├── src/app/
│   │   ├── features/tasks/       # Feature module des tâches
│   │   ├── shared/components/    # Header, Footer, etc.
│   │   └── core/services/        # Gestion des erreurs, services API
│   └── ...              # Config, tests, etc.
└── README.md
```
- **Le backend** expose une API REST sur `/api/tasks`
- **Le frontend** communique avec le backend via HTTP (`http://localhost:8080/api/tasks` par défaut)

---

## Installation & Lancement

### Backend Java

**Pré-requis** : Java 17, Maven

   ```bash
   cd back/ToDoApp
   ./mvnw spring-boot:run
   ```
   
   L’API sera accessible sur http://localhost:8080/api/tasks.
---

### Frontend Angular

**Pré-requis** : Node.js, npm

   ```bash
cd front/ToDoFront
npm install
ng serve
   ```
L’application sera accessible sur http://localhost:4200.

## API REST

Principaux points d’entrée (/api/tasks) :

- GET /api/tasks : Liste toutes les tâches (filtrage possible avec ?completed=true|false)
- GET /api/tasks/{id} : Détail d’une tâche
- POST /api/tasks : Création d’une tâche
- PUT /api/tasks/{id} : Modification d’une tâche
- PATCH /api/tasks/{id}/status : Mise à jour du statut (complétée ou non)
- DELETE /api/tasks/{id} : Suppression
La documentation complète de l’API est accessible via Swagger sur /swagger-ui.html quand le backend tourne. http://localhost:8080/swagger-ui/index.html.

## Tests
Backend : tests unitaires sur services et contrôleurs avec JUnit (voir src/test/java)
Frontend : tests unitaires avec Karma/Jasmine (ng test)

## Auteur
Fabien L. (flautru)
   
