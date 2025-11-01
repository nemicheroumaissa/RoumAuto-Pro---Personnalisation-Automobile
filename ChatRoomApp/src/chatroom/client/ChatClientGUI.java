package chatroom.client;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

/**
 * Interface graphique du client de chat
 */
public class ChatClientGUI extends JFrame {
    private JTextArea chatArea;
    private JTextField messageField;
    private JTextField recipientField;
    private JTextField groupField;
    private JButton sendButton;
    private JButton connectButton;
    private JButton disconnectButton;
    private JRadioButton broadcastRadio;
    private JRadioButton unicastRadio;
    private JRadioButton multicastRadio;
    private JTextField usernameField;
    private JTextField serverField;
    private JTextField portField;
    
    private ChatClient client;
    
    public ChatClientGUI() {
        initComponents();
    }
    
    private void initComponents() {
        setTitle("Chat Room - Client");
        setSize(700, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));
        
        // Panel de connexion (en haut)
        JPanel connectionPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        connectionPanel.setBorder(BorderFactory.createTitledBorder("Connexion"));
        
        connectionPanel.add(new JLabel("Nom d'utilisateur:"));
        usernameField = new JTextField(10);
        connectionPanel.add(usernameField);
        
        connectionPanel.add(new JLabel("Serveur:"));
        serverField = new JTextField("localhost", 10);
        connectionPanel.add(serverField);
        
        connectionPanel.add(new JLabel("Port:"));
        portField = new JTextField("5000", 5);
        connectionPanel.add(portField);
        
        connectButton = new JButton("Connecter");
        connectButton.setBackground(new Color(46, 204, 113));
        connectButton.setForeground(Color.WHITE);
        connectButton.addActionListener(e -> connect());
        connectionPanel.add(connectButton);
        
        disconnectButton = new JButton("Déconnecter");
        disconnectButton.setBackground(new Color(231, 76, 60));
        disconnectButton.setForeground(Color.WHITE);
        disconnectButton.setEnabled(false);
        disconnectButton.addActionListener(e -> disconnect());
        connectionPanel.add(disconnectButton);
        
        add(connectionPanel, BorderLayout.NORTH);
        
        // Zone de chat (centre)
        chatArea = new JTextArea();
        chatArea.setEditable(false);
        chatArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        chatArea.setLineWrap(true);
        chatArea.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(chatArea);
        scrollPane.setBorder(BorderFactory.createTitledBorder("Messages"));
        add(scrollPane, BorderLayout.CENTER);
        
        // Panel d'envoi (en bas)
        JPanel sendPanel = new JPanel(new BorderLayout(5, 5));
        sendPanel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        
        // Panel des options de type de message
        JPanel typePanel = new JPanel(new GridLayout(3, 2, 5, 5));
        typePanel.setBorder(BorderFactory.createTitledBorder("Type de message"));
        
        ButtonGroup typeGroup = new ButtonGroup();
        
        broadcastRadio = new JRadioButton("Broadcast (tous)", true);
        broadcastRadio.addActionListener(e -> updateFieldsVisibility());
        typeGroup.add(broadcastRadio);
        typePanel.add(broadcastRadio);
        typePanel.add(new JLabel(""));
        
        unicastRadio = new JRadioButton("Unicast (privé)");
        unicastRadio.addActionListener(e -> updateFieldsVisibility());
        typeGroup.add(unicastRadio);
        typePanel.add(unicastRadio);
        
        recipientField = new JTextField();
        recipientField.setEnabled(false);
        typePanel.add(new JLabel("Destinataire:"));
        typePanel.add(recipientField);
        
        multicastRadio = new JRadioButton("Multicast (groupe)");
        multicastRadio.addActionListener(e -> updateFieldsVisibility());
        typeGroup.add(multicastRadio);
        typePanel.add(multicastRadio);
        
        groupField = new JTextField("default");
        groupField.setEnabled(false);
        typePanel.add(new JLabel("Groupe:"));
        typePanel.add(groupField);
        
        sendPanel.add(typePanel, BorderLayout.NORTH);
        
        // Panel du message
        JPanel messagePanel = new JPanel(new BorderLayout(5, 5));
        messagePanel.setBorder(BorderFactory.createTitledBorder("Votre message"));
        
        messageField = new JTextField();
        messageField.setFont(new Font("SansSerif", Font.PLAIN, 14));
        messageField.addActionListener(e -> sendMessage());
        messagePanel.add(messageField, BorderLayout.CENTER);
        
        sendButton = new JButton("Envoyer");
        sendButton.setBackground(new Color(52, 152, 219));
        sendButton.setForeground(Color.WHITE);
        sendButton.setFont(new Font("SansSerif", Font.BOLD, 14));
        sendButton.setEnabled(false);
        sendButton.addActionListener(e -> sendMessage());
        messagePanel.add(sendButton, BorderLayout.EAST);
        
        sendPanel.add(messagePanel, BorderLayout.CENTER);
        
        add(sendPanel, BorderLayout.SOUTH);
        
        // Centrer la fenêtre
        setLocationRelativeTo(null);
    }
    
    private void updateFieldsVisibility() {
        recipientField.setEnabled(unicastRadio.isSelected());
        groupField.setEnabled(multicastRadio.isSelected());
    }
    
    private void connect() {
        String username = usernameField.getText().trim();
        String server = serverField.getText().trim();
        String portStr = portField.getText().trim();
        
        if (username.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Veuillez entrer un nom d'utilisateur", 
                                        "Erreur", JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        try {
            int port = Integer.parseInt(portStr);
            
            client = new ChatClient(username, this);
            
            if (client.connect(server, port)) {
                displayMessage("=== Connecté au serveur " + server + ":" + port + " ===");
                connectButton.setEnabled(false);
                disconnectButton.setEnabled(true);
                sendButton.setEnabled(true);
                usernameField.setEnabled(false);
                serverField.setEnabled(false);
                portField.setEnabled(false);
            }
            
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Port invalide", "Erreur", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void disconnect() {
        if (client != null) {
            client.disconnect();
            displayMessage("=== Déconnecté du serveur ===");
        }
        
        connectButton.setEnabled(true);
        disconnectButton.setEnabled(false);
        sendButton.setEnabled(false);
        usernameField.setEnabled(true);
        serverField.setEnabled(true);
        portField.setEnabled(true);
    }
    
    private void sendMessage() {
        if (client == null || !client.isConnected()) {
            return;
        }
        
        String message = messageField.getText().trim();
        
        if (message.isEmpty()) {
            return;
        }
        
        if (broadcastRadio.isSelected()) {
            client.sendBroadcast(message);
        } else if (unicastRadio.isSelected()) {
            String recipient = recipientField.getText().trim();
            if (recipient.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Veuillez entrer un destinataire", 
                                            "Erreur", JOptionPane.WARNING_MESSAGE);
                return;
            }
            client.sendUnicast(recipient, message);
        } else if (multicastRadio.isSelected()) {
            String group = groupField.getText().trim();
            if (group.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Veuillez entrer un nom de groupe", 
                                            "Erreur", JOptionPane.WARNING_MESSAGE);
                return;
            }
            client.sendMulticast(group, message);
        }
        
        messageField.setText("");
    }
    
    /**
     * Afficher un message dans la zone de chat
     */
    public void displayMessage(String message) {
        SwingUtilities.invokeLater(() -> {
            chatArea.append(message + "\n");
            chatArea.setCaretPosition(chatArea.getDocument().getLength());
        });
    }
    
    /**
     * Point d'entrée du client
     */
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                // Utiliser le look and feel du système
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            ChatClientGUI gui = new ChatClientGUI();
            gui.setVisible(true);
        });
    }
}
