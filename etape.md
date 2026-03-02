# Guide de Démarrage : Changement de Réseau Wi-Fi

Lorsque vous changez de réseau Wi-Fi (par exemple, en passant du bureau à la maison, ou en changeant de routeur), l'adresse IP locale de votre ordinateur change. Cela empêche les applications (Frontend Web et Mobile) de communiquer avec le Backend si l'ancienne IP est restée dans le code.

Voici les 3 étapes rapides pour relancer le projet sur un **NOUVEAU RÉSEAU**.

---

### Étape 1 : Trouver la nouvelle adresse IP de votre ordinateur
1. Ouvrez un terminal (Invite de commandes ou PowerShell).
2. Tapez la commande suivante :
   ```bash
   ipconfig
   ```
3. Cherchez la ligne **Adresse IPv4** (souvent sous la section *Carte réseau sans fil Wi-Fi*).
   *Exemple : `192.168.1.30`*

---

### Étape 2 : Mettre à jour les adresses IP dans le code

Il faut remplacer l'ancienne adresse IP (ex: `192.168.1.24`) par la **NOUVELLE** adresse IP que vous venez de trouver.

**A. Dans le Frontend (Web)**
1. Ouvrez le fichier : `frontend/.env` (s'il existe, sinon c'est dans `frontend/src/services/api.js` ou dans les composants qui utilisent socket).
2. Cherchez, par exemple dans `frontend/src/pages/ManagerDashboard.jsx`, la ligne (vers la ligne 153) :
   ```javascript
   const socket = io('http://192.168.1.24:5000');
   ```
3. Remplacez par votre nouvelle IP :
   ```javascript
   const socket = io('http://VOTRE_NOUVELLE_IP:5000');
   ```

**B. Dans l'application Mobile (Nageur)**
1. Ouvrez le fichier : `mobile/src/services/api.js`
2. Modifiez l'URL de base :
   ```javascript
   baseURL: 'http://VOTRE_NOUVELLE_IP:5000/api',
   ```

*(Ne modifiez jamais la partie `:5000` car c'est le port du serveur backend).*

---

### Étape 3 : Redémarrer tous les serveurs

Maintenant que le code pointe vers la bonne IP, il faut relancer les 3 terminaux ou vider leurs caches :

1. **Backend** : 
   - Arrêtez avec `Ctrl + C`
   - Relancez : `npm run dev`

2. **Frontend** : 
   - Arrêtez avec `Ctrl + C`
   - Relancez : `npm run dev`

3. **Mobile (TRÈS IMPORTANT)** : 
   - L'application mobile Expo garde l'ancienne IP en cache. Vous **DEVEZ** vider le cache.
   - Arrêtez avec `Ctrl + C`
   - Relancez avec la commande de nettoyage :
   ```bash
   npx expo start -c
   ```
   *Le `-c` (ou `--clear`) force Expo à recharger les nouveaux fichiers modifiés de votre ordinateur au lieu d'utiliser la mémoire.*

---

**🎉 C'est tout !** 
Connectez votre téléphone au **même réseau Wi-Fi** que votre ordinateur, scannez le QR Code Expo, et l'application remarchera immédiatement en temps réel.
