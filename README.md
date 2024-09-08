# **User Management Application 01**

## **Description**
Cette application Angular permet de gérer les utilisateurs au sein d'une organisation. Elle permet d'ajouter, modifier, supprimer, et filtrer les utilisateurs selon différents critères (nom, département, genre, etc.). Les fonctionnalités incluent la pagination, la gestion des doublons, et l'affichage dynamique des utilisateurs en fonction de leurs salaires et statuts.

## **Fonctionnalités principales**
- **Affichage des utilisateurs** : Liste paginée des utilisateurs avec la possibilité de filtrer par nom, département, salaire, genre, et statut.
- **Ajout d'utilisateur** : Formulaire pour ajouter un nouvel utilisateur, avec génération d'un identifiant unique et validation des doublons.
- **Modification des utilisateurs** : Possibilité de mettre à jour les informations d'un utilisateur existant.
- **Suppression d'utilisateur** : Suppression individuelle ou en masse des utilisateurs.
- **Calculs dynamiques** :
  - **Total des salaires** des utilisateurs actifs.
  - **Nombre total d'utilisateurs**.

## **Technologies utilisées**
- **Frontend** : Angular avec les modules FormsModule, ReactiveFormsModule, ngx-toastr pour les notifications, et ngx-pagination pour la gestion des pages.
- **Backend** : API REST simulée avec `HttpClient` pour les opérations CRUD.
- **Styling** : CSS pour la mise en page et la gestion de l'interface utilisateur.

## **Structure du projet**
- **Components** : 
  - `UserComponent` : Gestion de l'interface utilisateur pour l'affichage, le filtrage, l'ajout, la modification, et la suppression des utilisateurs.
- **Services** : 
  - `UserService` : Service Angular pour les opérations CRUD avec le backend simulé via `HttpClient`.
- **Models** :
  - `User` : Interface TypeScript représentant un utilisateur.

## **Installation**
1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/SOULEYMANEHAMANEADJI/user-mgt-01.git
   ```
2. **Installer les dépendances** :
   ```bash
   cd user-management-app
   npm install
   ```
3. **Démarrer le serveur** :
   ```bash
   ng serve
   ```
   L'application sera accessible via `http://localhost:4200`.

4. **Backend Simulé** :
   - Utilisez un serveur JSON local comme `json-server` pour simuler l'API REST.
   - Lancer `json-server` :
     ```bash
     json-server --watch db.json --port 3000
     ```

## **Utilisation**
1. **Naviguer à l'URL** `http://localhost:4200` pour accéder à l'application.
2. **Gérer les utilisateurs** en utilisant les fonctionnalités d'ajout, modification, et suppression.
3. **Utiliser les filtres** pour rechercher des utilisateurs spécifiques.

## **Remarques**
- **Gestion des doublons** : L'application empêche l'ajout d'un utilisateur avec un nom déjà existant.
- **Gestion des erreurs** : Notifications d'erreur pour toute opération qui échoue.
