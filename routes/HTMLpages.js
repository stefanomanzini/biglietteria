const router = require('express').Router();

const HTMLpage = require("../front end/HTMLpage")
const Bar = require("../front end/bar")
const Login = require("../front end/login")
const Form = require("../front end/form")
const ListaEventi = require("../front end/listaEventi")
const Event = require("../front end/event")


const Widget = require('../front end/widget');

const ProfiloUtente = require('../front end/profiloUtente');
const ConcediPrivilegi = require('../front end/concediPrivilegi');
const ListaUtenti = require('../front end/listaUtenti');
const CreaEvento = require('../front end/creaEvento');
const AggiornaEvento = require('../front end/aggiornaEvento');

const verifyToken = require('../middlewares/verifyToken');
const getToken = require('../middlewares/getToken');
const checkPrivileges = require('../middlewares/checkPrivileges');

const EventController = require('../controllers/EventController');
const eventController = new EventController();

const UserController = require('../controllers/UserController');
const userController = new UserController();



// Mappa la rotta della pagina iniziale

router.get('/', async (req, res) => {

    const token = getToken(req) //Ottiene il token associato all'utente

    let type = req.query.type //Ottiene la categoria degli evnti associati alla pagina web (parametro query string)

    //Se la categoria degli eventi non è specificata si imposta Cinema di default

    if (type==undefined)
      type = "Cinema"

    //Se l'utente non possiede il token di autenticazione viene generata la pagina per utenti ospiti

    if (! token){
      var result = await eventController.getEventByType(type);  //Ottiene la lista degli eventi per la categoria considerata
      const home_page = new HTMLpage()  //Crea una nuova pagina HTML  //Crea una nuova pagina HTML

      const bar = new Bar(home_page.body) //Crea la navigation bar
      bar.addItem("Accedi","window.location.href='/login'") //Aggiunge il pulsante per il login al menu a tendina della barra
      bar.addItem("Registrati","window.location.href='/sign-in'") //Aggiunge il pulsante per il registrarsi al menu a tendina della barra
      home_page.addChild(bar) //Aggiunge la navigation bar alla pagina HTML

      home_page.addChild(new ListaEventi(result[1],null)) //Aggiunge la lista degli eventi alla pagina HTML

      home_page.send(res) //Aggiunge la pagina web alla risposta HTTP
    }
    else
      res.redirect("/eventi?type="+type)  //Se l'utente possiede il token di autenticazione viene reindirizzato all'area riservata
    
});



// Mappa la rotta della pagina per il login

router.get('/login', async (req, res) => {

  const login_page = new HTMLpage()  //Crea una nuova pagina HTML
  login_page.setBackground("LogIn.png") //Imposta lo sfondo della pagina
  login_page.addChild(new Login())  //Aggiunge il form per il login alla pagina web
  login_page.send(res) //Aggiunge la pagina web alla risposta HTTP
  
});



// Mappa la rotta della pagina per recuperare la password di un account

router.get('/recupera-password', async (req, res) => {

    const login_page = new HTMLpage()  //Crea una nuova pagina HTML
    login_page.setBackground("LogIn.png") //Imposta lo sfondo della pagina

    const form = new Form("/")  //Crea un nuovo form
    form.setProperty("margin-top","10%") //Distanza della finestra di login dall'alto
    form.setProperty("margin-left","60%") //Distanza della finestra di login da sinistra
    form.setProperty("padding-bottom","40px") //Spazio in basso alla finestra
    form.setProperty("width","340px") //Lunghezza della finestra di login
    login_page.addChild(form) //Aggiunge il form alla pagina web

    const label = new Widget("p","Inserendo i propri dati si riceverà una mail contenente le istruzioni per recuperare la password")  //Crea un tag di tipo p
    label.setProperty("text-align","center"); //Imposta l'allineamento del testo
    label.setProperty("color","rgb(133, 127, 127)");  //Imposta il colore del testo
    label.setProperty("margin-bottom","20px");  //Imposta il margine dal basso
    form.addChild(label)  //Aggiunge il testo al form

    form.addField("name","Nome")  //Aggiunge un campo al form per inserire il nome
    form.addField("surname","Cognome")  //Aggiunge un campo al form per inserire il cognome
    form.addField("email","E-mail","email") //Aggiunge un campo al form per inserire l'e-mail

    const button = form.addButton("Avanti") //Aggiunge il pulsante per recuperare la password
    button.setProperty("margin-top","10%")  //Margine dall'alto
    button.setProperty("background-color","rgba(24,119,242,255)") //Colore di sfondo del pulsante
    
    login_page.send(res) //Aggiunge la pagina web alla risposta HTTP
  
});



// Mappa la rotta della pagina per creare un nuovo account

router.get('/sign-in', async (req, res) => {

    const signin_page = new HTMLpage()  //Crea una nuova pagina HTML
    signin_page.setBackground("SignIn.png") //Imposta lo sfondo della pagina web

    const form = new Form("'javascript: signin()'") //Crea un nuovo form
    form.addField("Nome")  //Aggiunge un campo al form per inserire il nome
    form.addField("Cognome")  //Aggiunge un campo al form per inserire il cognome
    form.addField("Mail","email") //Aggiunge un campo al form per inserire l'email
    form.addField("Telefono","tel") //Aggiunge un campo al form per inserire il telefono
    form.addField("'Data di nascita'","date") //Aggiunge un campo al form per inserire la data di nascita
    signin_page.addChild(form)  //Aggiunge il form alla pagina web

    const radio_buttons = form.addRadioButtons("Genere",["Donna","Uomo","Altro"]) //Aggiunge i radio buttons per selezionare il genere dell'utente
    radio_buttons.setProperty("margin-left","172px") //Distanza del contenitore dei radio buttons dal bordo sinistro

    form.addField("Password","password") //Aggiunge un campo al form per inserire la password da usare
    const conferma_password = form.addField("'Conferma password'","password") //Aggiunge un campo al form per confermare la password
    conferma_password.setAttribute("onchange","confermaPassword(this)") //Imposta l'azione (lato client) da eseguire quando si inserisce la conferma della password (controlla se password e conferma sono uguali)

    form.addInfoMessage("I dati inseriti non sono validi").setProperty("margin-left","36%") //Aggiunge un oggetto che visualizza un messaggio informativo in caso di errore
    form.addButton("Registrati")  //Aggiunge il pulsante per registare l'account

    signin_page.send(res) //Aggiunge la pagina web alla risposta HTTP
    
});



// Mappa la rotta della pagina per creare un nuovo evento

router.get('/new-event', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Organizzatore eventi"], next), async (req, res) => {

    page = new CreaEvento(req.user) //Crea una nuova pagina HTML (area riservata)
    
    page.send(res) //Aggiunge la pagina web alla risposta HTTP
    
});



// Mappa la rotta della pagina per modificare un evento esistente

router.get('/modify-event', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Organizzatore eventi"], next), async (req, res) => {

  var result = await eventController.getEvent(req.query.id);  //Ottiene i dati relativi all'evento cercato

  const page = new AggiornaEvento(req.user,result[1].toJSON()) //Crea una nuova pagina HTML (area riservata)
  
  page.send(res) //Aggiunge la pagina web alla risposta HTTP
  
});



// Mappa la rotta della pagina in cui vengono visualizzati tutti gli utenti registrati al sito web

router.get('/users', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Staff biglietteria"], next), async (req, res) => {

  var result = await userController.getAllUsers();  //Ottiene la lista di tutti gli utenti registrati
  const page = new ListaUtenti(req.user,result[1])
  res.status = result[0]  //Stato della richiesta
  page.send(res) //Aggiunge la pagina web alla risposta HTTP
  
});



// Mappa la rotta della pagina che permette di modificare i privilegi degli utenti

router.get('/grant-privileges', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Staff biglietteria"], next), async (req, res) => {
  
  page = new ConcediPrivilegi(req.user)
  page.send(res) //Aggiunge la pagina web alla risposta HTTP

});



// Mappa la rotta della pagina in cui sono mostrati tutti gli eventi disponibili sul sito

router.get('/eventi', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Cliente","Organizzatore eventi","Staff biglietteria","Annullatore"], next), async (req, res) => {

  var result = await eventController.getEventByType(req.query.type);  //Ottiene tutti gli eventi associati alla categoria specificata
  const event_page = new HTMLpage(req.user) //Crea una nuova pagina HTML (area riservata)
  event_page.addChild(new ListaEventi(result[1],req.user.privileges)) //Aggiunge la lista degli eventi alla pagina web
  event_page.send(res) //Aggiunge la pagina web alla risposta HTTP
});



//Mappa la rotta della pagina in cui il cliente può acquistare i biglietti

router.get('/acquista', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Cliente"], next), async (req, res) => {

  var result = await eventController.getEvent(req.query.id);  //Ottiene i dati relativi all'evento cercato
  const event_page = new HTMLpage(req.user) //Crea una nuova pagina HTML (area riservata)

  const form = new Form("'javascript: buyTicket()'")  //Crea un nuovo form
  form.setProperty("margin-top","80px")  //Margini dall'alto
  form.setProperty("margin-left","300px") //Margini da sinistra
  form.setProperty("width","800px") //Lunghezza
  event_page.addChild(form) //Aggiunge il form alla pagina web

  const logo = new Widget("img")  //Crea un nuovo tag di tipo img
  logo.setAttribute("src","BuyTicket.png")  //Imposta la sorgente dell'immagine
  logo.setProperty("width","50%") //Lunghezza dell'immagine
  form.addChild(logo) //Aggiunge il logo al form

  //Riquadro con i dati dell'evento

  const evento = new Event(result[1]) //Crea un nuovo evento (widget)
  evento.setProperty("margin-top","40px") //Margini dall'alto
  evento.setProperty("margin-bottom","60px")  //Margini dal basso
  evento.setProperty("margin-left","0") //Margini da sinistra
  evento.addPrice() //Aggiunge il prezzo
  evento.addNumberTicketField() //Aggiunge un campo per selezionare il numero di biglietti da acquistare
  evento.addData(["Luogo","Data_Evento","Posti_disponibili","Orario","Organizzatore"]) //Specifica i campi da visulizzare
  form.addChild(evento) //Aggiunge l'evento al form

  //Radio buttons per i metodi di pagamento

  pay_methods_type = ["paypal","visa","mastercard"] //Metodi di pagamento
  pay_methods = []

  //Per ogni metodo di pagamento crea il corrsipondente radio button

  for (let i=0;i< pay_methods_type.length; i+=1){
    const pay_method = new Widget("img")  //Crea un tag di tipo img
    pay_method.setAttribute("src",pay_methods_type[i]+".png") //Imposta la sorgente dell'immagine
    pay_method.setAttribute("width","60px") //Imposta la lunghezza
    pay_methods.push(pay_method.get())  //Aggiunge l'elemento alla lista
  }

  const radio_buttons = form.addRadioButtons("metodi_pagamento",pay_methods)  //Aggiunge i radio buttons al form
  radio_buttons.setProperty("margin-bottom","40px") //Margini dall'alto
  radio_buttons.setProperty("margin-left","160px")  //Margini da sinistra

  //Messaggio informativo

  const info = form.addInfoMessage("Il metodo di pagamento selezionato non è disponibile")  //Aggiunge un oggetto che visualizza un messaggio informativo in caso di errore
  info.setProperty("margin-left","190px") //Margini da sinistra
  info.setProperty("color","var(--tema)") //Colore del testo

  form.addButton("Acquista").setProperty("background-color","var(--tema)")  //Aggiunge il pulsante per acquistare i biglietti al form

  event_page.send(res) //Aggiunge la pagina web alla risposta HTTP

});



// Mappa la rotta della pagina web in cui sono memorizzati i dati del profilo di un utente

router.get('/profilo', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Cliente","Organizzatore eventi","Staff biglietteria","Annullatore"], next),async (req, res) => {

  var result = await userController.getUser(req.user.userID); // req.params.userID sarebbe -> .../api/users/5 -> ottiene l'utente 5
  
  const page = new ProfiloUtente(req.user,result[1].toJSON())
  
  res.status = result[0]
  page.send(res) //Aggiunge la pagina web alla risposta HTTP

});


//!!!NOTA!!! Queste sotto di rotte vanno sistemate....


// Mappa la rotta della pagina web per scannerizzare i QRcode

router.get('/annulla-biglietti', verifyToken, (req, res, next) => checkPrivileges(req, res, ["Annullatore"], next),async (req, res) => {

  const invalid_ticket_page = new HTMLpage(req.user) //Crea una nuova pagina HTML (area riservata)
  const form = new Form()
  form.setProperty("margin-top","60px")
  invalid_ticket_page.addChild(form)

  const logo = new Widget("img")  //Crea un nuovo tag di tipo img
  logo.setAttribute("src","Annulla-biglietti.png")  //Imposta la sorgente dell'immagine
  logo.setProperty("width","50%") //Lunghezza dell'immagine
  logo.setProperty("margin-bottom","20px")  //Margini dal basso
  form.addChild(logo) //Aggiunge il logo al form

  invalid_ticket_page.send(res) //Aggiunge la pagina web alla risposta HTTP

});


router.get('/biglietti', async (req, res) => {
    
  /*
    const ticket_page = new HTMLpage()  //Crea una nuova pagina HTML
    let data = biglietti[req.query.id]
    let titolo = "Biglietti emessi per l'evento "+req.query.id
    ticket_page.addChild(new Table(data,titolo))
    ticket_page.send(res) //Aggiunge la pagina web alla risposta HTTP */
    res.send("!!!NOTA!!!! Inserire la pagina per vedere la lista dei piglietti emessi") 
});


router.get('/ingressi', async (req, res) => {
    
    res.send("!!!NOTA!!!! Inserire la pagina per vedere la lista degli ingressi") 
});




module.exports = router;