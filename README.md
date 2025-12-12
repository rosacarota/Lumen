<div align="center">
  <img src="./frontend/public/logo-no-sfondo.png" alt="Lumen Logo" width="200">
  <h1>Lumen</h1>
  <p>
    <b>Insieme per un fututo luminoso 💚</b>
  </p>
  <p>
    <!-- Badges -->
    <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
    <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  </p>
</div>

<br />

## 📚 Indice

*   [Descrizione](#descrizione)
*   [Funzionalità Principali](#funzionalità-principali)
*   [Tecnologie Utilizzate](#tecnologie-utilizzate)
*   [Installazione e Configurazione](#installazione-e-configurazione)
*   [Project Team](#project-team)



## <a name="descrizione"></a>📋 Descrizione

**Lumen** è una piattaforma innovativa progettata per colmare il divario tra **Volontari**, **Beneficiari** ed **Enti**. Il nostro obiettivo è facilitare la gestione di eventi, raccolte fondi, e richieste di assistenza, promuovendo la solidarietà e l'impegno sociale.



## <a name="funzionalita"></a> Funzionalità Principali
| Funzionalità | Descrizione |
| :--- | :--- |
| 👥 **Gestione Utenti** | Registrazione e profilazione dedicata per Volontari, Beneficiari ed Enti. |
| 📅 **Eventi** | Creazione, gestione e partecipazione ad eventi sociali. |
| 💰 **Raccolte Fondi** | Monitoraggio trasparente di campagne di donazione, con obiettivi e progressi in tempo reale. |
| 📖 **Storie** | Uno spazio sicuro per condividere esperienze, testimonianze e ispirare la comunità. |
| 🆘 **Richieste di Servizio** | Sistema efficace per inviare e gestire richieste di assistenza mirate. |
| 🤝 **Affiliazioni** | Strumenti per gestire e rafforzare le relazioni tra Volontari ed Enti. |

---

## <a name="tecnologie-utilizzate"></a> Tecnologie Utilizzate 

### Backend
*   ![Java](https://img.shields.io/badge/-Java_17-ED8B00?style=flat&logo=openjdk&logoColor=white) **Java 17**
*   ![Spring Boot](https://img.shields.io/badge/-Spring_Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white) **Spring Boot**: Framework core application.
*   **Spring Data JPA**: Interazione database.
*   **Spring Security & JWT**: Sicurezza e Auth.
*   **MapStruct** & **Lombok**: Utility e mapping.
* **Spring Boot Admin**: Monitoraggio e gestione.

* **Spring Boot devtools**: Sviluppo e debug.

### Frontend
*   ![React](https://img.shields.io/badge/-React_19-20232A?style=flat&logo=react&logoColor=61DAFB) **React 19**
*   ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) **Vite**: Build tool.
*   **React Router**: Navigazione.
*   **Lucide React**: Iconografia.
* **Material UI**: Componenti UI.
* **Material Icons**: Iconografia.
* **Sweetalert2**: Alert e modali.

### Database
*   ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL**



## <a name="installazione"></a> Installazione e Configurazione

### Prerequisiti
*    [Java JDK 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
*    [Node.js & npm 20.11.0](https://nodejs.org/en/download/)
*    [PostgreSQL 16](https://www.postgresql.org/download/)
*    [Maven 3.9.4](https://maven.apache.org/download.cgi)

### 1. Configurazione Database
1.  Crea un database: `lumen`.
2.  Esegui lo script: `db/lumen.sql`.

### 2. Configurazione Backend
Crea il file `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lumen
spring.datasource.username=tuo_username
spring.datasource.password=tua_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Avvia il backend:
```bash
mvn spring-boot:run
```

### 3. Configurazione Frontend
```bash
cd frontend
npm install
npm run dev
```

Apri `http://localhost:5173` per vedere l'app in azione!



## Project Team
### Project Managers

*  [Rosa Carotenuto](https://github.com/rosacarota)
*  [Luigi Guida](https://github.com/Fxller)

### Team Members

#### Backend
*  [Michele Chierchia](https://github.com/Michele98770)

* [Alessandro Cigliano](https://github.com/AleCigliano089)

* [Vittorio Denysenko](https://github.com/Denysvit)

* [Maurizio Santangelo](https://github.com/Santangelom3)

* [Gloria Scarallo](https://github.com/gloriascarallo)


#### Frontend
* [Luca Afeltra](https://github.com/luca-afe)

* [Matteo De Stasio](https://github.com/Matteo-d-s)

* [Marianna Diograzia](https://github.com/Erym35)


* [Giovanni Di Rosa](https://github.com/Giodr03)

*  [Felicia Riccio](https://github.com/ljcia4)

* [Giovanni Pio Scardone](https://github.com/giovanni-s1919)

