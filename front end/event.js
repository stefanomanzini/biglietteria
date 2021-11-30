const Widget = require("./widget")


/*La classe Event crea il widget contenente i vari dati relativi ad un certo evento,
che viene mostrato nella pagina principale del sito. 

Il costruttore richiede come parametro un oggetto contenente i dati relativi all'evento.

Eredita dalla classe Widget. */

class Event extends Widget{

    constructor(evento){
        
        super("div")    //Viene creato un tag di tipo div
        this.evento = evento
        evento["Posti_disponibili"] = evento["Posti_disponibili"]+"/"+evento["Posti_totali"]

        //Proprietà CSS del contenitore
        
        this.setProperty("border","solid") //Tipo di bordo dell'evento
        this.setProperty("border-color","var(--tema)") //Colore del bordo dell'evento
        this.setProperty("border-width","1px") //Spessore delbordo dell'evento
        this.setProperty("border-radius","3px") //Raggio del bordo dell'evento (rende il bordo arrotondato)
        this.setProperty("background-color","rgba(255, 255, 255, 0.8)") //Colore di sfondo dell'evento
        this.setProperty("box-shadow","0 4px 8px 0 rgba(0, 0, 0, 0.2)") //Ombra dell'evento
        this.setProperty("width","800px") //Lunghezza dell'evento
        this.setProperty("margin-left","22%") //Distanza dell'evento dal bordo sinistro
        this.setProperty("margin-bottom","20px") //Distanza dell'evento dal bordo in basso
        this.setProperty("text-align","center") //Allineamento del testo
        this.setProperty("font-family","arial") //Font del testo
        this.setProperty("display","grid") //I figli di questa classe sono disposti a griglia
        this.setProperty("grid-template-columns","24% 52% 24%") //Lunghezze delle colonne della griglia

        
        //Viene aggiunta l'icona dell'evento (colonna di sinistra)

        const immagine = new Widget("img")   //Crea un tag di tipo img
        immagine.setAttribute("src",evento.Icona_evento)  //Viene impostata l'immagine da visualizzare (stringa base64)
        immagine.setProperty("padding-left","10px")  //Spazio a sinistra intorno all'icona
        immagine.setProperty("padding-top","10px")  //Spazio in alto intorno all'icona
        immagine.setProperty("padding-bottom","10px")  //Spazio in basso intorno all'icona
        immagine.setProperty("margin","auto")  //Spazio intorno all'icona
        immagine.setProperty("width","100%")  //Lunghezza dell'immagine
        this.addChild(immagine) //Aggiunge l'immagine al contenitore


        //Vengono aggiunti i dettagli dell'evento (colonna centrale)

        this.data = new Widget("div")    //Viene creato un tag di tipo div
        this.data.setProperty("padding","20px") //Spazio intorno ai dettagli dell'evento
        this.data.setProperty("margin-left","5%") //Distanza dell'oggetto dal bordo sinistro 
        this.data.setProperty("margin-top","2%") //Distanza dell'oggetto dal bordo in alto
        this.data.setProperty("font-family","'Signika', sans-serif") //Font usato per il testo
        this.data.setProperty("color","rgb(172, 157, 157)") //Colore usato per il testo
        this.addChild(this.data)    //Aggiunge i dettagli dell'evento al contenitore

        const titolo = new Widget("h1",evento.Nome)    //Viene creato un tag di tipo h1
        titolo.setProperty("text-align","center") //Allineamento del testo
        titolo.setProperty("color","black") //Colore del testo
        titolo.setProperty("font-size","180%") //Dimensione del testo
        titolo.setProperty("padding-bottom","20px") //Spazio dal basso
        titolo.setProperty("margin","0") //Margini
        titolo.setProperty("width","100%")  //Lunghezza del titolo
        this.data.addChild(titolo)  //Aggiunge il titolo al widget contenente i dettagli dell'evento
        

        //Vengono aggiunti il prezzo dell'evento (colonna destra)
        
        this.contenitore = new Widget("div")   //Viene creato un tag di tipo div
        this.contenitore.setProperty("color","var(--tema)") //Colore del prezzo dell'evento
        this.contenitore.setProperty("font-weight","bold") //Il prezzo viene scritto in grassetto
        this.contenitore.setProperty("font-size","22px") //Dimensione del testo del prezzo
        this.contenitore.setProperty("text-align","center") //Allineamento del testo
        this.contenitore.setProperty("margin","auto") //Margini
        this.addChild(this.contenitore) //Aggiunge il widget al contenitore
        
    }


    /*La funzione permette di aggiungere un pulsante al contenitore dell'evento. La funzione
    richiede come parametri il testo del pulsante e il link da aprire premendo il pulsante. */

    addButton(text,link,new_tab=false){

        const button = new Widget ("button",text)   //Viene creato un tag di tipo button

        if (new_tab)
            button.setAttribute("onclick","window.open("+link+")")   //Viene impostato il link associato al pulsante (apre una nuova scheda)
        else
            button.setAttribute("onclick","window.location.href="+link)   //Viene impostato il link associato al pulsante
            
        button.setProperty("border","solid") //Tipo di bordo
        button.setProperty("border-radius","8px") //Raggio del bordo del pulsante (rende il pulsante arrotondato)
        button.setProperty("padding","10px") //Spazio intorno al pulsante
        button.setProperty("color","white") //Colore del testo
        button.setProperty("background-color","var(--tema)") //Colore di sfondo del pulsante
        button.setProperty("cursor","pointer") //Modifica il tipo di puntatore quando si passa sopra al pulsante
        button.setProperty("width","160px") //Lunghezza del pulsante
        button.setProperty("font-size","16px") //Dimensione del testo
        button.setProperty("margin-right","10%")    //Distanza dal margine destro

        this.contenitore.addChild(button) //Viene aggiunto il pulsante
        return button
    }

    
    /*La funzione permette di aggiungere il prezzo dell'evento all'interno del contenitore dell'evento.*/

    addPrice(){

        const prezzo = new Widget("p",this.evento.Prezzo+" €")  //Crea un tag di tipo p
        prezzo.setProperty("margin-right","10px") //Distanza dal margine destro
        this.contenitore.addChild(prezzo);   //Viene aggiunto il valore del prezzo
    }

    
    /*La funzione permette di  specificare i campi da aggiungere al contenitore dell'evento. La funzione
    richiede come parametro una lista di tutti i campi da visualizzare. */

    addData(attributi){

        //Aggiunge i vari dati dell'evento ai campi

        for (let i=0; i<attributi.length; i++){
            if (this.evento[attributi[i]]!="Nessuno"){
                const details = new Widget("p",attributi[i].replace("_"," ")+": "+this.evento[attributi[i]])  //Crea un tag di tipo p
                details.setProperty("text-align","left") //Allineamento del testo
                details.setProperty("margin","0") //Margini
                this.data.addChild(details) //Aggiunge i dati al contenitore dell'evento
            }
        }
    }

    
    /*La funzione permette di aggiungere un campo per selezionare il numero di biglietti da acquistare
     al contenitore dell'evento. */

    addNumberTicketField(){

        const numero_biglietti = new Widget ("input")   //Viene creato un tag di tipo input

        numero_biglietti.setAttribute("id","ticketNumber")  //ID del campo
        numero_biglietti.setAttribute("type","number")  //Tipo di campo
        numero_biglietti.setAttribute("value","1")  //Valore di default

        numero_biglietti.setProperty("font-size","80%") //Dimenzione del testo del campo
        numero_biglietti.setProperty("height","32px") //Altezza del campo
        numero_biglietti.setProperty("width","60px") //Lunghezza del campo
        numero_biglietti.setProperty("padding-left","20px") //Spazio a sinistra del campo
        numero_biglietti.setProperty("margin-right","10px") //Distanza dal margine destro
        numero_biglietti.setProperty("border","1px solid #ccc") //Tipo di bordo del campo
        numero_biglietti.setProperty("border-radius","10px") //Raggio del bordo del campo (rende il campo arrotondato)

        this.contenitore.addChild(numero_biglietti)
    }

}



module.exports = Event;