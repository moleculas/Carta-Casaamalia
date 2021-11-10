import React, { createContext, useState } from 'react';

export const CartaContext = createContext();

const CartaProvider = (props) => {

    const [logged, setLogged] = useState(false);
    const [usuari, setUsuari] = useState('');
    const [dadesCarregadesCarta, setDadesCarregadesCarta] = useState(false);
    const [dadesCarregadesVins, setDadesCarregadesVins] = useState(false);
    const [laDataXMLCarta, setLaDataXMLCarta] = useState('');
    const [laDataXMLVins, setLaDataXMLVins] = useState('');
    const [itemsCat1, setItemsCat1] = useState([]);
    const [itemsCat2, setItemsCat2] = useState([]);
    const [itemsCat3, setItemsCat3] = useState([]);
    const [itemsCat4, setItemsCat4] = useState([]);
    const [itemsCat5, setItemsCat5] = useState([]);
    const [itemsCat6, setItemsCat6] = useState([]);
    const [itemsCat7, setItemsCat7] = useState([]);
    const [itemsCat8, setItemsCat8] = useState([]);
    const [fetCanviCarta, setFetCanviCarta] = useState(false);
    const [fetCanviVins, setFetCanviVins] = useState(false);

    return (
        <CartaContext.Provider value={{ 
            logged, 
            setLogged, 
            usuari,
            setUsuari,
            dadesCarregadesCarta, 
            setDadesCarregadesCarta, 
            dadesCarregadesVins, 
            setDadesCarregadesVins,
            itemsCat1, 
            setItemsCat1,
            itemsCat2, 
            setItemsCat2,
            itemsCat3, 
            setItemsCat3,
            itemsCat4, 
            setItemsCat4,
            itemsCat5, 
            setItemsCat5,
            itemsCat6, 
            setItemsCat6,
            itemsCat7, 
            setItemsCat7,
            itemsCat8, 
            setItemsCat8,
            laDataXMLCarta, 
            setLaDataXMLCarta,
            laDataXMLVins, 
            setLaDataXMLVins,
            fetCanviCarta, 
            setFetCanviCarta,
            fetCanviVins, 
            setFetCanviVins
            }}>
            {props.children}
        </CartaContext.Provider>
    )
}

export default CartaProvider;