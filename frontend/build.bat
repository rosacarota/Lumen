@echo off
setlocal enabledelayedexpansion

:: =========================================================
:: CONFIGURAZIONE (MODIFICA QUI)
:: =========================================================
set NOME_PROGETTO=Lumen
set APP_ID=it.lumen
set VITE_OUTPUT_DIR=dist

echo.
echo =========================================================
echo  INIZIO PREPARAZIONE APK CON VITE E CAPACITOR
echo =========================================================
echo.

:: 1. INSTALLAZIONE DIPENDENZE PROGETTO
echo [FASE 1/6] Installazione delle dipendenze Node.js (Vite, React, ecc.)...
call npm install
if errorlevel 1 (
    echo !!! ERRORE !!! L'installazione delle dipendenze del progetto e' fallita.
    goto :fine
)
echo    Dipendenze del progetto installate.
echo.

:: 2. INSTALLAZIONE DIPENDENZE CAPACITOR
echo [FASE 2/6] Installazione delle dipendenze Capacitor (@capacitor/cli, @capacitor/android)...
call npm install @capacitor/cli @capacitor/core @capacitor/android
if errorlevel 1 (
    echo !!! ERRORE !!! L'installazione di Capacitor e' fallita.
    goto :fine
)
echo    Dipendenze Capacitor installate.
echo.

:: 3. INIZIALIZZAZIONE PROGETTO CAPACITOR
if not exist "capacitor.config.json" (
    echo [FASE 3/6] Inizializzazione progetto Capacitor...
    npx cap init "%NOME_PROGETTO%" "%APP_ID%"

    :: Aggiorna la configurazione per usare la cartella 'dist' di Vite
    echo    Aggiornamento webDir a '%VITE_OUTPUT_DIR%'...
    (for /f "tokens=*" %%i in (capacitor.config.json) do (
        set "line=%%i"
        if "!line:www=!" neq "!line!" (
            echo   "webDir": "%VITE_OUTPUT_DIR%"
        ) else (
            echo !line!
        )
    )) > capacitor.config.tmp
    move /y capacitor.config.tmp capacitor.config.json
    echo    Configurazione completata.

) else (
    echo [FASE 3/6] File capacitor.config.json trovato. Progetto gia' inizializzato.
)
echo.

:: 4. BUILD DI VITE (PWA)
echo [FASE 4/6] Esecuzione del build di produzione con Vite...
call npm run build
if errorlevel 1 (
    echo !!! ERRORE !!! Il build di Vite e' fallito. Controlla i messaggi.
    goto :fine
)
echo    Build di Vite completato con successo nella cartella '%VITE_OUTPUT_DIR%'.
echo.

:: 5. AGGIUNTA E SINCRONIZZAZIONE PIATTAFORMA ANDROID
echo [FASE 5/6] Aggiunta/sincronizzazione piattaforma Android...
if not exist "android" (
    echo    Aggiunta della piattaforma Android (richiede JDK installato)...
    npx cap add android
    if errorlevel 1 (
        echo !!! ERRORE !!! L'aggiunta della piattaforma Android e' fallita.
        echo Assicurati di avere Java Development Kit (JDK) installato e PATH configurato.
        goto :fine
    )
) else (
    echo    Piattaforma Android gia' presente.
)
echo    Sincronizzazione dei file (copia '%VITE_OUTPUT_DIR%' in 'android')...
npx cap sync
echo    Sincronizzazione completata.
echo.

:: 6. APERTURA ANDROID STUDIO
echo [FASE 6/6] Apertura di Android Studio...
npx cap open android

echo.
echo =========================================================
echo  PREPARAZIONE AUTOMATICA COMPLETATA!
echo =========================================================
echo.
echo La tua PWA e' stata compilata, sincronizzata con Capacitor e il
echo progetto Android Studio e' stato aperto.
echo.
echo Prossimi passi **MANUALI** in Android Studio:
echo 1. Attendi il caricamento completo del progetto e la sincronizzazione Gradle.
echo 2. Vai su **Build** -> **Generate Signed Bundle / APK...**
echo 3. Segui la procedura guidata per generare l'AAB o l'APK firmato.
echo.

:fine
endlocal
pause