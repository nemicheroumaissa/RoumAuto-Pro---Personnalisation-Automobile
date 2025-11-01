#!/bin/bash

# Script de compilation pour l'application Chat Room

echo "==================================="
echo "Compilation de l'application Chat Room"
echo "==================================="

# Créer le dossier bin s'il n'existe pas
mkdir -p bin

# Compiler tous les fichiers Java
echo "Compilation en cours..."
javac -d bin -sourcepath src \
    src/chatroom/common/Message.java \
    src/chatroom/server/ClientHandler.java \
    src/chatroom/server/ChatServer.java \
    src/chatroom/client/ChatClient.java \
    src/chatroom/client/ChatClientGUI.java

if [ $? -eq 0 ]; then
    echo "✓ Compilation réussie!"
    echo ""
    echo "Pour lancer le serveur:"
    echo "  java -cp bin chatroom.server.ChatServer"
    echo ""
    echo "Pour lancer un client:"
    echo "  java -cp bin chatroom.client.ChatClientGUI"
else
    echo "✗ Erreur de compilation"
    exit 1
fi
