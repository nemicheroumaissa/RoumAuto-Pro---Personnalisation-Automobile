# Application de Chat Room en Java

Application de chat graphique multi-clients avec serveur multithread supportant trois types de communication.

## 📋 Fonctionnalités

### Types de Communication
1. **BROADCAST** - Envoyer un message à tous les clients connectés
2. **UNICAST** - Envoyer un message privé à un client spécifique
3. **MULTICAST** - Envoyer un message à un groupe de clients

### Caractéristiques
- ✅ Serveur multithread (gère plusieurs clients simultanément)
- ✅ Interface graphique Swing moderne
- ✅ Connexion/Déconnexion dynamique
- ✅ Notifications de connexion/déconnexion
- ✅ Liste des utilisateurs connectés
- ✅ Groupes de discussion

## 🏗️ Structure du Projet

```
ChatRoomApp/
├── src/
│   └── chatroom/
│       ├── common/
│       │   └── Message.java          # Classe de message sérialisable
│       ├── server/
│       │   ├── ChatServer.java       # Serveur principal
│       │   └── ClientHandler.java    # Thread pour chaque client
│       └── client/
│           ├── ChatClient.java       # Logique du client
│           └── ChatClientGUI.java    # Interface graphique
└── README.md
```

## 🚀 Compilation et Exécution

### Avec NetBeans
1. Ouvrir NetBeans
2. File → Open Project → Sélectionner le dossier `ChatRoomApp`
3. Clic droit sur le projet → Build
4. Pour lancer le serveur: Clic droit sur `ChatServer.java` → Run File
5. Pour lancer un client: Clic droit sur `ChatClientGUI.java` → Run File

### En ligne de commande

#### Compilation
```bash
cd ChatRoomApp
javac -d bin src/chatroom/common/*.java src/chatroom/server/*.java src/chatroom/client/*.java
```

#### Exécution du Serveur
```bash
java -cp bin chatroom.server.ChatServer
```

#### Exécution du Client
```bash
java -cp bin chatroom.client.ChatClientGUI
```

## 📖 Guide d'Utilisation

### Démarrer le Serveur
1. Lancer `ChatServer.java`
2. Le serveur écoute sur le port 5000 par défaut
3. Attendre les connexions des clients

### Connecter un Client
1. Lancer `ChatClientGUI.java`
2. Entrer votre nom d'utilisateur
3. Vérifier l'adresse du serveur (localhost par défaut)
4. Cliquer sur "Connecter"

### Envoyer des Messages

#### BROADCAST (à tous)
1. Sélectionner "Broadcast (tous)"
2. Taper votre message
3. Cliquer "Envoyer" ou appuyer sur Entrée

#### UNICAST (privé)
1. Sélectionner "Unicast (privé)"
2. Entrer le nom du destinataire
3. Taper votre message
4. Envoyer

#### MULTICAST (groupe)
1. Sélectionner "Multicast (groupe)"
2. Entrer le nom du groupe (ex: "amis", "travail")
3. Taper votre message
4. Envoyer (seuls les membres du même groupe recevront le message)

## 🔧 Configuration

### Changer le Port du Serveur
Dans `ChatServer.java`, modifier:
```java
private static final int PORT = 5000; // Votre port
```

### Groupe par Défaut
Dans `ClientHandler.java`, modifier:
```java
this.group = "default"; // Votre groupe par défaut
```

## 🧪 Test de l'Application

### Test Complet
1. Démarrer le serveur
2. Lancer 3-4 clients avec des noms différents
3. Tester BROADCAST: tous les clients reçoivent le message
4. Tester UNICAST: seul le destinataire reçoit le message
5. Tester MULTICAST: 
   - Mettre 2 clients dans le groupe "groupe1"
   - Mettre 2 clients dans le groupe "groupe2"
   - Envoyer un message multicast au "groupe1"
   - Vérifier que seuls les membres de "groupe1" le reçoivent

## 📝 Architecture Technique

### Serveur (ChatServer)
- Utilise `ServerSocket` pour accepter les connexions
- Crée un thread `ClientHandler` pour chaque client
- Maintient une liste synchronisée de tous les clients
- Implémente les trois types de diffusion

### ClientHandler (Thread)
- Gère la communication avec un client spécifique
- Reçoit et traite les messages du client
- Envoie les messages au client
- Nettoie les ressources à la déconnexion

### Client (ChatClient)
- Se connecte au serveur via Socket
- Utilise ObjectInputStream/ObjectOutputStream pour la sérialisation
- Thread séparé pour recevoir les messages
- Méthodes pour chaque type d'envoi

### Interface (ChatClientGUI)
- Interface Swing moderne et intuitive
- Radio buttons pour sélectionner le type de message
- Champs dynamiques selon le type sélectionné
- Zone de chat avec scroll automatique

## 🔒 Sécurité et Bonnes Pratiques

- Synchronisation des accès à la liste des clients
- Gestion propre des exceptions
- Fermeture correcte des ressources (try-with-resources recommandé)
- Threads démons pour éviter les blocages

## 🐛 Dépannage

### Le client ne peut pas se connecter
- Vérifier que le serveur est démarré
- Vérifier l'adresse et le port
- Vérifier le pare-feu

### Messages non reçus
- Vérifier le type de message sélectionné
- Pour UNICAST: vérifier l'orthographe du nom du destinataire
- Pour MULTICAST: vérifier que les clients sont dans le même groupe

## 📚 Concepts Java Utilisés

- **Sockets** (java.net.Socket, ServerSocket)
- **Threads** (Thread, Runnable)
- **Sérialisation** (Serializable, ObjectInputStream/ObjectOutputStream)
- **Swing** (JFrame, JPanel, JTextArea, etc.)
- **Collections synchronisées** (synchronized blocks)
- **Enums** (MessageType)

## 👥 Auteur

Application développée pour démontrer:
- La programmation réseau en Java
- Le multithreading
- Les interfaces graphiques Swing
- Les patterns de communication client-serveur
