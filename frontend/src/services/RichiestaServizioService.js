const API_URL = "http://localhost:8080";;

const getAuthToken = () => localStorage.getItem("token");

export const creaRichiestaServizio = async (richiestaData) => {
  /*
    richiestaData deve essere un oggetto JSON:
    {
      testo: "Ho bisogno di spesa a domicilio...",
      dataRichiesta: "2025-11-28", (formato SQL Date yyyy-mm-dd)
      beneficiario: "email.beneficiario@example.com",
      enteVolontario: "email.destinatario@example.com"
    }
  */
  
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/richiestaServizio/creaRichiestaServizio?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(richiestaData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Errore nella creazione della richiesta");
    }

    return await response.text();
  } catch (error) {
    console.error("Errore API Richiesta Servizio:", error);
    throw error;
  }
};