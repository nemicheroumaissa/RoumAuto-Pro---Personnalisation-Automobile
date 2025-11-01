package chatroom.server;

import chatroom.common.Message;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

/**
 * Serveur de chat multithread
 */
public class ChatServer {
    private static final int PORT = 5000;
    private List<ClientHandler> clients;
    private ServerSocket serverSocket;
    private boolean running;
    
    public ChatServer() {
        clients = new ArrayList<>();
        running = false;
    }
    
    /**
     * Démarrer le serveur
     */
    public void start() {
        try {
            serverSocket = new ServerSocket(PORT);
            running = true;
            System.out.println("=================================");
            System.out.println("Serveur de chat démarré sur le port " + PORT);
            System.out.println("En attente de connexions...");
            System.out.println("=================================");
            
            // Accepter les connexions des clients
            while (running) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Nouvelle connexion depuis: " + clientSocket.getInetAddress());
                
                // Créer un thread pour gérer le client
                ClientHandler clientHandler = new ClientHandler(clientSocket, this);
                synchronized (clients) {
                    clients.add(clientHandler);
                }
                clientHandler.start();
            }
            
        } catch (IOException e) {
            if (running) {
                System.err.println("Erreur du serveur: " + e.getMessage());
            }
        } finally {
            stop();
        }
    }
    
    /**
     * BROADCAST: Envoyer un message à tous les clients
     */
    public void broadcast(Message message, ClientHandler sender) {
        synchronized (clients) {
            for (ClientHandler client : clients) {
                if (client != sender) {
                    client.sendMessage(message);
                }
            }
        }
        System.out.println("BROADCAST de " + message.getSender() + " à " + clients.size() + " clients");
    }
    
    /**
     * UNICAST: Envoyer un message à un client spécifique
     */
    public void unicast(Message message) {
        synchronized (clients) {
            for (ClientHandler client : clients) {
                if (client.getUsername().equals(message.getRecipient())) {
                    client.sendMessage(message);
                    System.out.println("UNICAST de " + message.getSender() + " à " + message.getRecipient());
                    return;
                }
            }
        }
        System.out.println("UNICAST échoué: destinataire " + message.getRecipient() + " non trouvé");
    }
    
    /**
     * MULTICAST: Envoyer un message à un groupe spécifique
     */
    public void multicast(Message message) {
        String targetGroup = message.getGroup();
        int count = 0;
        
        synchronized (clients) {
            for (ClientHandler client : clients) {
                if (client.getGroup().equals(targetGroup) && 
                    !client.getUsername().equals(message.getSender())) {
                    client.sendMessage(message);
                    count++;
                }
            }
        }
        System.out.println("MULTICAST de " + message.getSender() + " au groupe '" + 
                          targetGroup + "' (" + count + " clients)");
    }
    
    /**
     * Envoyer la liste des utilisateurs connectés
     */
    public void sendUserList(ClientHandler recipient) {
        StringBuilder userList = new StringBuilder("Utilisateurs connectés: ");
        synchronized (clients) {
            for (ClientHandler client : clients) {
                if (client.getUsername() != null) {
                    userList.append(client.getUsername()).append(" [").append(client.getGroup()).append("], ");
                }
            }
        }
        
        Message listMessage = new Message(Message.MessageType.USER_LIST, "Serveur", userList.toString());
        recipient.sendMessage(listMessage);
    }
    
    /**
     * Retirer un client de la liste
     */
    public void removeClient(ClientHandler client) {
        synchronized (clients) {
            clients.remove(client);
            System.out.println("Client retiré. Clients restants: " + clients.size());
        }
    }
    
    /**
     * Arrêter le serveur
     */
    public void stop() {
        running = false;
        try {
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
            System.out.println("Serveur arrêté");
        } catch (IOException e) {
            System.err.println("Erreur lors de l'arrêt du serveur: " + e.getMessage());
        }
    }
    
    /**
     * Point d'entrée du serveur
     */
    public static void main(String[] args) {
        ChatServer server = new ChatServer();
        server.start();
    }
}
