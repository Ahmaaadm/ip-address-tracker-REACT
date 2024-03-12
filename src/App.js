import React, { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css"
import arrow from './images/icon-arrow.svg'
import background from './images/pattern-bg.png'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import MarkerPosition from './MarkerPosition';

function App() {
    const [address, setAddress] = useState(null)
    const [ipAddress, setIpAddress] = useState("")

    const checkIpAddress =/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi

    const checkDomain =/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/


    useEffect(() => {
        try {
          const getInitialData = async () => {
            const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_NQx2PDaX4b236ZPfsKK2dZqCnNERr&ipAddress=5.8.128.1`)
            console.log(process.env.REACT_API_KEY)
            const data = await res.json()
            setAddress(data)
            console.log(data)
          }

          getInitialData()
        } catch (error) {
          console.trace(error)
        }
    },[])

    const getEnteredData = async () => {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_NQx2PDaX4b236ZPfsKK2dZqCnNERr&${
          checkIpAddress.test(ipAddress)
            ? `ipAddress=${ipAddress}`
            : checkDomain.test(ipAddress)
            ? `domain=${ipAddress}`
            : ""
        }`
      )
      const data = await res.json()
      setAddress(data)
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      getEnteredData()
      setIpAddress("")
    }
  return (
    <>
      <section>
        <div className='absolute -z-10'>
          <img src={background} alt='' className="w-full h-80 object-cover"/>
        </div>
        <article>
          <h1 className='py-2 lg:text-3xl text-2xl text-center text-white font-bold mb-1'>IP Address Tracker</h1>

          <form className='flex justify-center max-w-xl mx-auto' onSubmit={handleSubmit} autoComplete='off'>
            <input type="text" name="ipaddress" id="ipaddress" placeholder='search for any IP adresse or domain' required
            className='py-2 px-4 rounded-l-lg w-full' value={ipAddress} onChange={(e) => setIpAddress(e.target.value)}/>
            <button type='submit' className='bg-black py-4 px-4 rounded-r-lg hover:opacity-50'><img src={arrow} alt=""/></button>
          </form>
        </article>

        {address && <>
        
            <article className=' bg-white rounded-lg shadow p-8 mx-14 my-4 
            grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl lx:mx-auto
            text-center md:text-left lg:-mb-16 relative' style={{zIndex:10000}}>
              <div className='lg:border-r lg:border-slate-400'>
                <h2 className='uppercase text-sm font-bold text-slate-500 tracking-wide mb-3'>Ip Address</h2>
                <p className='font-bold text-slate-900 text-lg md:text-2xl xl:text-2xl '
                >{address.ip}</p>
              </div>
              <div className='lg:border-r lg:border-slate-400'>
                <h2 className='uppercase text-sm font-bold text-slate-500 tracking-wide mb-3'>Location</h2>
                <p className='font-bold text-slate-900 text-lg md:text-2xl xl:text-2xl '
                >{address.location.country}, {address.location.city}</p>
              </div>
              <div className='lg:border-r lg:border-slate-400'>
                <h2 className='uppercase text-sm font-bold text-slate-500 tracking-wide mb-3'>Time Zone</h2>
                <p className='font-bold text-slate-900 text-lg md:text-2xl xl:text-2xl '
                >UTC {address.location.timezone}</p>
              </div>
              <div className=' '>
                <h2 className='uppercase text-sm font-bold text-slate-500 tracking-wide mb-3'>ISP</h2>
                <p className='font-bold text-slate-900 text-lg md:text-2xl xl:text-2xl '
                >{address.isp}</p>
              </div>
            </article>
            <MapContainer center={[address.location.lat, address.location.lng]} zoom={13} scrollWheelZoom={true} style={{height:"600px", width:"100%"}}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition address={address} />
          </MapContainer>
        </>}
      </section>
    </>
  );
}

export default App;
