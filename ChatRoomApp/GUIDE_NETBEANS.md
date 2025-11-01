# Guide d'Utilisation avec NetBeans

## 📦 Ouvrir le Projet dans NetBeans

### Méthode 1: Ouvrir le Projet Existant
1. Lancer **NetBeans IDE**
2. Menu: **File** → **Open Project**
3. Naviguer vers le dossier `ChatRoomApp`
4. Sélectionner le projet et cliquer sur **Open Project**
5. Le projet apparaîtra dans l'explorateur de projets

### Méthode 2: Importer comme Nouveau Projet
1. Lancer **NetBeans IDE**
2. Menu: **File** → **New Project**
3. Choisir **Java** → **Java Project with Existing Sources**
4. Cliquer **Next**
5. Nommer le projet: `ChatRoomApp`
6. Cliquer **Next**
7. Ajouter le dossier `src` comme source
8. Cliquer **Finish**

## 🔨 Compiler le Projet

### Dans NetBeans
1. Clic droit sur le projet **ChatRoomApp** dans l'explorateur
2. Sélectionner **Build** ou **Clean and Build**
3. Vérifier la fenêtre **Output** pour les messages de compilation
4. Si succès: "BUILD SUCCESSFUL"

### Raccourcis Clavier
- **F11**: Build Project
- **Shift + F11**: Clean and Build

## ▶️ Exécuter l'Application

### Lancer le Serveur
1. Dans l'explorateur de projets, naviguer vers:
   ```
   ChatRoomApp → Source Packages → chatroom.server → ChatServer.java
   ```
2. **Clic droit** sur `ChatServer.java`
3. Sélectionner **Run File** (ou appuyer sur **Shift + F6**)
4. Le serveur démarre dans la fenêtre Output
5. Vous devriez voir:
   ```
   =================================
   Serveur de chat démarré sur le port 5000
   En attente de connexions...
   =================================
   ```

### Lancer un Client (Interface Graphique)
1. Dans l'explorateur de projets, naviguer vers:
   ```
   ChatRoomApp → Source Packages → chatroom.client → ChatClientGUI.java
   ```
2. **Clic droit** sur `ChatClientGUI.java`
3. Sélectionner **Run File** (ou appuyer sur **Shift + F6**)
4. Une fenêtre graphique s'ouvre

### Lancer Plusieurs Clients
- Répéter l'opération ci-dessus pour chaque client
- Chaque client aura sa propre fenêtre
- Donner un nom différent à chaque client

## 🎯 Configuration du Projet Principal

### Définir la Classe Principale (Main Class)

#### Pour le Serveur
1. Clic droit sur le projet **ChatRoomApp**
2. Sélectionner **Properties**
3. Aller dans **Run**
4. Dans **Main Class**, entrer: `chatroom.server.ChatServer`
5. Cliquer **OK**
6. Maintenant **F6** lancera le serveur

#### Pour le Client
1. Suivre les mêmes étapes
2. Dans **Main Class**, entrer: `chatroom.client.ChatClientGUI`
3. Cliquer **OK**

## 🐛 Débogage

### Déboguer le Serveur
1. Ouvrir `ChatServer.java`
2. Cliquer dans la marge gauche pour placer des **breakpoints** (points d'arrêt)
3. Clic droit sur `ChatServer.java`
4. Sélectionner **Debug File** (ou **Ctrl + Shift + F5**)
5. Le programme s'arrêtera aux breakpoints

### Déboguer le Client
1. Même procédure avec `ChatClientGUI.java`
2. Placer des breakpoints où nécessaire
3. Debug File

### Outils de Débogage
- **F7**: Step Into (entrer dans une méthode)
- **F8**: Step Over (passer à la ligne suivante)
- **Ctrl + F7**: Step Out (sortir de la méthode)
- **F5**: Continue (continuer l'exécution)

## 📁 Structure dans NetBeans

```
ChatRoomApp
├── Source Packages
│   └── chatroom
│       ├── common
│       │   └── Message.java
│       ├── server
│       │   ├── ChatServer.java
│       │   └── ClientHandler.java
│       └── client
│           ├── ChatClient.java
│           └── ChatClientGUI.java
├── Libraries
│   └── JDK (Java SE)
└── Configuration Files
    ├── build.xml
    └── project files
```

## 🔧 Personnalisation dans NetBeans

### Changer le Port du Serveur
1. Ouvrir `ChatServer.java`
2. Trouver la ligne:
   ```java
   private static final int PORT = 5000;
   ```
3. Modifier le numéro de port
4. Sauvegarder (**Ctrl + S**)
5. Rebuild le projet

### Modifier l'Interface Graphique
1. Ouvrir `ChatClientGUI.java`
2. NetBeans peut afficher le **GUI Builder** (si configuré)
3. Sinon, modifier le code directement dans `initComponents()`

## 📊 Fenêtres Utiles dans NetBeans

### Output Window
- **Ctrl + 4**: Afficher/Masquer
- Montre les messages de compilation et d'exécution
- Affiche les `System.out.println()`

### Navigator
- **Ctrl + 7**: Afficher/Masquer
- Vue d'ensemble des classes, méthodes, variables

### Projects
- **Ctrl + 1**: Afficher/Masquer
- Explorateur de projets

### Files
- **Ctrl + 2**: Afficher/Masquer
- Vue du système de fichiers

## ⚙️ Paramètres Recommandés

### Encodage
1. Clic droit sur le projet → **Properties**
2. **Sources** → **Encoding**: UTF-8

### Version Java
1. Clic droit sur le projet → **Properties**
2. **Sources** → **Source/Binary Format**: 1.8 ou supérieur

### Formatage du Code
1. **Tools** → **Options**
2. **Editor** → **Formatting**
3. Configurer selon vos préférences

## 🚀 Raccourcis Clavier Utiles

| Raccourci | Action |
|-----------|--------|
| **Ctrl + Space** | Auto-complétion |
| **Ctrl + Shift + I** | Corriger les imports |
| **Alt + Shift + F** | Formater le code |
| **Ctrl + /** | Commenter/Décommenter |
| **F6** | Run Main Project |
| **Shift + F6** | Run File |
| **F11** | Build Project |
| **Ctrl + S** | Sauvegarder |
| **Ctrl + F** | Rechercher |
| **Ctrl + H** | Remplacer |

## 📝 Créer un JAR Exécutable

1. Clic droit sur le projet → **Properties**
2. **Build** → **Packaging**
3. Cocher **Build JAR after Compiling**
4. **Run** → Définir la **Main Class**
5. Clic droit sur le projet → **Clean and Build**
6. Le JAR sera dans le dossier `dist/`

### Exécuter le JAR
```bash
java -jar dist/ChatRoomApp.jar
```

## 🧪 Tests

### Scénario de Test Complet
1. **Lancer le serveur** (Run ChatServer.java)
2. **Lancer Client 1** (Run ChatClientGUI.java)
   - Nom: Alice
   - Connecter
3. **Lancer Client 2** (Run ChatClientGUI.java)
   - Nom: Bob
   - Connecter
4. **Lancer Client 3** (Run ChatClientGUI.java)
   - Nom: Charlie
   - Connecter

### Test BROADCAST
- Alice envoie un message en mode Broadcast
- Bob et Charlie doivent le recevoir

### Test UNICAST
- Bob envoie un message privé à Alice
- Seule Alice doit le recevoir

### Test MULTICAST
- Alice et Bob rejoignent le groupe "amis"
- Charlie rejoint le groupe "travail"
- Alice envoie un message au groupe "amis"
- Seul Bob doit le recevoir

## ❓ Résolution de Problèmes

### Erreur: "Main class not found"
- Vérifier que la classe principale est définie
- Rebuild le projet

### Erreur: "Port already in use"
- Un serveur est déjà en cours d'exécution
- Arrêter le processus ou changer le port

### Interface graphique ne s'affiche pas
- Vérifier que le JDK inclut JavaFX/Swing
- Essayer avec un JDK différent

### Erreurs de compilation
- Vérifier que tous les fichiers sont présents
- Clean and Build
- Vérifier la version Java (minimum 1.8)

## 📚 Ressources

- [Documentation NetBeans](https://netbeans.apache.org/kb/)
- [Java Socket Programming](https://docs.oracle.com/javase/tutorial/networking/sockets/)
- [Swing Tutorial](https://docs.oracle.com/javase/tutorial/uiswing/)

## 💡 Conseils

1. **Toujours démarrer le serveur avant les clients**
2. **Utiliser des noms d'utilisateur différents** pour chaque client
3. **Vérifier la fenêtre Output** pour les messages du serveur
4. **Placer des breakpoints** pour comprendre le flux d'exécution
5. **Utiliser Clean and Build** en cas de problème de compilation
