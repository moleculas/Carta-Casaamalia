let rutaApi, rutaServer
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    rutaApi = "http://localhost/api_casaamalia/index/";
    //rutaServer = window.location.protocol + "//" + window.location.host    

} else {
    rutaServer = window.location.protocol + "//" + window.location.host + "/gestio";
    rutaApi = rutaServer + "/api/";    
}

const subdirectoriProduccio='/gestio';
//afegir a package.json: "homepage": "https://carta.casaamalia.com/gestio",

const Constantes = {  
    SUBDIRECTORI_PRODUCCIO: subdirectoriProduccio, 
    RUTA_API: rutaApi,
    PARADES: [
        'No',
        '(183) Cansaladeria & Xarcuteria Ollé',
        '(61-66) Fruites i Verdures Francisco - Mari',
        '(59-60 - 60 bis) Carns Paloma',
        '(162-165) Verdures i Fruits Molins',
        '(69-76) Avinova - Mercè',
        '(77-81) Xarcuteria Cansaladeria Filo',
        '(144-155 & 158-160) Marisc i Peix M. Pintanel',
        '(156-157) Cut Fish',
        '(84-89) Sunta, Peixaters de Barcelona',
        '(82-83) Pesca Salada Mañé',
        '(90-91-92) Peix Fresc Pilar',
        '(93-94) Peix de Platja Enric Bassó',
        '(133-137) Fina - Coloma',
        '(138-139) La Ideal',
        '(98-101) Fruites i Verdures E. Siscart',
        '(95-96) Anna i Veronica, aviram i caça selecta',
        '(104) El Racó dels Embotits, Rosa & Iris',
        '(122-125) Xarcuteria Torres-Vilà',
        '(118-121) Llegums cuits, menjars preparats i fruits secs F. Lorente',
        '(115) Fruites i Verdures Jose Mª - Carmen',
        '(106-109) Carnisseria Debon',
        '(110-111) Angeleta',
        '(112-113) Carnes Selectas Conxi',
        '(105) Olives i Conserves Mª Rosa Benet',
        '(19-21) Xarcuteria Yeste',
        '(29-32) Xarcuteria TOTBO DEBÓN',
        '(39) Farina, Pasta Fresca Artesanal',
        '(42-46) Fruites i Verdures Manolita',
        '(52-55) Carnisseria Cinta',
        '(3-5) Frutas y Verduras Vilaseca',
        '(6-7) Bacallaneria Masclans',
        '(8-11) Carnisseria Figueras',
        '(12-13) Xarcuteria Teruel',
        '(179-182) Llegums cuits, menjars preparats i fruits secs F. Lorente',
        '(47-48-49) Especialitats Marta',
    ],
    
    PUNTUACIO: [
        {
            value: '0',
            label: 'No',
        },
        {
            value: '90',
            label: '90 punts',
        },
        {
            value: '91',
            label: '91 punts',
        },
        {
            value: '92',
            label: '92 punts',
        },
        {
            value: '93',
            label: '93 punts',
        },
        {
            value: '94',
            label: '94 punts',
        },
        {
            value: '94_2',
            label: '94+ punts',
        },
        {
            value: '95',
            label: '95 punts',
        },
        {
            value: '96',
            label: '96 punts',
        },
        {
            value: '97',
            label: '97 punts',
        }
    ]
};
export default Constantes;