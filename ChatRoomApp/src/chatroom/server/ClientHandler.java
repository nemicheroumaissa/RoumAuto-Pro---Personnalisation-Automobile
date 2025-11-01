package chatroom.server;

import chatroom.common.Message;
import java.io.*;
import java.net.Socket;

/**
 * Thread pour gérer chaque client connecté
 */
public class ClientHandler extends Thread {
    private Socket socket;
    private ChatServer server;
    private ObjectOutputStream out;
    private ObjectInputStream in;
    private String username;
    private String group;
    
    public ClientHandler(Socket socket, ChatServer server) {
        this.socket = socket;
        this.server = server;
        this.group = "default"; // Groupe par défaut
    }
    
    @Override
    public void run() {
        try {
            // Initialiser les flux
            out = new ObjectOutputStream(socket.getOutputStream());
            in = new ObjectInputStream(socket.getInputStream());
            
            // Recevoir le nom d'utilisateur
            Message connectMsg = (Message) in.readObject();
            this.username = connectMsg.getSender();
            
            System.out.println("Nouveau client connecté: " + username);
            
            // Notifier tous les clients de la nouvelle connexion
            Message notification = new Message(Message.MessageType.CONNECT, "Serveur", 
                username + " a rejoint le chat");
            server.broadcast(notification, this);
            
            // Envoyer la liste des utilisateurs au nouveau client
            server.sendUserList(this);
            
            // Boucle de réception des messages
            while (true) {
                Message message = (Message) in.readObject();
                
                if (message == null) break;
                
                System.out.println("Message reçu de " + username + ": " + message.getType());
                
                // Traiter selon le type de message
                switch (message.getType()) {
                    case BROADCAST:
                        server.broadcast(message, this);
                        break;
                        
                    case UNICAST:
                        server.unicast(message);
                        break;
                        
                    case MULTICAST:
                        this.group = message.getGroup();
                        server.multicast(message);
                        break;
                        
                    case DISCONNECT:
                        return;
                }
            }
            
        } catch (EOFException e) {
            System.out.println("Client déconnecté: " + username);
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Erreur avec le client " + username + ": " + e.getMessage());
        } finally {
            cleanup();
        }
    }
    
    /**
     * Envoyer un message au client
     */
    public void sendMessage(Message message) {
        try {
            out.writeObject(message);
            out.flush();
        } catch (IOException e) {
            System.err.println("Erreur d'envoi au client " + username + ": " + e.getMessage());
        }
    }
    
    /**
     * Obtenir le nom d'utilisateur
     */
    public String getUsername() {
        return username;
    }
    
    /**
     * Obtenir le groupe
     */
    public String getGroup() {
        return group;
    }
    
    /**
     * Nettoyer les ressources
     */
    private void cleanup() {
        try {
            // Notifier la déconnexion
            if (username != null) {
                Message disconnectMsg = new Message(Message.MessageType.DISCONNECT, "Serveur",
                    username + " a quitté le chat");
                server.broadcast(disconnectMsg, this);
            }
            
            // Retirer le client de la liste
            server.removeClient(this);
            
            // Fermer les flux et le socket
            if (in != null) in.close();
            if (out != null) out.close();
            if (socket != null) socket.close();
            
        } catch (IOException e) {
            System.err.println("Erreur lors du nettoyage: " + e.getMessage());
        }
    }
}
