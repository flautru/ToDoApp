
### Backend
[![Backend Build](https://github.com/flautru/ToDoApp/actions/workflows/backend.yml/badge.svg)](https://github.com/flautru/ToDoApp/actions/workflows/backend.yml)
[![Coverage Backend](https://codecov.io/gh/flautru/ToDoApp/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/flautru/ToDoApp)

### Frontend
[![Frontend Build](https://github.com/flautru/ToDoApp/actions/workflows/frontend.yml/badge.svg)](https://github.com/flautru/ToDoApp/actions/workflows/frontend.yml)
[![Coverage Frontend](https://codecov.io/gh/flautru/ToDoApp/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/flautru/ToDoApp)
# ToDoApp

## Description

ToDoApp est une application fullstack de gestion de tâches avec authentification sécurisée. Elle permet aux utilisateurs de créer, modifier, supprimer et organiser leurs tâches avec une interface moderne et intuitive.

## Fonctionnalités

### Gestion des tâches
- **CRUD complet** : Créer, lire, modifier et supprimer des tâches
- **Propriétés des tâches** : ID, label, description, statut (completed/incomplete)
- **Affichage flexible** : Vue en liste ou en cartes
- **Filtrage** : Afficher les tâches par statut (complétées ou non)
- **Recherche** : Recherche en temps réel par label

### Authentification et sécurité
- **Création de compte** utilisateur
- **Connexion sécurisée** avec JWT
- **Protection des routes** avec Spring Security
- **Gestion des sessions** utilisateur

## Architecture

### Backend (Spring Boot)
- **API REST** avec Spring Web
- **Base de données** H2 (en mémoire)
- **Sécurité** avec Spring Security et JWT
- **Validation** des données
- **Documentation** API avec OpenAPI/Swagger

### Frontend (Angular)
- **Interface moderne** avec Angular Material
- **Gestion des états** avec RxJS
- **Routage** sécurisé
- **Composants réutilisables**

## Technologies utilisées

### Backend
- **Java 17**
- **Spring Boot 3.5.3**
- **Spring Data JPA** (persistance)
- **Spring Security** (authentification)
- **H2 Database** (base de données en mémoire)
- **JWT** (JSON Web Tokens)
- **Lombok** (réduction du code boilerplate)
- **MapStruct** (mapping objet-objet)
- **OpenAPI/Swagger** (documentation API)
- **JaCoCo** (couverture de code)

### Frontend
- **Angular 19**
- **Angular Material** (composants UI)
- **TypeScript**
- **RxJS**
- **Karma + Jasmine** (tests)

## Installation et démarrage

### Prérequis
- **Java 17** ou plus récent
- **Maven 3.6+**
- **Node.js 18+** et npm
- **Angular CLI** (`npm install -g @angular/cli`)

### Backend (API Spring Boot)

1. Cloner le repository
```bash
git clone https://github.com/flautru/ToDoApp.git
cd ToDoApp
```

2. Lancer l'application backend
```bash
mvn spring-boot:run
```

L'API sera disponible sur `http://localhost:8080`

### Frontend (Angular)

1. Naviguer vers le dossier frontend
```bash
cd ToDoFront
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer l'application
```bash
npm start
```

L'application sera disponible sur `http://localhost:4200`

## Utilisation

### Créer un compte
1. Accéder à l'application
2. Cliquer sur "Créer un utilisateur"
3. Remplir le formulaire de création de compte

### Se connecter
1. Utiliser vos identifiants pour vous connecter
2. Accéder aux tâches (par défaut version liste)

### Gérer les tâches
- **Ajouter** : Cliquer sur "Ajouter"
- **Modifier** : Cliquer sur la tâche
- **Supprimer** : Cliquer sur l'icône de suppression
- **Marquer comme complétée** : Après avoir cliqué sur la tâche cocher la case correspondante
- **Filtrer** : Utiliser les boutons de filtre (Toutes/Complétées/En cours)
- **Rechercher** : Taper dans la barre de recherche et valider avec entrée

### Changer l'affichage
- **Vue liste** : Affichage compact en lignes
- **Vue cartes** : Affichage détaillé en cartes

## API Endpoints

### Authentification
- `POST /api/user/add` - Créer un utilisateur simple permettant de se loguer (dans l'avenir, utiliser plutot un auth/registration)
- `POST /api/auth/login` - Se connecter

### Tâches
- `GET /api/tasks` - Récupérer toutes les tâches
- `GET /api/tasks?completed=true` - Récupérer les tâches complétées
- `GET /api/tasks?completed=false` - Récupérer les tâches en cours
- `POST /api/tasks` - Créer une tâche
- `PUT /api/tasks/{id}` - Modifier une tâche
- `PATCH /api/taks/{id}/status` - Modifie le completed de la tâche
- `DELETE /api/tasks/{id}` - Supprimer une tâche

### Documentation API
La documentation complète de l'API est disponible via Swagger UI :
(Seul endpoint GET /api/tasks est vraiment documenté, laissé par défaut pour les autres pour le moment)
`http://localhost:8080/swagger-ui.html`

## Tests

### Backend
```bash
# Exécuter les tests
mvn test
```

### Frontend
```bash
# Exécuter les tests
npm test

# Tests avec couverture
npm run test -- --code-coverage
```

## Structure du projet

```
ToDoApp/
├── src/main/java/com/fabien/ToDoApp/
│   ├── config/         # Configuration Spring Security et Swagger
│   ├── controller/     # Controllers REST
│   ├── dto/            # Data Transfer Objects
│   ├── exception/      # GlobalExceptionHandler et custom exception
│   ├── mapper/         # Mapper 
│   ├── model/          # Entités JPA
│   ├── repository/     # Repositories JPA
│   ├── service/        # Logique métier
│   └── security/       # Configuration JWT
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

```
ToDoFront/
    ├── src/app/
    │   ├── core
    │   │   ├── guards
    │   │   ├── interceptors
    │   │   └── services # Auth service et error-handler
    │   ├── features
    │   │   ├── login
    │   │   │   ├── model
    │   │   │   ├── pages
    │   │   │   ├── services
    │   │   │   ├── login-routing.module.ts
    │   │   │   └── login.module.ts
    │   │   ├── tasks # Meme structure que login
    │   │   └── users # Meme structure que login
    │   └── shared
    │       ├── components
    │       └── validators
    └── package.json

```
## Auteur

- **Fabien** - Développeur fullstack

## Notes techniques

- La base de données H2 est en mémoire, les données sont perdues au redémarrage
- Les tokens JWT ont une durée de vie limitée
- L'application utilise les dernières versions de Spring Boot et Angular
- La couverture de code est générée automatiquement avec JaCoCo

## Piste d'amélioration

- Ajouter un champ userId dans les tâches pour que chaque utilisateur puisse avoir ses propres tâches
- Utilisation des rôles actuellement le rôle des users est inutile, mettre en place un rôle admin qui peut voir les tâches de tous les utilisateurs, ou que seul un admin puisse supprimer une tâche
- Création du endpoint auth/register afin de creer les utilisateurs plutot que utilisateur add utilisé actuellement
- Création d'un filtrage par label dans le back avec un renvoie par page (actuellement on renvoie toutes les tâches dans le cadre d'une base H2 cela convient mais cela pose problème avec un gros volume de donnée)
