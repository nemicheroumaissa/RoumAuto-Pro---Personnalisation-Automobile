package chatroom.client;

import chatroom.common.Message;
import java.io.*;
import java.net.Socket;

/**
 * Client de chat
 */
public class ChatClient {
    private Socket socket;
    private ObjectOutputStream out;
    private ObjectInputStream in;
    private String username;
    private ChatClientGUI gui;
    private boolean connected;
    
    public ChatClient(String username, ChatClientGUI gui) {
        this.username = username;
        this.gui = gui;
        this.connected = false;
    }
    
    /**
     * Se connecter au serveur
     */
    public boolean connect(String host, int port) {
        try {
            socket = new Socket(host, port);
            out = new ObjectOutputStream(socket.getOutputStream());
            in = new ObjectInputStream(socket.getInputStream());
            
            // Envoyer le nom d'utilisateur
            Message connectMsg = new Message(Message.MessageType.CONNECT, username, "Connexion");
            out.writeObject(connectMsg);
            out.flush();
            
            connected = true;
            
            // Démarrer le thread de réception
            new Thread(new MessageReceiver()).start();
            
            return true;
            
        } catch (IOException e) {
            gui.displayMessage("Erreur de connexion: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Envoyer un message BROADCAST
     */
    public void sendBroadcast(String content) {
        if (!connected) return;
        
        try {
            Message message = new Message(Message.MessageType.BROADCAST, username, content);
            out.writeObject(message);
            out.flush();
            gui.displayMessage("[BROADCAST] Vous: " + content);
        } catch (IOException e) {
            gui.displayMessage("Erreur d'envoi: " + e.getMessage());
        }
    }
    
    /**
     * Envoyer un message UNICAST (privé)
     */
    public void sendUnicast(String recipient, String content) {
        if (!connected) return;
        
        try {
            Message message = new Message(Message.MessageType.UNICAST, username, content);
            message.setRecipient(recipient);
            out.writeObject(message);
            out.flush();
            gui.displayMessage("[PRIVÉ à " + recipient + "] Vous: " + content);
        } catch (IOException e) {
            gui.displayMessage("Erreur d'envoi: " + e.getMessage());
        }
    }
    
    /**
     * Envoyer un message MULTICAST (groupe)
     */
    public void sendMulticast(String group, String content) {
        if (!connected) return;
        
        try {
            Message message = new Message(Message.MessageType.MULTICAST, username, content);
            message.setGroup(group);
            out.writeObject(message);
            out.flush();
            gui.displayMessage("[GROUPE " + group + "] Vous: " + content);
        } catch (IOException e) {
            gui.displayMessage("Erreur d'envoi: " + e.getMessage());
        }
    }
    
    /**
     * Se déconnecter
     */
    public void disconnect() {
        if (!connected) return;
        
        try {
            Message disconnectMsg = new Message(Message.MessageType.DISCONNECT, username, "Déconnexion");
            out.writeObject(disconnectMsg);
            out.flush();
            
            connected = false;
            
            if (in != null) in.close();
            if (out != null) out.close();
            if (socket != null) socket.close();
            
        } catch (IOException e) {
            System.err.println("Erreur de déconnexion: " + e.getMessage());
        }
    }
    
    /**
     * Thread pour recevoir les messages
     */
    private class MessageReceiver implements Runnable {
        @Override
        public void run() {
            try {
                while (connected) {
                    Message message = (Message) in.readObject();
                    
                    if (message == null) break;
                    
                    // Afficher le message selon son type
                    switch (message.getType()) {
                        case BROADCAST:
                            gui.displayMessage("[BROADCAST] " + message.getSender() + ": " + message.getContent());
                            break;
                            
                        case UNICAST:
                            gui.displayMessage("[PRIVÉ de " + message.getSender() + "] " + message.getContent());
                            break;
                            
                        case MULTICAST:
                            gui.displayMessage("[GROUPE " + message.getGroup() + "] " + 
                                             message.getSender() + ": " + message.getContent());
                            break;
                            
                        case CONNECT:
                        case DISCONNECT:
                        case USER_LIST:
                            gui.displayMessage("[INFO] " + message.getContent());
                            break;
                    }
                }
            } catch (EOFException e) {
                gui.displayMessage("Connexion fermée par le serveur");
            } catch (IOException | ClassNotFoundException e) {
                if (connected) {
                    gui.displayMessage("Erreur de réception: " + e.getMessage());
                }
            }
        }
    }
    
    public boolean isConnected() {
        return connected;
    }
}
