package chatroom.common;

import java.io.Serializable;

/**
 * Classe représentant un message dans le chat
 */
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;
    
    public enum MessageType {
        UNICAST,    // Message privé à un client
        BROADCAST,  // Message à tous les clients
        MULTICAST,  // Message à un groupe
        CONNECT,    // Notification de connexion
        DISCONNECT, // Notification de déconnexion
        USER_LIST   // Liste des utilisateurs
    }
    
    private MessageType type;
    private String sender;
    private String recipient;  // Pour UNICAST
    private String group;      // Pour MULTICAST
    private String content;
    private long timestamp;
    
    public Message(MessageType type, String sender, String content) {
        this.type = type;
        this.sender = sender;
        this.content = content;
        this.timestamp = System.currentTimeMillis();
    }
    
    // Getters et Setters
    public MessageType getType() {
        return type;
    }
    
    public void setType(MessageType type) {
        this.type = type;
    }
    
    public String getSender() {
        return sender;
    }
    
    public void setSender(String sender) {
        this.sender = sender;
    }
    
    public String getRecipient() {
        return recipient;
    }
    
    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }
    
    public String getGroup() {
        return group;
    }
    
    public void setGroup(String group) {
        this.group = group;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    @Override
    public String toString() {
        return String.format("[%s] %s: %s", type, sender, content);
    }
}
