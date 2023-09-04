
import { Icon } from 'leaflet';
import React, { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';

const MarkerCustom = (props) => { 
    const map = useMap();
    map.flyTo({lat: props.position.latitude, lng: props.position.longitude}, 14);
    const customIcon= new Icon({
        iconUrl:"https://i.ibb.co/r40cPn9/pin.png",
        iconSize:[34, 34]
    })

    useEffect(()=>{
        if(props.position){
            fetch(`https://us1.locationiq.com/v1/reverse?key=${process.env.REACT_APP_LOCATION_IQ}&lat=${props.position.latitude}&lon=${props.position.longitude}&format=json`)
            .then(res=>res.json())
            .then(data=>{
                props.locationInfo(data);
            })
        }
    },[props.position])
    return (
        <div>
            <Marker icon={customIcon} position={[props.position.latitude, props.position.longitude]} eventHandlers={{click: (e)=>{
                map.flyTo(e.latlng, 18);
            }}}>

            </Marker>
        </div>
    );
};

export default MarkerCustom;