#!/bin/bash

# Script pour lancer le serveur de chat

echo "==================================="
echo "Démarrage du serveur de chat"
echo "==================================="

java -cp bin chatroom.server.ChatServer
