
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: './icons/marker-icon-2x.png',
  iconUrl: './icons/marker-icon.png',
  shadowUrl: './icons/marker-shadow.png',
});

export default function MapComponent() {
  return (
     <div className="h-[150px] w-[200px] sm:h-[200px] sm:w-[320px] md:h-[120px] md:w-[150px] lg:h-[150px] lg:w-[200px] xl:h-[250px] xl:w-[300px] mx-auto rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={[-8.325394, 114.335867]} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full"
        zoomControl={true}
        doubleClickZoom={true}
        closePopupOnClick={false}
        dragging={true}
        zoomSnap={1}
        zoomDelta={1}
        trackResize={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
          tileSize={256}
        />
        <Marker position={[-8.325394, 114.335867]}>
          <Popup 
            closeButton={true}
            autoClose={false}
            closeOnEscapeKey={true}
            className="custom-popup"
          >
            <div className="text-sm font-medium text-gray-800 p-1">
              <strong>KaloriME Office</strong>
              <br />
              Watukebo, Kabupaten Banyuwangi
              <br />
              Jawa Timur, Indonesia
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}