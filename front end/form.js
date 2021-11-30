const Widget = require("./widget")


/*La classe Form permette di implementare un form all'interno delle pagine web.
Il costruttore richiede come parametro l'azione (script javascript lato client) da eseguire
quando viene premuto il pulsante invio. 

Eredita dalla classe Widget.*/

class Form extends Widget{

    //Costruisce il form
    
    constructor(action) {
        super("form")    //Viene creato un tag di tipo form
        this.setAttribute("action",action)  //Imposta la funzione che viene attivata quando si preme il pulsante (invia i dati al server)
        this.setProperty("background-color","rgba(225,236,245,255)")  //Colore di sfondo del form
        this.setProperty("margin-top","14%") //Distanza del form dal bordo in alto
        this.setProperty("margin-left","25%") //Distanza del form dal bordo sinistro
        this.setProperty("width","50%") //Lunghezza del form
        this.setProperty("padding","20px") //Spazio intorno al form
        this.setProperty("border-radius","10px") //Raggio del bordo del form (rende il form arrotondato)
        this.setProperty("font-family","'Signika', sans-serif") //Font usato nel form
    }


    /*La funzione permette di inserire un nuovo campo all'interno del form. La funzione richiede 
    come parametri: l'id da associare al campo, il placeholder che viene mostrato nel campo e il tipo 
    di campo (testo, data, orario, ...) */

    addField(placeholder,type="text")  {

        const field = new Widget("input")  //Viene creato un tag di tipo input, associandogli la classe css "Field"
        field.setAttribute("id",placeholder.replaceAll(" ","_"));   //Imposta l'id
        field.setAttribute("name","field");  //Imposta il nome del campo
        field.setAttribute("placeholder",placeholder);    //Imposta il segnaposto
        field.setAttribute("required","true");    //Specifica che il campo è obbligatorio
        field.setAttribute("type",type);  //Imposta il tipo dell'evento

        field.setProperty("font-size","100%") //Dimenzione del testo del campo
        field.setProperty("height","48px") //Altezza del campo
        field.setProperty("width","99%") //Lunghezza del campo
        field.setProperty("padding-left","5%") //Spazio a sinistra del campo
        field.setProperty("margin-top","10px") //Distanza del campo dal bordo in alto
        field.setProperty("margin-left","0.5%") //Distanza del campo dal bordo sinistro
        field.setProperty("border","1px solid #ccc") //Tipo di bordo del campo
        field.setProperty("border-radius","10px") //Raggio del bordo del campo (rende il campo arrotondato)

        this.addChild(field)    //Aggiunge il campo al form

        return field
    }


    /*La funzione permette di inserire un nuovo pulsante all'interno del form. La funzione richiede come parametri: 
    il testo del pulsante e la funzione da invocare alla pressione del pulsante (è una funzione che viene
    eseguita lato client!!!). */

    addButton(text,onclick=null){

        const button = new Widget("input") //Viene creato un tag di tipo input
        button.setAttribute("value",text);  //Imposta il testo del pulsante
        if (onclick==null)
            button.setAttribute("type","submit")   //Un pulsante di tipo submit, quando premuto invia i dati del form al server
        else
            button.setAttribute("type","button")   //Un pulsante di tipo button, quando premuto esegue la funzione passata per parametro al costruttore
            button.setAttribute("onclick",onclick);    //Imposta la funzione da invocare alla pressione del pulsante

        button.setProperty("border","hidden") //Tipo di bordo del pulsante
        button.setProperty("border-radius","10px") //Raggio del bordo del pulsante (rende il pulsante arrotondato)
        button.setProperty("padding","12px") //Spazio intorno al pulsante
        button.setProperty("background-color","rgb(66,183,42)") //Colore di sfondo del pulsante
        button.setProperty("color","rgb(255, 255, 255)") //Colore del testo del pulsante
        button.setProperty("width","100%") //Lunghezza del pulsante
        button.setProperty("text-align","center") //Allineamento del testo
        button.setProperty("cursor","pointer") //Modifica il tipo di puntatore quando si passa sopra al pulsante
        button.setProperty("font-size","100%") //Dimensione del testo del pulsante     

        this.addChild(button)   //Aggiunge il pulsante al form
        
        return button
    }

    /*La funzione permette di inserire un gruppo di radio buttons all'interno del form. La funzione richiede come parametri: 
    l'id da associare ai radio buttons e una lista di campi (i campi dei radio buttons). */

    addRadioButtons(id,campi){

        const radio_buttons = new Widget("object")   //Viene creato un tag di tipo p
        radio_buttons.setAttribute("id",id);  //Imposta l'id
        radio_buttons.setAttribute("name","field");  //Imposta il nome del campo

        radio_buttons.setProperty("color","rgb(153, 148, 148)") //Colore del testo dei radio buttons
        radio_buttons.setProperty("width","100%") //Lunghezza del contenitore dei radio buttons

        //Aggiunge i radio buttons al contenitore

        for (let i=0;i<campi.length;i+=1){

            const button = new Widget("input",campi[i]) //Crea un nuovo tag di tipo input
            button.setAttribute("valore","'"+campi[i]+"'")    //Imposta il valore
            button.setAttribute("type","radio")   //Imposta il tipo di input
            button.setAttribute("name",id)   //Imposta il nome del bottone (serve per raggruppare insieme i bottoni)
            button.setAttribute("required","true")   //Il campo è obbligatorio
            button.setAttribute("oninput","this.parentNode.value=this.getAttribute('valore')")   //Quando si sceglie un bottone, il valore verrà salvato

            button.setProperty("margin-left","6%") //Distanza del radio button da sinistra
            button.setProperty("margin-right","10px") //Distanza del radio button da destra
            button.setProperty("margin-top","30px") //Distanza del radio button dall'alto
            button.setProperty("margin-bottom","10px") //Distanza del radio button dal basso

            radio_buttons.addChild(button)  //Aggiunge il radio button al contenitore
        }

        this.addChild(radio_buttons)    //Aggiunge i radio buttons al form

        return radio_buttons
    }

    /* La funzione inserisce un oggetto nel form, che visualizza un messaggio nel caso si verifichi
    un errore. */

    addInfoMessage(text){

        const message = new Widget("H5",text) //Viene creato un tag di tipo H%
        message.setAttribute("id","info")   //Imposta l'id del tag

        message.setProperty("color","red") //Colore del testo
        message.setProperty("font-size","96%") //Dimensione del testo
        message.setProperty("display","none") //Il widget non viene mostrato (viene visualizzato solo in caso di errore)

        this.addChild(message)  //Aggiunge il widget al form

        return message
    }
}



module.exports = Form;